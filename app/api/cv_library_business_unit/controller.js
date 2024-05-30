import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibraryBusinessUnit, createCVLibraryBusinessUnit, updateCVLibraryBusinessUnit, deleteCVLibraryBusinessUnit } from "./query.js";
import { validateCreateCVLibraryBusinessUnit, validateUpdateCVLibraryBusinessUnit } from "./validation.js";

export const getCVLibraryBusinessUnits = async (req, res) => {
  const cvLibraryBusinessUnits = await getCVLibraryBusinessUnit(req.dbconnection, req.query)

  res.status(200).json(transformResponse(cvLibraryBusinessUnits));
};

export const createCVLibraryBusinessUnits = async (req, res) => {
  await validateCreateCVLibraryBusinessUnit(req.body)

  const cvLibraryBusinessUnit = await createCVLibraryBusinessUnit(req.dbconnection, req.body)

  res.status(201).json(cvLibraryBusinessUnit);
};

export const updateCVLibraryBusinessUnits = async (req, res) => {
  await validateUpdateCVLibraryBusinessUnit({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const cvLibraryBusinessUnit = await updateCVLibraryBusinessUnit(req.dbconnection, id, title)

  res.status(200).json(cvLibraryBusinessUnit);
};

export const deleteCVLibraryBusinessUnits = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const cvLibraryBusinessUnit = await deleteCVLibraryBusinessUnit(req.dbconnection, id)

  if (cvLibraryBusinessUnit.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};