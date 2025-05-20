export default {
  login: {
    title: 'Sign in to your account',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot your password?',
    loginButton: 'Sign in',
    processingButton: 'Processing...',
    invalidCredentials: 'Invalid email or password',
    errorOccurred: 'An error occurred, please try again',
    validation: {
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters'
    }
  },
  error: {
    title: 'Authentication Error',
    defaultMessage: 'An error occurred during authentication.',
    accessDenied: 'You do not have permission to access this page.',
    verification: 'The verification link is invalid or has expired.',
    credentialsSignin: 'The login credentials are incorrect.',
    backToLogin: 'Back to login page'
  },
  unauthorized: {
    title: 'Access Denied',
    message: 'You do not have permission to access this page.',
    backToHome: 'Back to home page'
  }
};
