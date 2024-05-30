import { whereQuery, insertIntoQuery } from "../../lib/utils.js";

export async function getCVLibraryProduct(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_product
  `;
  const { query, params } = whereQuery('cv_library_product', queryString, filters)

  const [cvLibraryProducts] = await dbconnection.query(query, params)

  return cvLibraryProducts
}

export async function getCVLibraryProductById(dbconnection, id) {
  const [cvLibraryProduct] = await dbconnection.query("SELECT * FROM `cv_library_product` WHERE id = ?", [id])

  return cvLibraryProduct
}
export async function getCVLibraryProductByTitle(dbconnection, title) {
  const [cvLibraryProduct] = await dbconnection.query("SELECT * FROM `cv_library_product` WHERE title = ?", [title])

  return cvLibraryProduct
}

export async function createCVLibraryProduct(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_product`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryProducts] = await getCVLibraryProductById(dbconnection, result.insertId);

  return cvLibraryProducts
}

export async function updateCVLibraryProduct(dbconnection, id, title) {
  await dbconnection.query("UPDATE `cv_library_product` SET `title` = ? WHERE id = ?", [title, id])

  const [cvLibraryProduct] = await getCVLibraryProductById(dbconnection, id);

  return cvLibraryProduct
}

export async function deleteCVLibraryProduct(dbconnection, id) {
  const [cvLibraryProduct] = await dbconnection.query("DELETE FROM `cv_library_product` WHERE id = ?", [id])

  return cvLibraryProduct
}