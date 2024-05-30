import { whereQuery, insertIntoQuery } from "../../lib/utils.js";

export async function getCVLibrarySubProduct(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_sub_product
  `;
  const { query, params } = whereQuery('cv_library_sub_product', queryString, filters)

  const [cvLibrarySubProducts] = await dbconnection.query(query, params)

  return cvLibrarySubProducts
}

export async function getCVLibrarySubProductById(dbconnection, id) {
  const [cvLibrarySubProduct] = await dbconnection.query("SELECT * FROM `cv_library_sub_product` WHERE id = ?", [id])

  return cvLibrarySubProduct
}

export async function getCVLibrarySubProductByTitle(dbconnection, title) {
  const [cvLibrarySubProduct] = await dbconnection.query("SELECT * FROM `cv_library_sub_product` WHERE title = ?", [title])

  return cvLibrarySubProduct
}

export async function createCVLibrarySubProduct(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_sub_product`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibrarySubProducts] = await getCVLibrarySubProductById(dbconnection, result.insertId);

  return cvLibrarySubProducts
}

export async function updateCVLibrarySubProduct(dbconnection, id, title) {
  await dbconnection.query("UPDATE `cv_library_sub_product` SET `title` = ? WHERE id = ?", [title, id])

  const [cvLibrarySubProduct] = await getCVLibrarySubProductById(dbconnection, id);

  return cvLibrarySubProduct
}

export async function deleteCVLibrarySubProduct(dbconnection, id) {
  const [cvLibrarySubProduct] = await dbconnection.query("DELETE FROM `cv_library_sub_product` WHERE id = ?", [id])

  return cvLibrarySubProduct
}