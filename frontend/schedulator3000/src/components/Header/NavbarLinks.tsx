import { Box } from '@mui/material';
import React from 'react';
import IterateLinks from './IterateLinks';
import NavbarLink from './NavbarLink';

export default function NavbarLinks() {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      <IterateLinks component={NavbarLink} />
    </Box>
  );
}
