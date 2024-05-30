import { NotFoundError, transformResponse, uploadFileToS3, ValidationError } from "../../lib/utils.js";
import { createCVLibraryExternal, deleteCVLibraryExternal, getCVLibraryExternal, updateCVLibraryExternal } from "./query.js";
import { validateCreateCVLibraryExternal, validateUpdateCVLibraryExternal } from "./validation.js";
import { createMedia, getMediaById } from "../media/query.js";
import { getCVLibraryBusinessUnitById } from "../cv_library_business_unit/query.js";
import { getCVLibraryModuleById } from "../cv_library_module/query.js";
import { getCVLibraryPrincipalById } from "../cv_library_principal/query.js";
import { getCVLibraryProductById } from "../cv_library_product/query.js";
import { getCVLibrarySubProductById } from "../cv_library_sub_product/query.js";

export const getCVLibraryExternals = async (req, res) => {
  let cvLibraryExternals = await getCVLibraryExternal(req.dbconnection, req.query)
  const cvLibraryExternalList = [];

  for (const external of cvLibraryExternals) {
    const attachments = JSON.parse(external.attachments)
    external.attachments = attachments?.length > 0 ? await Promise.all(attachments?.map(async attachmentId => {
      const [externalFile] = await getMediaById(req.dbconnection, attachmentId)

      return externalFile
    })) : []

    const businessUnit = external?.businessUnit ? await Promise.all(external?.businessUnit?.split(',').map(async (bu) => {
      const [b] = await getCVLibraryBusinessUnitById(req.dbconnection, bu)
      return b
    })) : []

    const module = external?.module ? await Promise.all(external?.module?.split(',').map(async (mod) => {
      const [m] = await getCVLibraryModuleById(req.dbconnection, mod)
      return m
    })) : []

    const principal = external?.principal ? await Promise.all(external?.principal?.split(',').map(async (pri) => {
      const [p] = await getCVLibraryPrincipalById(req.dbconnection, pri)
      return p
    })) : []

    const product = external?.product ? await Promise.all(external?.product?.split(',').map(async (pro) => {
      const [p] = await getCVLibraryProductById(req.dbconnection, pro)
      return p
    })) : []

    const subProduct = external?.subProduct ? await Promise.all(external?.subProduct?.split(',').map(async (sub) => {
      const [s] = await getCVLibrarySubProductById(req.dbconnection, sub)
      return s
    })) : []

    external.businessUnit = businessUnit;
    external.module = module;
    external.principal = principal;
    external.product = product;
    external.subProduct = subProduct;

    cvLibraryExternalList.push(external)
  }

  res.status(200).json(transformResponse(cvLibraryExternalList));
};

export const createCVLibraryExternals = async (req, res) => {
  await validateCreateCVLibraryExternal(req.body)

  let attachments = []

  if (req.files?.singleFile || req?.files?.singleFile?.length > 0) attachments = await Promise.all(req.files?.singleFile.map(async (file) => {
    const filePath = await uploadFileToS3(file)

    const media = await createMedia(req.dbconnection, { filePath })

    return media.insertId
  }))

  if (req?.files?.multipleFile || req?.files?.multipleFile?.length > 0) attachments = [...attachments, ...await Promise.all(req?.files?.multipleFile.map(async (file) => {
    const filePath = await uploadFileToS3(file)

    const media = await createMedia(req.dbconnection, { filePath })

    return media.insertId
  }))]

  const cvLibraryExternal = await createCVLibraryExternal(req.dbconnection, { ...req.body, attachments: JSON.stringify(attachments) })

  res.status(201).json(cvLibraryExternal);
};

export const updateCVLibraryExternals = async (req, res) => {
  await validateUpdateCVLibraryExternal({ ...req.params, ...req.body })

  let attachments = []


  if (req?.files?.singleFile || req?.files?.singleFile?.length > 0) attachments = await Promise.all(req.files.singleFile.map(async (file) => {
    const filePath = await uploadFileToS3(file)

    const media = await createMedia(req.dbconnection, { filePath })

    return media.insertId
  }))

  if (req.files.multipleFile || req?.files?.multipleFile?.length > 0) attachments = [...attachments, ...await Promise.all(req.files.multipleFile.map(async (file) => {
    const filePath = await uploadFileToS3(file)

    const media = await createMedia(req.dbconnection, { filePath })

    return media.insertId
  }))]

  const cvLibraryExternal = await updateCVLibraryExternal(req.dbconnection, { ...req.body, attachments: JSON.stringify(req.body.attachments ? [...req.body.attachments, ...attachments] : attachments) }, req.params)

  res.status(200).json(cvLibraryExternal);
};

export const deleteCVLibraryExternals = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('External ID as parameter is required'))

  const cvLibraryExternal = await deleteCVLibraryExternal(req.dbconnection, id)

  if (cvLibraryExternal.affectedRows <= 0) throw Error(NotFoundError('External CV is not found'))

  res.status(200).json({ message: 'External CV deleted successfully' });
};