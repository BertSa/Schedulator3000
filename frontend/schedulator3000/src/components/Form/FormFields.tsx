import PropTypes from "prop-types";
import {FieldErrors} from 'react-hook-form';

FieldInput.propTypes = {
    register: PropTypes.func.isRequired,
    error: PropTypes.object,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf(['text', 'number', 'tel', 'email', 'password', 'date', 'time']).isRequired,
    validation: PropTypes.object.isRequired,
    autoComplete: PropTypes.string
};
type FieldInputProps = {
    register: Function,
    error?:  FieldErrors,
    name: string,
    label: string,
    placeholder?: string,
    type: 'text'|'number'|'tel'|'email'|'password'| 'date'| 'time'
    validation: object,
    autoComplete?: string
};
FieldInput.defaultProps = {
    placeholder: "",
};

export function FieldInput(props: FieldInputProps) {
    const {register, error, label, name, placeholder, type, validation, autoComplete} = props;
    return <div className="form-floating mb-2">
    <input id={name} name={name} placeholder={placeholder} className={"form-control" + (error ? " is-invalid" : "")}
    type={type} {...register(name, validation)} defaultValue={(type === "number" ? 0 : "")}
    autoComplete={autoComplete}/>
    <label htmlFor={name}>{label}</label>
    {error && <span className="text-danger">{error.message}</span>}
        </div>
    }
