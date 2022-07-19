import { Button, Container, Grid } from '@mui/material';
import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import FieldInput from '../../components/FormFields';
import { useAuth } from '../../contexts/AuthContext';
import { IPasswordChangeDto, IPasswordChangeFieldValues } from './models/PasswordChange';
import Form from '../../components/Form';

export default function NewEmployeePage() {
  const history = useHistory();
  const { updatePassword } = useAuth();

  const submit: SubmitHandler<IPasswordChangeFieldValues> = ({ currentPassword, newPassword, confirmationPassword }) => {
    if (newPassword !== confirmationPassword) {
      return;
    }

    const pwdChange: IPasswordChangeDto = {
      currentPassword,
      newPassword,
    };

    updatePassword(pwdChange).then(() => history.replace('/'));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Form onSubmit={submit}>
        <Grid item xs={12} sm={6}>
          <FieldInput
            name="currentPassword"
            label="Current Password"
            autoComplete="current-password"
            type="password"
            validation={{
              required: 'This Field is required!',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldInput
            name="newPassword"
            label="New Password"
            autoComplete="new-password"
            type="password"
            validation={{
              required: 'This Field is required!',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldInput
            name="confirmationPassword"
            label="Confirm New Password"
            autoComplete="current-password"
            type="password"
            validation={(getValues:Function) => ({
              required: 'This Field is required!',
              validate: (value) => value === getValues().newPassword || 'Passwords do not match!',
            })}
          />
        </Grid>
        <Grid item xs={12} justifyContent="center">
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Form>
    </Container>
  );
}
