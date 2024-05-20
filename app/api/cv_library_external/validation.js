import * as Yup from 'yup';
import { HIRING_STATUS } from '../../lib/constants.js';

export const validateCreateCVLibraryExternal = (data) => Yup.object().shape({
  name: Yup.string().required('Name is required').label('Name'),
  businessUnit: Yup.string().required('Business Unit is required').label('Business Unit'),
  module: Yup.string().required('Module is required').label('Module'),
  principal: Yup.string().required('Principal is required').label('Principal'),
  product: Yup.string().required('Product is required').label('Product'),
  subProduct: Yup.string().nullable(true).label('Sub Product'),
  emailAddress: Yup.string().email('Invalid email').required('Email Address is required').label('Email Address'),
  contactNumber: Yup.string().matches(/^\+639\d{9}$/, 'Invalid Philippine mobile phone number').required('Contact Number is required').label('Contact Number'),
  cityAddress: Yup.string().notRequired().label('Title'),
  hiringStatus: Yup.string().oneOf([HIRING_STATUS.HIRED, HIRING_STATUS.POOLED, HIRING_STATUS.REJECTED]).required('Hiring Status is required').label('Hiring Status'),
  hiringSource: Yup.string().required('Hiring Source is required').label('Hiring Source'),
  referredBy: Yup.mixed().notRequired().label('Referred By'),
  dataEntryDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').required('Data Entry Date is required').label('Data Entry Date'),
}).validate(data);

export const validateUpdateCVLibraryExternal = (data) => Yup.object().shape({
  id: Yup.string().required('External ID as parameter is required').label('External ID'),
  name: Yup.string().required('Name is required').label('Name'),
  businessUnit: Yup.string().required('Business Unit is required').label('Business Unit'),
  module: Yup.string().required('Module is required').label('Module'),
  principal: Yup.string().required('Principal is required').label('Principal'),
  product: Yup.string().required('Product is required').label('Product'),
  subProduct: Yup.string().nullable(true).label('Sub Product'),
  emailAddress: Yup.string().email('Invalid email').required('Email Address is required').label('Email Address'),
  contactNumber: Yup.string().matches(/^\+639\d{9}$/, 'Invalid Philippine mobile phone number').required('Contact Number is required').label('Contact Number'),
  cityAddress: Yup.string().notRequired().label('Title'),
  hiringStatus: Yup.string().oneOf([HIRING_STATUS.HIRED, HIRING_STATUS.POOLED, HIRING_STATUS.REJECTED]).required('Hiring Status is required').label('Hiring Status'),
  hiringSource: Yup.string().required('Hiring Source is required').label('Hiring Source'),
  referredBy: Yup.mixed().notRequired().label('Referred By'),
  attachments: Yup.array().of(Yup.number()).notRequired().label('Attachments'),
  dataEntryDate: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').required('Data Entry Date is required').label('Data Entry Date'),
}).validate(data);