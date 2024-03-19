import mysql from '../config/db.config.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
import AWS from 'aws-sdk'
import fs from 'fs';

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

export function ValidationError(error) {
  return "ValidationError: " + error
}

export function NotFoundError(error) {
  return "NotFoundError: " + error
}

export function UnauthorizedError(error) {
  return "UnauthorizedError: " + error
}
