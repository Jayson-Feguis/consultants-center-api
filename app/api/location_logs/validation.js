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

export const validateLogAdjustment = (data) => Yup.object().shape({
  id: Yup.number().required('Log Adjustment ID as parameter is required').label('Id'),
  date: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').required('Date is required').label('Date'),
  timeIn: Yup.string().matches(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/, 'Time In must be in hh:mm AM/PM format').required('Time In is required').label('Time In'),
  timeOut: Yup.string().matches(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/, 'Time Out must be in hh:mm AM/PM format').required('Time Out is required').label('Time Out'),
  remarks: Yup.string().required('Remarks is required').label('Remarks'),
}).validate(data);