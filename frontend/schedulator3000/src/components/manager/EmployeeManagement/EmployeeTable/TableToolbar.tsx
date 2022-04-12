import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, Edit, LocalFireDepartment } from '@mui/icons-material';
import React from 'react';
import { Employee } from '../../../../models/User';


interface EnhancedTableToolbarProps {
    selected: Employee | null;
    addEmployee: any;
    editEmployee: any;
    fireEmployee: any;
}

export function TableToolbar({selected, addEmployee, fireEmployee, editEmployee}: EnhancedTableToolbarProps) {
    return (
        <Toolbar
            sx={ {
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(selected !== null && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            } }
        >
            { selected !== null ? (
                <Typography
                    sx={ {flex: '1 1 100%'} }
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    { `${ selected.firstName } ${ selected.lastName }` } selected
                </Typography>
            ) : (
                <Typography
                    sx={ {flex: '1 1 100%'} }
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Employees
                </Typography>
            ) }
            { selected !== null ? (
                <>
                    <Tooltip title="Edit">
                        <IconButton onClick={editEmployee}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Promote to customer">
                        <IconButton onClick={ fireEmployee }>
                            <LocalFireDepartment />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Tooltip title="Add new employee">
                    <IconButton onClick={ addEmployee }>
                        <Add />
                    </IconButton>
                </Tooltip>
            ) }
        </Toolbar>
    );
}
