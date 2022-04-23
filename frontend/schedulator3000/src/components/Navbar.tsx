import { AppBar, Box, Button, Chip, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/use-auth';
import { useHistory } from 'react-router-dom';
import { Nullable } from '../models/Nullable';

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState<Nullable<HTMLElement>>(null);
    const history = useHistory();
    const auth = useAuth();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = (): void => setAnchorElNav(null);

    function ManagerLinks(): JSX.Element {
        if (!auth.isManager()) {
            return <></>;
        }

        return <>
            <Button
                onClick={ () => {
                    history.push('/manager/employees');
                    handleCloseNavMenu();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Employee Manager
            </Button>
            <Button
                onClick={ () => {
                    history.push('/manager/vacation-requests');
                    handleCloseNavMenu();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Vacation Requests
            </Button>
            <Button
                onClick={ () => {
                    history.push('/manager/schedule');
                    handleCloseNavMenu();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Schedule
            </Button>
            <Button
                onClick={ () => {
                    history.push('/manager/schedulev2');
                    handleCloseNavMenu();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Schedule V2
                <Chip color="primary" size="small" title={ 'BETA' } label={ 'BETA' } />
            </Button>
        </>;
    }

    function EmployeeLinks(): JSX.Element {
        if (!auth.isEmployee()) {
            return <></>;
        }

        return <>
            <Button
                onClick={ () => {
                    history.push('/vacation-requests');
                    handleCloseNavMenu();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Vacation Requests
            </Button>
            <Button
                onClick={ () => {
                    history.push('/schedule');
                    handleCloseNavMenu();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Schedule
            </Button>
        </>;
    }

    function ManagerLinksSm() {
        if (!auth.isManager()) {
            return <MenuItem>allo</MenuItem>;
        }

        return <>
            <MenuItem onClick={ () => {
                history.push('/manager/employees');
                handleCloseNavMenu();
            } }>
                <Typography textAlign="center">Employee Manager</Typography>
            </MenuItem>
            <MenuItem onClick={ () => {
                history.push('/manager/vacation-requests');
                handleCloseNavMenu();
            } }>
                <Typography textAlign="center">Vacation Requests</Typography>
            </MenuItem>
            <MenuItem onClick={ () => {
                history.push('/manager/schedule');
                handleCloseNavMenu();
            } }>
                <Typography textAlign="center">Schedule</Typography>
            </MenuItem>
            <MenuItem onClick={ () => {
                history.push('/manager/schedulev2');
                handleCloseNavMenu();
            } }>
                <Typography textAlign="center">
                    Schedule V2
                </Typography>
                <Chip color="primary" size="small" label={ 'BETA' } />
            </MenuItem>
        </>;
    }

    function EmployeeLinksSm() {
        if (!auth.isEmployee()) {
            return <MenuItem>allo</MenuItem>;
        }

        return <>
            <MenuItem onClick={ () => {
                history.push('/vacation-requests');
                handleCloseNavMenu();
            } }>
                <Typography textAlign="center">Vacation Requests</Typography>
            </MenuItem>
            <MenuItem onClick={ () => {
                history.push('/schedule');
                handleCloseNavMenu();
            } }>
                <Typography textAlign="center">Schedule</Typography>
            </MenuItem>
        </>;
    }

    function RightSide(): JSX.Element | null {
        const [anchorEl, setAnchorEl] = React.useState<Nullable<HTMLElement>>(null);

        const handleMenu = (event: React.MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);
        const handleClose = (): void => setAnchorEl(null);

        if (auth.isAuthenticated()) {
            return <>
                <Tooltip title="Open settings">
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={ handleMenu }
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="menu-appbar"
                    anchorEl={ anchorEl }
                    anchorOrigin={ {
                        vertical: 'top',
                        horizontal: 'right'
                    } }
                    keepMounted
                    transformOrigin={ {
                        vertical: 'top',
                        horizontal: 'right'
                    } }
                    open={ Boolean(anchorEl) }
                    onClose={ handleClose }
                >
                    <MenuItem onClick={ () => {
                        handleClose();
                        auth.signOut();
                        history.push('/');
                    } }>Log out</MenuItem>
                    <MenuItem onClick={ handleClose }>My account</MenuItem>
                </Menu>
            </>;
        }

        return <>
            <Button
                onClick={ () => {
                    history.push('/signin');
                    handleClose();
                } }
                sx={ {my: 2, color: 'white', display: 'block'} }
            >
                Log In
            </Button>
        </>;
    }


    return <>
        <AppBar position="fixed" className="navbar">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={ {mr: 2, display: {xs: 'none', md: 'flex'}, textTransform: 'uppercase'} }
                    >
                        { process.env.REACT_APP_NAME }
                    </Typography>
                    <Box sx={ {flexGrow: 1, display: {xs: 'flex', md: 'none'}} }>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={ handleOpenNavMenu }
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={ anchorElNav }
                            anchorOrigin={ {
                                vertical: 'bottom',
                                horizontal: 'left'
                            } }
                            keepMounted
                            transformOrigin={ {
                                vertical: 'top',
                                horizontal: 'left'
                            } }
                            open={ Boolean(anchorElNav) }
                            onClose={ handleCloseNavMenu }
                            sx={ {
                                display: {xs: 'block', md: 'none'}
                            } }
                        >
                            <ManagerLinksSm />
                            <EmployeeLinksSm />
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={ {flexGrow: 1, display: {xs: 'flex', md: 'none'}} }
                    >
                        { process.env.REACT_APP_NAME }
                    </Typography>
                    <Box sx={ {flexGrow: 1, display: {xs: 'none', md: 'flex'}} }>
                        <ManagerLinks />
                        <EmployeeLinks />
                    </Box>
                    <Box sx={ {flexGrow: 0} }>
                        <RightSide />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    </>;
}
