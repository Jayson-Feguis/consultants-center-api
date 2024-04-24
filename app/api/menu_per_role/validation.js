import * as Yup from 'yup';
import { ROLES } from '../../lib/constants.js';

export const validateCreateMenuPerRole = (data) => Yup.object().shape({
  role: Yup.string().oneOf([ROLES.ACCTG, ROLES.ADMIN, ROLES.APPRV, ROLES.AUDIT, ROLES.BA, ROLES.CLOUDTECH, ROLES.FTSI, ROLES.GREENSTAR, ROLES.HR, ROLES.MARKETING, ROLES.MD, ROLES.PRESALES, ROLES.SALES, ROLES.SUPPORT]).required('Role is required').label('Role'),
  menus: Yup.array().of(Yup.number()).min(1, 'At least 1 menu should be selected').required('Menu ID is required').label('Menu ID')
}).validate(data);