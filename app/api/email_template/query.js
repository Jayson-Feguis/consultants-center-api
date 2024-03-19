import mysql from '../../config/db.config.js'

export async function getEmailTemplateByCode(code) {
  const [email_template] = await mysql.query("SELECT * from `email_templates` where code=?", [code])

  return email_template
}