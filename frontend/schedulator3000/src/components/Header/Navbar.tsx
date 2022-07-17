import { AppBar, Container, Toolbar } from '@mui/material';
import React from 'react';
import NavbarTitle from './NavbarTitle';
import AuthButton from './AuthButton';
import HamburgerMenu from './HamburgerMenu';
import NavbarLinks from './NavbarLinks';

export default function Navbar() {
  return (
    <AppBar position="fixed" className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HamburgerMenu />
          <NavbarTitle />
          <NavbarLinks />
          <AuthButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
