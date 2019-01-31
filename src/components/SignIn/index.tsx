import { SignInForm, SignInFormValues } from '@openware/components';
import cx from 'classnames';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    AuthError,
    RootState,
    selectAuthError,
    selectSignInRequire2FA,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
} from '../../modules';
import { TwoFactorAuth } from '../TwoFactorAuth';

interface ReduxProps {
    isLoggedIn: boolean;
    error?: AuthError;
    loading?: boolean;
    require2FA?: boolean;
}

interface DispatchProps {
    signIn: typeof signIn;
    signInError: typeof signInError;
}

interface SignInState {
    email: string;
    password: string;
}

type Props = ReduxProps & DispatchProps & RouterProps;

class SignInComponent extends React.Component<Props, SignInState> {
    public state = {
        email: '',
        password: '',
    };

    public componentDidMount() {
        // clear error message
        this.props.signInError({ code: undefined, message: undefined });
    }

    public componentWillReceiveProps(props: Props) {
        if (props.isLoggedIn) {
            this.props.history.push('/wallets');
        }
    }

    public render() {
        const { loading, require2FA } = this.props;

        const className = cx('pg-sign-in-screen__container', { loading });
        return (
            <div className="pg-sign-in-screen">
                <div className={className}>
                    {require2FA ? this.render2FA() : this.renderSignInForm()}
                </div>
            </div>
        );
    }

    private renderSignInForm = () => {
        const { loading, error } = this.props;
        return (
            <SignInForm
                errorMessage={error && error.message}
                isLoading={loading}
                onForgotPassword={this.forgotPassword}
                onSignUp={this.handleSignUp}
                onSignIn={this.handleSignIn}
            />
        );
    }

    private render2FA = () => {
        const { loading, error } = this.props;
        return (
            <TwoFactorAuth
                errorMessage={error && error.message}
                isLoading={loading}
                onSignUp={this.handleSignUp}
                onSubmit={this.handle2FASignIn}
            />
        );
    }

    private handleSignIn = ({ email, password }: SignInFormValues) => {
        this.props.signIn({
            email,
            password,
        });
        this.setState({ email, password });
    };

    private handle2FASignIn = (otpCode: string) => {
        const { email, password } = this.state;
        this.props.signIn({
            email,
            password,
            otp_code: otpCode,
        });
    }

    private handleSignUp = () => {
        this.props.history.push('/signup');
    };

    private forgotPassword = () => {
        this.props.history.push('/forgot_password');
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    isLoggedIn: selectUserLoggedIn(state),
    loading: selectUserFetching(state),
    error: selectAuthError(state),
    require2FA: selectSignInRequire2FA(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signIn: data => dispatch(signIn(data)),
        signInError: error => dispatch(signInError(error)),
    });

// tslint:disable-next-line no-any
const SignIn = withRouter(connect(mapStateToProps, mapDispatchProps)(SignInComponent) as any);

export {
    SignIn,
};
