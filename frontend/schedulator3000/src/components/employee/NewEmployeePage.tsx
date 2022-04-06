import {Button, Container, Grid} from '@mui/material';
import {FieldInput} from '../shared/form/FormFields';
import React from 'react';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useAuth} from '../../hooks/use-auth';
import {PasswordChangeDto} from '../../models/PasswordChangeDto';
import {useHistory} from 'react-router-dom';

export function NewEmployeePage() {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });
    const {updatePassword} = useAuth();
    const history = useHistory();

    const submit: SubmitHandler<FieldValues> = (data) => {
        const {currentPassword, newPassword, confirmationPassword} = data as IPasswordChangeDto;
        if (newPassword !== confirmationPassword) {
            return;
        }

        const pwdChange: PasswordChangeDto = {
            currentPassword,
            newPassword
        };

        updatePassword(pwdChange).then(()=>{
            history.replace('/');
        });
    };

    return <>
        <Container maxWidth="sm"
                   sx={{
                       marginTop: 12,
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center'
                   }}>
            <Grid container
                  component="form"
                  spacing={2}
                  onSubmit={handleSubmit(submit)}
                  noValidate>
                <Grid item xs={12} sm={6}>
                    <FieldInput register={register}
                                errors={errors}
                                name="currentPassword"
                                label="Current Password"
                                autoComplete="current-password"
                                type="password"
                                validation={{
                                    required: 'This Field is required!'
                                }}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FieldInput register={register}
                                errors={errors}
                                name="newPassword"
                                label="New Password"
                                autoComplete="new-password"
                                type="password"
                                validation={{
                                    required: 'This Field is required!'
                                }}/>
                </Grid>
                <Grid item xs={12}>
                    <FieldInput register={register}
                                errors={errors}
                                name="confirmationPassword"
                                label="Confirm New Password"
                                autoComplete="current-password"
                                type="password"
                                validation={{
                                    required: 'This Field is required!'
                                }}/>
                </Grid>
                <Grid item xs={12} justifyContent={'center'}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Container>
    </>;
}

type IPasswordChangeDto = {
    currentPassword: string;
    newPassword: string;
    confirmationPassword: string;
}
