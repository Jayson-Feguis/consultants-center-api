import * as Yup from 'yup';

export const validateCheckIn = (data) => Yup.object().shape({
  checkInLocation: Yup.string().required('Location is required').label('Location'),
}).validate(data);