import React, {Children} from 'react';
import PropTypes from 'prop-types';

export function Table(props: any) {
    const {children, className} = props;
    let tableRows: any = [];
    let tableHeader;

    let list: any = React.Children.toArray(children).filter(child => child !== null && child !== undefined) || [];
    if (!list.find((child: any) => child.type.name === 'TableHeader'))
        throw new Error('Table must have a TableHeader');

    Children.map(children, child => {
        if (!child) return;
        if (child.type.name === 'TableHeader')
            tableHeader = child;
        else
            tableRows.push(child);
    });
    return (
        <table
            className={'table table-light table-striped table-borderless text-center rounded-3 shadow-lg mx-auto ' + className}>
            <thead>
            {tableHeader}
            </thead>
            <tbody>
            {tableRows}
            </tbody>
        </table>
    );
}

Table.propTypes = {
    children: PropTypes.array.isRequired,
    className: PropTypes.string
};

export function TableHeader(props: any) {
    const {children} = props;
    return <tr>
        {
            React.Children.map(children || [], (child, index) => {
                return React.cloneElement(child,
                    {
                        key: {index},
                        className: '',
                        scope: 'col'
                    });
            })
        }
    </tr>;
}

TableHeader.propTypes = {
    children: PropTypes.array.isRequired
};

type TableRowProps = {
    children: any,
};

export function TableRow(props: TableRowProps) {
    const {children} = props;
    return <tr>
        {React.Children.map(children, child => {
            if (child?.type === 'th') {
                return React.cloneElement(child,
                    {
                        className: child.props.className,
                        scope: 'row'
                    });
            }
            if (child.type === 'td') {
                return child;
            }
        })}
    </tr>;
}

TableRow.propTypes = {
    children: PropTypes.array.isRequired
};
