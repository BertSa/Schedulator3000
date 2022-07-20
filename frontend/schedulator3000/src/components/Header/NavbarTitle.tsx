import { Typography } from '@mui/material';
import React from 'react';

export default function NavbarTitle() {
  return (
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{ mr: 2, display: { flexGrow: 1, xs: 'flex', md: 'flex' }, textTransform: 'uppercase' }}
    >
      {process.env.REACT_APP_NAME}
    </Typography>
  );
}
