import React from "react";
import PropTypes from "prop-types";

export function Column(props :ColumnProps) {
    const {children, col, defaultValue, className} = props;
    if (!col) {
        return <div className={`col-${defaultValue} ${className}`}>{children}</div>
    }
    const {xs, sm, md, lg, xl, xxl} = {
        xs: col && col.xs,
        sm: col && col.sm,
        md: col && col.md,
        lg: col && col.lg,
        xl: col && col.xl,
        xxl: col && col.xxl
    };

    return <div
        className={`${xs ? "col-xs-" + xs : ""}${sm ? " col-sm-" + sm : ""}${md ? " col-md-" + md : ""}${lg ? " col-lg-" + lg : ""}${xl ? " col-xl-" + xl : ""}${xxl ? " col-xxl-" + xxl : ""} ${className ? className : ""}`}>
    {children}
    </div>

}

Column.propTypes = {
    children: PropTypes.node,
    col: PropTypes.shape({
        xs: PropTypes.number,
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number,
        xl: PropTypes.number,
        xxl: PropTypes.number
    }),
    defaultValue: PropTypes.number,
    className: PropTypes.string
}
type ColumnProps = {
    children: React.ReactNode,
    col?: {
        xs?: number,
        sm?: number,
        md?: number,
        lg?: number,
        xl?: number,
        xxl?: number
    },
    defaultValue: number,
    className: string
}

Column.defaultProps = {
    defaultValue: 12,
    className: "",
}
