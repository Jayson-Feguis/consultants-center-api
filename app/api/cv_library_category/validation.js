import * as Yup from 'yup';

export const validateCreateCVLibraryCategory = (data) => Yup.object().shape({
  businessUnit: Yup.number().required('Business Unit is required').label('Business Unit'),
  module: Yup.number().required('Module is required').label('Module'),
  principal: Yup.number().required('Principal is required').label('Principal'),
  product: Yup.number().required('Product is required').label('Product'),
  subProduct: Yup.number().nullable(true).label('Sub Product'),
}).validate(data);

export const validateUpdateCVLibraryCategory = (data) => Yup.object().shape({
  id: Yup.string().required('Category ID as parameter is required').label('Category ID'),
  businessUnit: Yup.number().required('Business Unit is required').label('Business Unit'),
  module: Yup.number().required('Module is required').label('Module'),
  principal: Yup.number().required('Principal is required').label('Principal'),
  product: Yup.number().required('Product is required').label('Product'),
  subProduct: Yup.number().nullable(true).label('Sub Product'),
}).validate(data);