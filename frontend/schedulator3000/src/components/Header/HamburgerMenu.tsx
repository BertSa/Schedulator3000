import React, { useEffect } from 'react';
import { Box, IconButton, Menu } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { setNull } from '../../utilities/utilities';
import useNullableState from '../../hooks/useNullableState';
import IterateLinks from './IterateLinks';
import HamburgerMenuLink from './HamburgerMenuLink';

export default function HamburgerMenu() {
  const [anchorElNav, setAnchorElNav] = useNullableState<HTMLElement>();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = setNull(setAnchorElNav);

  useEffect(() =>
    () => {
      handleCloseNavMenu();
    }, []);

  return (
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
        keepMounted
        anchorEl={anchorElNav}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <IterateLinks component={HamburgerMenuLink} handleClose={handleCloseNavMenu} />
      </Menu>
    </Box>
  );
}
