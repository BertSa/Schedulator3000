import { Button, Container, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import React, { BaseSyntheticEvent } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../../contexts/AuthContext';
import { FieldInput } from '../../shared/FormFields';
import { regex } from '../../../utilities/utilities';
import { useToggle } from '../../../hooks/useToggle';
import Form from '../../shared/Form';

export default function SignInPage() {
  const [tab, toggleTab] = useToggle(0, [0, 1]);
  const history = useHistory();
  const auth = useAuth();

  const connect: SubmitHandler<FieldValues> = ({ email, password }, event?: BaseSyntheticEvent) => {
    event?.preventDefault();

    if (tab === 0) {
      auth.signInEmployee(email, password).then(() => history.push('/'));
    } else if (tab === 1) {
      auth.signInManager(email, password).then(() => history.push('/manager'));
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Form
        spacing={2}
        padding={2}
        onSubmit={connect}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Tabs
          value={tab}
          onChange={(event: React.SyntheticEvent, value: number) => toggleTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            marginBottom: 2,
          }}
        >
          <Tab label="Employee" />
          <Tab label="Manager" />
        </Tabs>
        <FieldInput
          label="Your email"
          name="email"
          type="email"
          autoComplete="email"
          validation={{
            required: 'This field is required',
            pattern: {
              value: regex.email,
              message: 'Please enter a valid email address',
            },
          }}
        />
        <FieldInput
          label="Your password"
          name="password"
          type="password"
          autoComplete="current-password"
          validation={{
            required: 'This field is required',
          }}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign In
        </Button>
        <Grid container sx={{ marginTop: 2 }}>
          <Grid item xs>
            <Typography fontSize="smaller">
              <Link component={RouterLink} to={{ pathname: '/forgot_password' }}>
                Forgot password ?
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography fontSize="smaller">
              {'Do you have an account? '}
              <Link component={RouterLink} to={{ pathname: '/register' }}>
                Sign Up
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Form>
    </Container>
  );
}
