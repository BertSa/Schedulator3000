import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import React from 'react';

interface NavbarLinkProps { text: string, path: string }

export default function NavbarLink({ text, path }: NavbarLinkProps) {
  const history = useHistory();
  return (
    <Button
      onClick={() => history.push(path)}
      sx={{ my: 2, color: 'white', display: 'block' }}
    >
      {text}
    </Button>
  );
}
