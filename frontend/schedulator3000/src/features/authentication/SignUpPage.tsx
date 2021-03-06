import { Button, Container, Grid, Link, Typography } from '@mui/material';
import React, { BaseSyntheticEvent } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import FieldInput from '../../components/FormFields';
import { regex } from '../../utilities/utilities';
import { Manager } from '../../models/User';
import Form from '../../components/Form';

interface ISignUpFieldValues {
  email: string;
  companyName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const auth = useAuth();
  const history = useHistory();

  const connect: SubmitHandler<ISignUpFieldValues> = ({ confirmPassword, ...manager }, event?: BaseSyntheticEvent) => {
    event?.preventDefault();
    auth.signUpManager(manager as Manager).then(() => history.push('/manager'));
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
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Form
        columnSpacing={2}
        padding={2}
        marginTop={2}
        justifyContent="center"
        onSubmit={connect}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Grid item xs={12}>
          <FieldInput
            label="Company Name"
            name="companyName"
            type="text"
            autoComplete="organization"
            validation={{
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Must be at least 3 characters',
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <FieldInput
            name="phone"
            label="Phone Number"
            type="tel"
            autoComplete="tel-country-code"
            validation={{
              required: 'This field is required!',
              pattern: {
                value: regex.phone,
                message: 'Phone number is not valid!',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldInput
            name="password"
            label="Password"
            autoComplete="new-password"
            type="password"
            validation={{
              required: 'This Field is required!',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldInput
            name="confirmationPassword"
            label="Confirm Password"
            autoComplete="new-password"
            type="password"
            validation={(getValues) => ({
              required: 'This Field is required!',
              validate: (value) => value === getValues().password || 'Passwords do not match!',
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
        </Grid>
        <Grid
          container
          display="flex"
          alignItems="center"
          justifyContent="end"
          sx={{ marginTop: 2 }}
        >
          <Typography fontSize="smaller">
            {'You already have an account? '}
            <Link component={RouterLink} to={{ pathname: '/' }}>
              Sign In
            </Link>
          </Typography>
        </Grid>
      </Form>
    </Container>
  );
}
