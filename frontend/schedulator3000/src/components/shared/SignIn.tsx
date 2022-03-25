import React, {BaseSyntheticEvent} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {FieldInput} from './form/FormFields';
import {regexEmail} from '../../utilities';
import {Avatar, Button, Container, Grid, Link, Typography} from '@mui/material';
import {LockOutlined} from '@mui/icons-material';


type SignInProps = {
    signIn: Function;
}

export function SignIn({signIn}: SignInProps) {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit'
    });

    const connect: SubmitHandler<FieldValues> = (data, event?: BaseSyntheticEvent) => {
        event?.preventDefault();
        const {email, password} = data;
        signIn(email, password);
    };

    return (
        <Container maxWidth="xs">
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
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Typography fontSize="smaller">
                            <Link component={RouterLink} to={{pathname: '/forgot_password'}}>
                                Forgot password ?
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography fontSize="smaller"> Do you have an account ?
                            <Link component={RouterLink} to={{pathname: '/forgot_password'}}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
