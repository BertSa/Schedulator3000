import React, {BaseSyntheticEvent} from 'react';
import {Link as RouterLink, useHistory, useLocation} from 'react-router-dom';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useAuth} from '../hooks/use-auth';
import {FieldInput} from './Form/FormFields';
import {regexEmail} from '../utilities';
import {Avatar, Button, Container, Grid, Link, Typography} from '@mui/material';
import {LockOutlined} from '@mui/icons-material';

export function SignIn() {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit'
    });
    let location = useLocation();
    const history = useHistory();
    let auth = useAuth();

    const connect: SubmitHandler<FieldValues> = (data, event?: BaseSyntheticEvent) => {
        event?.preventDefault();
        const {email, password} = data;
        auth.signInManager(email, password).then(() => {
            if (auth.user)
                history.push('/manager/dashboard');
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Grid container
                  sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                  }}
                  columnSpacing={2}
                  rowSpacing={2}
                  padding={2}
                  component="form"
                  onSubmit={handleSubmit(connect)}
                  noValidate>
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <FieldInput label="Your email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            register={register}
                            errors={errors}
                            validation={{
                                required: 'This field is required',
                                pattern: {
                                    value: regexEmail,
                                    message: 'Please enter a valid email address'
                                }
                            }}
                />
                <FieldInput label="Your password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            register={register}
                            errors={errors}
                            validation={{
                                required: 'This field is required'
                            }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Sign Up
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Typography fontSize="smaller">
                            <Link component={RouterLink} to={{pathname: '/forgot_password', state: {from: location}}}>
                                Forgot password ?
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography fontSize="smaller"> Do you have an account ?
                            <Link component={RouterLink} to={{pathname: '/forgot_password', state: {from: location}}}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
