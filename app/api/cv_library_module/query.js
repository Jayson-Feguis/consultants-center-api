import { whereQuery, insertIntoQuery } from "../../lib/utils.js";

export async function getCVLibraryModule(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_module
  `;
  const { query, params } = whereQuery('cv_library_module', queryString, filters)

  const [cvLibraryModules] = await dbconnection.query(query, params)

  return cvLibraryModules
}

export async function getCVLibraryModuleById(dbconnection, id) {
  const [cvLibraryModule] = await dbconnection.query("SELECT * FROM `cv_library_module` WHERE id = ?", [id])

  return cvLibraryModule
}

export async function getCVLibraryModuleByTitle(dbconnection, title) {
  const [cvLibraryModule] = await dbconnection.query("SELECT * FROM `cv_library_module` WHERE title = ?", [title])

  return cvLibraryModule
}

export async function createCVLibraryModule(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_module`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryModules] = await getCVLibraryModuleById(dbconnection, result.insertId);

  return cvLibraryModules
}

export async function updateCVLibraryModule(dbconnection, id, title) {
  await dbconnection.query("UPDATE `cv_library_module` SET `title` = ? WHERE id = ?", [title, id])

  const [cvLibraryModule] = await getCVLibraryModuleById(dbconnection, id);

  return cvLibraryModule
}

export async function deleteCVLibraryModule(dbconnection, id) {
  const [cvLibraryModule] = await dbconnection.query("DELETE FROM `cv_library_module` WHERE id = ?", [id])

  return cvLibraryModule
}