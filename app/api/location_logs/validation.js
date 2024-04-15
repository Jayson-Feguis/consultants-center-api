import * as Yup from 'yup';

export const validateGetLocationLogsByMonth = (data) => Yup.object().shape({
  year: Yup.number().required('Month as parameter is required').label('Month'),
  month: Yup.number().required('Month as parameter is required').label('Month'),
}).validate(data);

export const validateCheckIn = (data) => Yup.object().shape({
  checkedInLocation: Yup.string().required('Checked In Location is required').label('Checked In Location'),
  checkedInCoordinates: Yup.string().required('Checked In Coordinates is required').label('Checked In Coordinates'),
}).validate(data);

export const validateCheckOut = (data) => Yup.object().shape({
  checkedOutLocation: Yup.string().required('Checked Out Location is required').label('Checked Out Location'),
  checkedOutCoordinates: Yup.string().required('Checked Out Coordinates is required').label('Checked Out Coordinates'),
}).validate(data);