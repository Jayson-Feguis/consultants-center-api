import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibraryProduct, createCVLibraryProduct, updateCVLibraryProduct, deleteCVLibraryProduct } from "./query.js";
import { validateCreateCVLibraryProduct, validateUpdateCVLibraryProduct } from "./validation.js";

export const getCVLibraryProducts = async (req, res) => {
  const cvLibraryProducts = await getCVLibraryProduct(req.dbconnection, req.query)

  res.status(200).json(transformResponse(cvLibraryProducts));
};

export const createCVLibraryProducts = async (req, res) => {
  await validateCreateCVLibraryProduct(req.body)

  const cvLibraryProduct = await createCVLibraryProduct(req.dbconnection, req.body)

  res.status(201).json(cvLibraryProduct);
};

export const updateCVLibraryProducts = async (req, res) => {
  await validateUpdateCVLibraryProduct({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const cvLibraryProduct = await updateCVLibraryProduct(req.dbconnection, id, title)

  res.status(200).json(cvLibraryProduct);
};

export const deleteCVLibraryProducts = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const cvLibraryProduct = await deleteCVLibraryProduct(req.dbconnection, id)

  if (cvLibraryProduct.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};