import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibraryHiringSource, createCVLibraryHiringSource, updateCVLibraryHiringSource, deleteCVLibraryHiringSource } from "./query.js";
import { validateCreateCVLibraryHiringSource, validateUpdateCVLibraryHiringSource } from "./validation.js";

export const getCVLibraryHiringSources = async (req, res) => {
  const cvLibraryHiringSources = await getCVLibraryHiringSource(req.dbconnection, req.query)

  res.status(200).json(transformResponse(cvLibraryHiringSources));
};

export const createCVLibraryHiringSources = async (req, res) => {
  await validateCreateCVLibraryHiringSource(req.body)

  const cvLibraryHiringSource = await createCVLibraryHiringSource(req.dbconnection, req.body)

  res.status(201).json(cvLibraryHiringSource);
};

export const updateCVLibraryHiringSources = async (req, res) => {
  await validateUpdateCVLibraryHiringSource({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const cvLibraryHiringSource = await updateCVLibraryHiringSource(req.dbconnection, id, title)

  res.status(200).json(cvLibraryHiringSource);
};

export const deleteCVLibraryHiringSources = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const cvLibraryHiringSource = await deleteCVLibraryHiringSource(req.dbconnection, id)

  if (cvLibraryHiringSource.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};