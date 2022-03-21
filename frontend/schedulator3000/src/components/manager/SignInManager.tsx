import {SignIn} from '../shared/SignIn';
import {useAuth} from '../../hooks/use-auth';
import {useHistory} from 'react-router-dom';

export function SignInManager() {
    const history = useHistory();
    const auth = useAuth();

    const signIn = (email: string, password: string) => {
        auth.signInManager(email, password).then(() => {
            if (auth.user)
                history.push('/manager/dashboard');
        });
    };


    return <SignIn signIn={signIn}/>;
}
