import * as Yup from 'yup';

export const validateForgotPassword = (data) => Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required').label('Email')
}).validate(data);

export const validateLogin = (data) => Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required').label('Email'),
  password: Yup.string().required('Password is required').label('Password'),
}).validate(data);

export const validateResetPassword = (data) => Yup.object().shape({
  password: Yup.string().required().label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password does not match')
    .required()
    .label('Confirm Password'),
}).validate(data);

