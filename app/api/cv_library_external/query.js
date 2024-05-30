import { whereQuery, insertIntoQuery, updateSetQuery } from "../../lib/utils.js";

export async function getCVLibraryExternal(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_external
  `;
  const { query, params } = whereQuery('cv_library_external', queryString, filters)

  const [cvLibraryExternals] = await dbconnection.query(query, params)

  return cvLibraryExternals
}

export async function getCVLibraryExternalById(dbconnection, id) {
  const [cvLibraryExternal] = await dbconnection.query("SELECT * FROM `cv_library_external` WHERE id = ?", [id])

  return cvLibraryExternal
}

export async function createCVLibraryExternal(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_external`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryExternals] = await getCVLibraryExternalById(dbconnection, result.insertId);

  return cvLibraryExternals
}

export async function updateCVLibraryExternal(dbconnection, options, whereOptions) {
  const { query, params } = updateSetQuery(`cv_library_external`, options, whereOptions)

  await dbconnection.query(query, params)

  const [cvLibraryExternal] = whereOptions?.id ? await getCVLibraryExternalById(dbconnection, whereOptions.id) : [null];

  return cvLibraryExternal
}

export async function deleteCVLibraryExternal(dbconnection, id) {
  const [cvLibraryExternal] = await dbconnection.query("DELETE FROM `cv_library_external` WHERE id = ?", [id])

  return cvLibraryExternal
}