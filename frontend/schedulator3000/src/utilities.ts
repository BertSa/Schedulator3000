import Swal, {SweetAlertOptions} from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
export const regexEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const regexPhone = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
export const regexPassword = /^[0-9a-zA-Z]{8,64}/;
export const ReactSwal = withReactContent(Swal)

const toastProps={
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
}
export const toastSuccess = Swal.mixin({
    icon: 'success',
    ...toastProps,
} as SweetAlertOptions);
export const toastError = Swal.mixin({
    icon: 'error',
    ...toastProps,
} as SweetAlertOptions);

