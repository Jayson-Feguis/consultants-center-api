import mysql from '../config/db.config.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
import AWS from 'aws-sdk'
import moment from 'moment';

dotenv.config()

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const accessKeyId = process.env.S3_AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET_NAME || "";

export const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

export async function uploadFileToS3(file) {
  const Body = file.buffer;
  const Key = `consultant-center/${file.originalname.split('.')[0]}_${+new Date()}.${file.originalname.split('.')[1]}`;

  // Use an async/await wrapper for the S3 operation
  await s3.upload({ Bucket, Key, Body, ContentType: file.mimetype },
    (err) => {
      if (err) throw Error(err.message);
    }).promise();

  return Key
};

export function encryptPassword(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

export function generateAccessToken(user, expiresIn = process.env.ACCESS_TOKEN_DURATION) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn })
}

export const generateCutOff = (today = new Date(), count = 12) => {
  // Convert the input date to a moment object
  const todayDate = moment(today);

  // Array to store the cutoff periods
  const cutOffPeriods = [];

  // Calculate the last 12 monthly periods
  for (let i = 0; i < count; i++) {
    const toDate = moment(todayDate).subtract(i, 'months').date(20);
    const fromDate = moment(toDate).subtract(1, 'months').date(21);

    // Add the cutoff period to the list
    cutOffPeriods.push({
      title: fromDate.format('MMMM D, YYYY') + ' | ' + toDate.format('MMMM D, YYYY'),
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD')
    });
  }

  return cutOffPeriods;
}

export function whereQuery(tableName, query, filters, andOr = 'AND', useTableName = true) {
  let params = [];

  const keys = Object.keys(filters).filter((key) => Boolean(filters[key]));

  if (keys.length > 0) {
    query += ' WHERE ';
    query += keys.map((key) => {
      const dateRangeRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/;

      // Sample value '=SampleValue'
      if (/^=/.test(filters[key])) {
        params.push(filters[key].split('=')[1])
        return useTableName ? `${tableName}.${key} = ?` : `${key} = ?`;
      }
      // Check if the filter value represents a date range
      // Sample value = 2024-01-01,2024-01-10
      else if (dateRangeRegex.test(filters[key])) {
        params.push(filters[key].split(',')[0]);
        params.push(filters[key].split(',')[1]);
        params.push(filters[key].split(',')[0]);
        params.push(filters[key].split(',')[1]);
        return useTableName ? `(${tableName}.${key} BETWEEN ? AND ? OR ${tableName}.${key} IN (?, ?))` : `(${key} BETWEEN ? AND ? OR ${key} IN (?, ?))`;
      }
      // Check if the filter value represents a comparison operation such as greater than or less than a number
      // Sample value > 0
      else if (/^[<>]=?=?\d+$/.test(filters[key])) {
        const operator = filters[key][0]; // Extract the comparison operator
        const value = filters[key].substring(1); // Extract the numerical value
        params.push(value);
        return useTableName ? `${tableName}.${key} ${operator} ?` : `${key} ${operator} ?`;
      }
      // Sample value '4,1,3,5'
      else if (/\b1\b/.test(filters[key])) {
        filters[key].split(',').forEach((v) => params.push(v))

        return filters[key].split(',').map(() => `FIND_IN_SET(?, ${key}) > 0`).join(' OR ')
      }
      // Default case for string matching
      // Sample value = 'LIKE %sample%'
      else {
        params.push(`%${filters[key]}%`);
        return useTableName ? `${tableName}.${key} LIKE ?` : `${key} LIKE ?`;
      }
    }).join(` ${andOr} `);
  }

  return {
    query, params
  };
}

export function insertIntoQuery(tableName, options) {
  const columns = [], params = [];

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      columns.push(key);
      params.push(value);
    }
  }

  const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;

  return {
    query, params
  }
}

export function updateSetQuery(tableName, options, whereOptions, andOr = 'AND') {
  const columns = [], params = []

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      columns.push(`${key} = ?`);
      params.push(value);
    }
  }

  const updateQuery = `UPDATE ${tableName} SET ${columns.join(', ')}`;

  const { query, params: whereParams } = whereQuery(tableName, updateQuery, whereOptions, andOr)

  return {
    query, params: [...params, ...whereParams]
  }
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

export async function sendEmail(to, subject, html) {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

export function transformResponse(response) {
  return {
    data: response,
    pagination: {}
  }
}

export function transformMenuData(data) {
  // Create a map to store items by their ID
  const idMap = new Map();

  // Iterate through the data and group items by their ID
  data.forEach(item => {
    if (!idMap.has(item.id)) {
      idMap.set(item.id, item);
    }
  });

  // Iterate through the data again and add submenus to items with children
  data.forEach(item => {
    if (item.parentId !== null && idMap.has(item.parentId)) {
      const parentItem = idMap.get(item.parentId);
      if (!parentItem.subMenus) {
        parentItem.subMenus = [];
      }
      parentItem.subMenus.push(item);
      parentItem.hasSub = true;
    }
  });

  // Filter out the items without parents, i.e., top-level menu items
  const transformedData = Array.from(idMap.values()).filter(item => item.parentId === null);

  return transformedData;
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
