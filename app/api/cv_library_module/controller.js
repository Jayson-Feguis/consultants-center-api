import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibraryModule, createCVLibraryModule, updateCVLibraryModule, deleteCVLibraryModule } from "./query.js";
import { validateCreateCVLibraryModule, validateUpdateCVLibraryModule } from "./validation.js";

export const getCVLibraryModules = async (req, res) => {
  const cvLibraryModules = await getCVLibraryModule(req.dbconnection, req.query)

  res.status(200).json(transformResponse(cvLibraryModules));
};

export const createCVLibraryModules = async (req, res) => {
  await validateCreateCVLibraryModule(req.body)

  const cvLibraryModule = await createCVLibraryModule(req.dbconnection, req.body)

  res.status(201).json(cvLibraryModule);
};

export const updateCVLibraryModules = async (req, res) => {
  await validateUpdateCVLibraryModule({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const cvLibraryModule = await updateCVLibraryModule(req.dbconnection, id, title)

  res.status(200).json(cvLibraryModule);
};

export const deleteCVLibraryModules = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const cvLibraryModule = await deleteCVLibraryModule(req.dbconnection, id)

  if (cvLibraryModule.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};