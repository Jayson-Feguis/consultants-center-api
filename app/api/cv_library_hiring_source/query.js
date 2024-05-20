import { whereQuery, insertIntoQuery } from "../../lib/utils.js";

export async function getCVLibraryHiringSource(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_hiring_source
  `;
  const { query, params } = whereQuery('cv_library_hiring_source', queryString, filters)

  const [cvLibraryHiringSources] = await dbconnection.query(query, params)

  return cvLibraryHiringSources
}

export async function getCVLibraryHiringSourceById(dbconnection, id) {
  const [cvLibraryHiringSource] = await dbconnection.query("SELECT * FROM `cv_library_hiring_source` WHERE id = ?", [id])

  return cvLibraryHiringSource
}

export async function createCVLibraryHiringSource(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_hiring_source`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryHiringSources] = await getCVLibraryHiringSourceById(dbconnection, result.insertId);

  return cvLibraryHiringSources
}

export async function updateCVLibraryHiringSource(dbconnection, id, title) {
  await dbconnection.query("UPDATE `cv_library_hiring_source` SET `title` = ? WHERE id = ?", [title, id])

  const [cvLibraryHiringSource] = await getCVLibraryHiringSourceById(dbconnection, id);

  return cvLibraryHiringSource
}

export async function deleteCVLibraryHiringSource(dbconnection, id) {
  const [cvLibraryHiringSource] = await dbconnection.query("DELETE FROM `cv_library_hiring_source` WHERE id = ?", [id])

  return cvLibraryHiringSource
}