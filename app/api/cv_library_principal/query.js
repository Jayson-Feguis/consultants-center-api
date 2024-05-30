import { whereQuery, insertIntoQuery } from "../../lib/utils.js";

export async function getCVLibraryPrincipal(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_principal
  `;
  const { query, params } = whereQuery('cv_library_principal', queryString, filters)

  const [cvLibraryPrincipals] = await dbconnection.query(query, params)

  return cvLibraryPrincipals
}

export async function getCVLibraryPrincipalById(dbconnection, id) {
  const [cvLibraryPrincipal] = await dbconnection.query("SELECT * FROM `cv_library_principal` WHERE id = ?", [id])

  return cvLibraryPrincipal
}

export async function getCVLibraryPrincipalByTitle(dbconnection, title) {
  const [cvLibraryPrincipal] = await dbconnection.query("SELECT * FROM `cv_library_principal` WHERE title = ?", [title])

  return cvLibraryPrincipal
}

export async function createCVLibraryPrincipal(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_principal`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryPrincipals] = await getCVLibraryPrincipalById(dbconnection, result.insertId);

  return cvLibraryPrincipals
}

export async function updateCVLibraryPrincipal(dbconnection, id, title) {
  await dbconnection.query("UPDATE `cv_library_principal` SET `title` = ? WHERE id = ?", [title, id])

  const [cvLibraryPrincipal] = await getCVLibraryPrincipalById(dbconnection, id);

  return cvLibraryPrincipal
}

export async function deleteCVLibraryPrincipal(dbconnection, id) {
  const [cvLibraryPrincipal] = await dbconnection.query("DELETE FROM `cv_library_principal` WHERE id = ?", [id])

  return cvLibraryPrincipal
}