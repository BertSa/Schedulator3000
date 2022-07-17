import { useHistory } from 'react-router-dom';
import { MenuItem, Typography } from '@mui/material';
import React from 'react';

interface HamburgerMenuLinkProps {
  text: string,
  path: string,
  handleClose: VoidFunction
}

export default function HamburgerMenuLink({ text, path, handleClose }: HamburgerMenuLinkProps) {
  const history = useHistory();
  return (
    <MenuItem
      onClick={() => {
        history.push(path);
        handleClose();
      }}
    >
      <Typography textAlign="center">{text}</Typography>
    </MenuItem>
  );
}
