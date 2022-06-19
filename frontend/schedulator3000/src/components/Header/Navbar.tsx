import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Nullable } from '../../models/Nullable';

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<Nullable<HTMLElement>>(null);
  const history = useHistory();
  const auth = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = (): void => setAnchorElNav(null);

  const buttonSx: SxProps = { my: 2, color: 'white', display: 'block' };

  function ManagerLinks() {
    if (!auth.isManager()) {
      return <span />;
    }

    return (
      <>
        <Button
          onClick={() => {
            history.push('/manager/employees');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Employee Manager
        </Button>
        <Button
          onClick={() => {
            history.push('/manager/vacation-requests');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Vacation Requests
        </Button>
        <Button
          onClick={() => {
            history.push('/manager/schedule');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Schedule
        </Button>
        <Button
          onClick={() => {
            history.push('/manager/schedulev2');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Schedule V2
          <Chip color="primary" size="small" title="BETA" label="BETA" />
        </Button>
      </>
    );
  }

  function EmployeeLinks() {
    if (!auth.isEmployee()) {
      return <span />;
    }

    return (
      <>
        <Button
          onClick={() => {
            history.push('/vacation-requests');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Vacation Requests
        </Button>
        <Button
          onClick={() => {
            history.push('/schedule');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Schedule
        </Button>
        <Button
          onClick={() => {
            history.push('/availabilities');
            handleCloseNavMenu();
          }}
          sx={buttonSx}
        >
          Availabilities
        </Button>
      </>
    );
  }

  function ManagerLinksSm() {
    if (!auth.isManager()) {
      return <MenuItem><span /></MenuItem>;
    }

    return (
      <>
        <MenuItem
          onClick={() => {
            history.push('/manager/employees');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Employee Manager</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/manager/vacation-requests');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Vacation Requests</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/manager/schedule');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Schedule</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/manager/schedulev2');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Schedule V2</Typography>
          <Chip color="primary" size="small" label="BETA" />
        </MenuItem>
      </>
    );
  }

  function EmployeeLinksSm() {
    if (!auth.isEmployee()) {
      return <MenuItem>allo</MenuItem>;
    }

    return (
      <>
        <MenuItem
          onClick={() => {
            history.push('/vacation-requests');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Vacation Requests</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push('/schedule');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Schedule</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            history.push('/availabilities');
            handleCloseNavMenu();
          }}
        >
          <Typography textAlign="center">Availabilities</Typography>
        </MenuItem>
      </>
    );
  }

  function RightSide() {
    if (auth.isAuthenticated()) {
      return (
        <Button
          onClick={() => {
            auth.signOut();
            history.push('/');
          }}
          sx={buttonSx}
        >
          Log out
        </Button>
      );
    }

    return (
      <Button
        onClick={() => {
          history.push('/');
        }}
        sx={buttonSx}
      >
        Log In
      </Button>
    );
  }

  return (
    <AppBar position="fixed" className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, textTransform: 'uppercase' }}
          >
            {process.env.REACT_APP_NAME}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <ManagerLinksSm />
              <EmployeeLinksSm />
            </Menu>
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {process.env.REACT_APP_NAME}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <ManagerLinks />
            <EmployeeLinks />
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <RightSide />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
