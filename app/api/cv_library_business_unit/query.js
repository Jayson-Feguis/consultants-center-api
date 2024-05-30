import { whereQuery, insertIntoQuery } from "../../lib/utils.js";

export async function getCVLibraryBusinessUnit(dbconnection, filters) {
  let queryString = `
    SELECT 
      * 
    FROM 
      cv_library_business_unit
  `;
  const { query, params } = whereQuery('cv_library_business_unit', queryString, filters)

  const [cvLibraryBusinessUnits] = await dbconnection.query(query, params)

  return cvLibraryBusinessUnits
}

export async function getCVLibraryBusinessUnitById(dbconnection, id) {
  const [cvLibraryBusiness] = await dbconnection.query("SELECT * FROM `cv_library_business_unit` WHERE id = ?", [id])

  return cvLibraryBusiness
}

export async function getCVLibraryBusinessUnitByTitle(dbconnection, title) {
  const [cvLibraryBusiness] = await dbconnection.query("SELECT * FROM `cv_library_business_unit` WHERE title = ?", [title])

  return cvLibraryBusiness
}

export async function createCVLibraryBusinessUnit(dbconnection, options) {
  const { query, params } = insertIntoQuery(`cv_library_business_unit`, options)

  const [result] = await dbconnection.query(query, params)

  const [cvLibraryBusinessUnits] = await getCVLibraryBusinessUnitById(dbconnection, result.insertId);

  return cvLibraryBusinessUnits
}

export async function updateCVLibraryBusinessUnit(dbconnection, id, title) {
  await dbconnection.query("UPDATE `cv_library_business_unit` SET `title` = ? WHERE id = ?", [title, id])

  const [cvLibraryBusinessUnit] = await getCVLibraryBusinessUnitById(dbconnection, id);

  return cvLibraryBusinessUnit
}

export async function deleteCVLibraryBusinessUnit(dbconnection, id) {
  const [cvLibraryBusinessUnit] = await dbconnection.query("DELETE FROM `cv_library_business_unit` WHERE id = ?", [id])

  return cvLibraryBusinessUnit
}