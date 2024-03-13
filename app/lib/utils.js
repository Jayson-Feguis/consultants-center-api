import mysql from '../config/db.config.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";

dotenv.config()

export function generateAccessToken(user) {

  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_DURATION })

}


export async function paginateTable(tableName, fields = undefined, page = 1, limit = 25) {

  if (+page <= 0) throw Error('Page should not be less than 1')

  const offset = (+page - 1) * +limit;

  const [data] = await mysql.query(`SELECT ${fields ? fields.join(', ') : '*'} from ${tableName} limit ? offset ?`, [+limit, +offset])

  const [totalPageData] = await mysql.query(`SELECT count(*) as count from ${tableName}`)

  const totalPage = Math.ceil(+totalPageData[0]?.count / +limit)

  if (+page > totalPage) throw Error(`Page should not be more than total page. Note: total page is ${totalPage}`)

  return {
    data,
    pagination: {
      page: +page,
      limit: +limit,
      totalPage
    }
  }
}

export function ValidationError(error) {
  return "ValidationError: " + error
}

export function NotFoundError(error) {
  return "NotFoundError: " + error
}

export function UnauthorizedError(error) {
  return "UnauthorizedError: " + error
}
