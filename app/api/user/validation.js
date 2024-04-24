import * as Yup from 'yup';

export const validateChangePassword = (data) => Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required').label('Old Password'),
  newPassword: Yup.string().required('New password is required').label('New Password'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'New Password does not match')
    .required('Confirm new password is required')
    .label('Confirm New Password'),
}).validate(data);

export const validateChangeProfile = (data) => Yup.object().shape({
  profilePicture: Yup.number().label('Profile Picture'),
  firstName: Yup.string().matches(/^[A-Za-z]+$/, 'First name must contain letters only').required('First name is required').label('First name'),
  lastName: Yup.string().matches(/^[A-Za-z]+$/, 'Last name must contain letters only').required('Last name is required').label('Last name'),
}).validate(data);

