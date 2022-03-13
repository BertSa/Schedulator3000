import React from "react";
import PropTypes from "prop-types";
import {FormControl} from '@mui/material';

export function FormGroup(props:FormGroupProps) {
    const {children, className} = props;
    return <FormControl  fullWidth className={`row ${className}`}>{children}</FormControl>
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
