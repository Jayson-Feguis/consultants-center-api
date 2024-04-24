import * as Yup from 'yup';

export const validateCreateMenuPerUser = (data) => Yup.object().shape({
  userId: Yup.number().required('User ID is required').label('User ID'),
  includedMenus: Yup.array().of(Yup.mixed()),
  excludedMenus: Yup.array().of(Yup.mixed())
}).validate(data);