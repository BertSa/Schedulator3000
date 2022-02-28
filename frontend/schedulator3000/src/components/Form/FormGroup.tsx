import React from "react";
import PropTypes from "prop-types";

export function FormGroup(props:FormGroupProps) {
    const {children, className} = props;
    return <div className={`form-group row mb-2 mx-auto ${className}`}>{children}</div>
}
type FormGroupProps = {
    children: React.ReactNode;
    className?: string;
};
FormGroup.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}
FormGroup.defaultProps = {
    className: ''
}
