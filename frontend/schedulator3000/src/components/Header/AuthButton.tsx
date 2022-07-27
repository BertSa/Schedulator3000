import { Box, Button } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthButton() {
  const auth = useAuth();
  const history = useHistory();
  const isAuthenticated = auth.isAuthenticated();

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Button
        onClick={() => {
          if (isAuthenticated) {
            auth.signOut();
          }
          history.push('/');
        }}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {isAuthenticated ? 'Log Out' : 'Log In'}
      </Button>
    </Box>
  );
}
