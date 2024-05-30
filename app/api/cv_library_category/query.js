import { whereQuery, insertIntoQuery, updateSetQuery } from "../../lib/utils.js";

export async function getCVLibraryCategory(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_category
  `;
  const { query, params } = whereQuery('cv_library_category', queryString, filters)

  const [cvLibraryCategories] = await dbconnection.query(query, params)

  return cvLibraryCategories
}

export async function getCVLibraryCategoryById(dbconnection, id) {
  const [cvLibraryCategory] = await dbconnection.query("SELECT * FROM `cv_library_category` WHERE id = ?", [id])

  return cvLibraryCategory
}

export async function getCVLibraryCategoryByCategory(dbconnection, businessUnit, module, principal, product, subProduct) {
  let query = '', params = []
  if (subProduct) {
    query = "SELECT * FROM `cv_library_category` WHERE businessUnit = ? AND module = ? AND principal = ? AND product = ? AND subProduct = ?";
    params = [businessUnit, module, principal, product, subProduct]
  } else {
    query = "SELECT * FROM `cv_library_category` WHERE businessUnit = ? AND module = ? AND principal = ? AND product = ? AND subProduct IS NULL";
    params = [businessUnit, module, principal, product]
  }
  const [cvLibraryCategory] = await dbconnection.query(query, params)

  return cvLibraryCategory
}

export async function createCVLibraryCategory(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_category`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryCategories] = await getCVLibraryCategoryById(dbconnection, result.insertId);

  return cvLibraryCategories
}

export async function updateCVLibraryCategory(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`cv_library_category`, options, whereOptions)

  await dbconnection.query(query, params)

  const [cvLibraryCategory] = whereOptions?.id ? await getCVLibraryCategoryById(dbconnection, whereOptions.id) : null;

  return cvLibraryCategory
}

export async function deleteCVLibraryCategory(dbconnection, id) {
  const [cvLibraryCategory] = await dbconnection.query("DELETE FROM `cv_library_category` WHERE id = ?", [id])

  return cvLibraryCategory
}