import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibrarySubProduct, createCVLibrarySubProduct, updateCVLibrarySubProduct, deleteCVLibrarySubProduct } from "./query.js";
import { validateCreateCVLibrarySubProduct, validateUpdateCVLibrarySubProduct } from "./validation.js";

export const getCVLibrarySubProducts = async (req, res) => {
  const cvLibrarySubProducts = await getCVLibrarySubProduct(req.dbconnection, req.query)

  res.status(200).json(transformResponse(cvLibrarySubProducts));
};

export const createCVLibrarySubProducts = async (req, res) => {
  await validateCreateCVLibrarySubProduct(req.body)

  const cvLibrarySubProduct = await createCVLibrarySubProduct(req.dbconnection, req.body)

  res.status(201).json(cvLibrarySubProduct);
};

export const updateCVLibrarySubProducts = async (req, res) => {
  await validateUpdateCVLibrarySubProduct({ ...req.params, ...req.body })
  const { title } = req.body
  const { id } = req.params

  const cvLibrarySubProduct = await updateCVLibrarySubProduct(req.dbconnection, id, title)

  res.status(200).json(cvLibrarySubProduct);
};

export const deleteCVLibrarySubProducts = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Hiring Source ID as parameter is required'))

  const cvLibrarySubProduct = await deleteCVLibrarySubProduct(req.dbconnection, id)

  if (cvLibrarySubProduct.affectedRows <= 0) throw Error(NotFoundError('CV Hiring Source is not found'))

  res.status(200).json({ message: 'CV Hiring Source deleted successfully' });
};