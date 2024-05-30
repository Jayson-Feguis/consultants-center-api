import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibraryPrincipal, createCVLibraryPrincipal, updateCVLibraryPrincipal, deleteCVLibraryPrincipal } from "./query.js";
import { validateCreateCVLibraryPrincipal, validateUpdateCVLibraryPrincipal } from "./validation.js";

export const getCVLibraryPrincipals = async (req, res) => {
  const cvLibraryPrincipals = await getCVLibraryPrincipal(req.dbconnection, req.query)

  res.status(200).json(transformResponse(cvLibraryPrincipals));
};

export const createCVLibraryPrincipals = async (req, res) => {
  await validateCreateCVLibraryPrincipal(req.body)

  const cvLibraryPrincipal = await createCVLibraryPrincipal(req.dbconnection, req.body)

  res.status(201).json(cvLibraryPrincipal);
};

export const updateCVLibraryPrincipals = async (req, res) => {
  await validateUpdateCVLibraryPrincipal({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const cvLibraryPrincipal = await updateCVLibraryPrincipal(req.dbconnection, id, title)

  res.status(200).json(cvLibraryPrincipal);
};

export const deleteCVLibraryPrincipals = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const cvLibraryPrincipal = await deleteCVLibraryPrincipal(req.dbconnection, id)

  if (cvLibraryPrincipal.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};