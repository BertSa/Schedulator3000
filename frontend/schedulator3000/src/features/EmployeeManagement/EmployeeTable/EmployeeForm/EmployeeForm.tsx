import { SubmitHandler } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
import React from 'react';
import FieldInputWithFormContext from '../../../../components/FormFields';
import { regex } from '../../../../utilities/utilities';
import { Employee, EmployeeFormType } from '../../../../models/User';
import Form from '../../../../components/Form';

interface IEmployeeFormProps {
  submit: SubmitHandler<EmployeeFormType>;
  onCancel: VoidFunction;
  emailDisabled?: boolean;
  employee?: Employee;
}

export default function EmployeeForm({ submit, emailDisabled, onCancel, employee }: IEmployeeFormProps) {
  return (
    <Form
      onSubmit={submit}
      spacing={2}
      padding={2}
      formProps={{
        defaultValues: {
          email: employee?.email ?? '',
          firstName: employee?.firstName ?? '',
          lastName: employee?.lastName ?? '',
          phone: employee?.phone ?? '',
          role: employee?.role ?? '',
        },
      }}
    >
      <Grid item xs={12} sm={6}>
        <FieldInputWithFormContext
          name="firstName"
          label="First Name"
          autoComplete="given-name"
          type="text"
          validation={{
            required: 'Ce champ est obligatoire!',
            pattern: {
              value: regex.name,
              message: 'This field must contain only letters!',
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldInputWithFormContext
          name="lastName"
          label="Last Name"
          type="text"
          autoComplete="family-name"
          validation={{
            required: 'This field is required!',
            pattern: {
              value: regex.name,
              message: 'The last name must contain only letters!',
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FieldInputWithFormContext
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={emailDisabled}
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
        <FieldInputWithFormContext
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
      <Grid item xs={12}>
        <FieldInputWithFormContext
          name="role"
          label="Role"
          type="text"
          autoComplete="role"
          validation={{
            required: 'This field is required!',
            pattern: {
              value: regex.name,
              message: 'The role must contain only letters!',
            },
          }}
        />
      </Grid>
      <Grid item xs={12} justifyContent="center" alignContent="center" alignItems="center" justifyItems="center">
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button type="button" variant="text" color="primary" onClick={() => onCancel()}>
          Cancel
        </Button>
      </Grid>
    </Form>
  );
}

EmployeeForm.defaultProps = {
  emailDisabled: false,
  employee: undefined,
};
