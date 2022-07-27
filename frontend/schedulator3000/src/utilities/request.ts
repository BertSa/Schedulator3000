interface IBaseResponse {
  statusCode?: number;
}

interface ISuccessResponse<T> extends IBaseResponse {
  data: T;
  ok: true;
}

interface IErrorResponse<E> extends IBaseResponse {
  errorData: E;
  ok: false;
}

export type NetworkError = 'TIMEOUT' | 'JSON_PARSING' | 'OTHER';

interface INetworkErrorResponse extends IBaseResponse {
  networkError: NetworkError;
  ok: false;
  errorData: { message: 'NetworkError' }
}

export type TResponse<T, E> =
  | ISuccessResponse<T>
  | IErrorResponse<E>
  | INetworkErrorResponse;

export type HttpType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE';

export interface IExtraHeader {
  key: string;
  value: string;
}

export interface IRequestBasicParams<Body> {
  body?: Body;
  extraHeaders?: IExtraHeader[];
  method: HttpType;
  jsonRequest?: boolean;
  jsonResponse?: boolean;
  timeout?: number;
  url: string;
}

export interface IValidStatusCode {
  expectedStatusCodes?: number[];
}

export type IRequestParams<B> = IRequestBasicParams<B> & IValidStatusCode;

const bodyHttpTypes: HttpType[] = [
  'POST',
  'PUT',
  'DELETE',
];

const defaultRequestParams = {
  jsonRequest: true,
  jsonResponse: true,
  timeout: 12000,
};

function isStatusCodeValid(statusCode: number, expectedStatusCodes: number[] | undefined) {
  if (expectedStatusCodes) {
    return expectedStatusCodes.includes(statusCode);
  }

  return statusCode > 199 && statusCode < 300;
}

export function request<Return, Error, Body = unknown>(
  requestParams: IRequestParams<Body>,
): Promise<TResponse<Return, Error>> {
  const processedParams = { ...defaultRequestParams, ...requestParams };
  const {
    url,
    method,
    body,
    extraHeaders,
    jsonResponse,
    jsonRequest,
    expectedStatusCodes,
    timeout,
  } = processedParams;
  let statusCode: number;
  const headers: Record<string, string> = {};
  if (jsonRequest) {
    headers['Content-Type'] = 'application/json';
  }
  if (jsonResponse) {
    headers.Accept = 'application/json';
  }
  if (extraHeaders) {
    extraHeaders.forEach((h) => { (headers[h.key] = h.value); });
  }
  const params: RequestInit = {
    method,
    headers,
  };
  if (body && bodyHttpTypes.includes(method)) {
    if (jsonRequest) {
      params.body = JSON.stringify(body);
    } else {
      params.body = body as any;
    }
  }

  return Promise.race([
    fetch(url, params),
    new Promise((_, reject) => {
      setTimeout(() => {
        statusCode = 408;
        const err: NetworkError = 'TIMEOUT';
        reject(err);
      }, timeout);
    }),
  ])
    .then((res: unknown) => {
      const response = res as Response;
      statusCode = response.status;
      if (jsonResponse) {
        return response.json();
      }
      return response.text();
    })
    .then((data: Return | Error) => {
      const validStatusCode = isStatusCodeValid(statusCode, expectedStatusCodes);
      if (validStatusCode) {
        const response: ISuccessResponse<Return> = {
          statusCode,
          data: data as Return,
          ok: true,
        };
        return response;
      }
      const response: IErrorResponse<Error> = {
        statusCode,
        errorData: data as Error,
        ok: false,
      };
      return response;
    })
    .catch((err: NetworkError | Error) => {
      let networkError: NetworkError = err === 'TIMEOUT' ? 'TIMEOUT' : 'OTHER';
      if (Object.hasOwn(err as any, 'type') && (err as any).type === 'invalid-json') {
        networkError = 'JSON_PARSING';
      }
      const response: INetworkErrorResponse = {
        statusCode,
        networkError,
        errorData: { message: 'NetworkError' },
        ok: false,
      };
      return response;
    });
}
