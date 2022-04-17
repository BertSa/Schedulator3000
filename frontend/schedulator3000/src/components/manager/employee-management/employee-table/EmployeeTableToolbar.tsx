import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, Edit, LocalFireDepartment } from '@mui/icons-material';
import React from 'react';
import { Employee } from '../../../../models/User';


interface EnhancedTableToolbarProps {
    selected: Employee | null;
    actions: {
        create: VoidFunction;
        edit: VoidFunction;
        fire: VoidFunction;
    };
}

export function EmployeeTableToolbar({selected, actions: {create, edit, fire}}: EnhancedTableToolbarProps) {
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
                    variant="h5"
                    id="tableTitle"
                    component="div"
                >
                    Employees
                </Typography>
            ) }
            { selected !== null ? (
                <>
                    <Tooltip title="Edit">
                        <IconButton onClick={ edit }>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Promote to customer">
                        <IconButton onClick={ fire }>
                            <LocalFireDepartment />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (<>
                    <Tooltip title="Add new employee">
                        <IconButton onClick={ create }>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </>
            ) }
        </Toolbar>
    );
}
