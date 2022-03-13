import React, {BaseSyntheticEvent} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useAuth} from '../hooks/use-auth';
import {Column} from './Colums';
import {FieldInput} from './Form/FormFields';
import {regexEmail} from '../utilities';
import {FormGroup} from './Form/FormGroup';

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
                history.push('/manager');
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(connect)} noValidate>
                <FormGroup>
                    <Column>
                        <FieldInput label="Your email"
                                    name="email"
                                    type="email"
                                    register={register}
                                    errors={errors}
                                    validation={{
                                        required: 'This field is required',
                                        pattern: {
                                            value: regexEmail,
                                            message: 'Please enter a valid email address'
                                        }
                                    }}
                                    autoComplete="email"/>
                    </Column>
                    <Column>
                        <FieldInput label="Your password"
                                    name="password"
                                    type="password"
                                    register={register}
                                    errors={errors}
                                    validation={{
                                        required: 'This field is required'
                                    }}
                                    autoComplete="current-password"
                        />
                    </Column>
                </FormGroup>
                <div className="form-group text-center">
                    <label/>
                    <input className="btn btn-primary btn-login" type="submit" value="Connexion"/>
                </div>
            </form>
            <div className="form-group text-center mb-3">
                <Link className={'float-end mb-3 link'}
                      to={{pathname: '/forgot_password', state: {from: location}}}>
                    Forgot password?
                </Link>
            </div>
        </div>
    );
}
