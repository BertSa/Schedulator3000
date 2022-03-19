import Swal, {SweetAlertOptions} from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const regexEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const regexPhone = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
export const regexPassword = /^[0-9a-zA-Z]{8,64}/;
export const ReactSwal = withReactContent(Swal);

const toastProps = {
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000
};
export const toastSuccess = Swal.mixin({
    icon: 'success',
    ...toastProps
} as SweetAlertOptions);
export const toastError = Swal.mixin({
    icon: 'error',
    ...toastProps
} as SweetAlertOptions);


export function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name)
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    };
}


export function getCurrentTimezoneDate(date: Date) {
   return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
}
export function getBeginningOfWeek(d:Date) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}
export function toLocalDateString(date: Date) {
    return date.toLocaleDateString('en-CA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
}
