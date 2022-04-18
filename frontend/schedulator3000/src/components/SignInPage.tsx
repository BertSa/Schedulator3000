import { Button, Container, Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import React, { BaseSyntheticEvent, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { FieldInput } from './shared/form/FormFields';
import { regex } from '../utilities';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export function SignInPage() {
    const [tab, setTab] = useState(0);
    const auth = useAuth();
    const history = useHistory();
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit'
    });

    const connect: SubmitHandler<FieldValues> = (data, event?: BaseSyntheticEvent) => {
        event?.preventDefault();
        const {email, password} = data;

        if (tab === 0) {
            auth.signInEmployee(email, password).then(() => history.push('/'));
        } else if (tab === 1) {
            auth.signInManager(email, password).then(() => history.push('/manager/dashboard'));
        }
    };


    return <Container maxWidth="sm"
                      sx={ {
                          marginTop: 8,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                      } }>
        <Grid container
              sx={ {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
              } }
              columnSpacing={ 2 }
              rowSpacing={ 2 }
              padding={ 2 }
              component="form"
              onSubmit={ handleSubmit(connect) }
              noValidate>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Tabs
                value={ tab }
                onChange={ (event: React.SyntheticEvent, value: number) => setTab(value) }
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={ {
                    marginBottom: 2
                } }
            >
                <Tab label="Employee" />
                <Tab label="Manager" />
            </Tabs>
            <FieldInput label="Your email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        register={ register }
                        errors={ errors }
                        validation={ {
                            required: 'This field is required',
                            pattern: {
                                value: regex.email,
                                message: 'Please enter a valid email address'
                            }
                        } }
            />
            <FieldInput label="Your password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        register={ register }
                        errors={ errors }
                        validation={ {
                            required: 'This field is required'
                        } }
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
            >
                Sign In
            </Button>
            <Grid container sx={ {marginTop: 2} }>
                <Grid item xs>
                    <Typography fontSize="smaller">
                        <Link component={ RouterLink } to={ {pathname: '/forgot_password'} }>
                            Forgot password ?
                        </Link>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography fontSize="smaller"> Do you have an account ?
                        <Link component={ RouterLink } to={ {pathname: '/forgot_password'} }>
                            Sign Up
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    </ Container>;
}
