import { OneOf } from './OneOf';

export type Nullable<T> = OneOf<T, null>;
