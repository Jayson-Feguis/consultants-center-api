export async function getEmailTemplateByCode(dbconnection, code) {
  const [email_template] = await dbconnection.query("SELECT * from `email_templates` where code=?", [code])

  return email_template
}