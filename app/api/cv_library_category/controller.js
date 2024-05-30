import _ from "lodash";
import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { createCVLibraryBusinessUnit, getCVLibraryBusinessUnitById, getCVLibraryBusinessUnitByTitle } from "../cv_library_business_unit/query.js";
import { createCVLibraryModule, getCVLibraryModuleById, getCVLibraryModuleByTitle } from "../cv_library_module/query.js";
import { createCVLibraryPrincipal, getCVLibraryPrincipalById, getCVLibraryPrincipalByTitle } from "../cv_library_principal/query.js";
import { createCVLibraryProduct, getCVLibraryProductById, getCVLibraryProductByTitle } from "../cv_library_product/query.js";
import { createCVLibrarySubProduct, getCVLibrarySubProductById, getCVLibrarySubProductByTitle } from "../cv_library_sub_product/query.js";
import { getCVLibraryCategory, createCVLibraryCategory, updateCVLibraryCategory, deleteCVLibraryCategory, getCVLibraryCategoryByCategory } from "./query.js";
import { validateCreateCVLibraryCategory, validateUpdateCVLibraryCategory } from "./validation.js";
import * as XLSX from 'xlsx'

let cachedBusinessUnit = {}, cachedModule = {}, cachedPrincipal = {}, cachedProduct = {}, cachedSubProduct = {}

export const getCVLibraryCategories = async (req, res) => {
  let cvLibraryCategories = await getCVLibraryCategory(req.dbconnection, req.query)

  cvLibraryCategories = await Promise.all(cvLibraryCategories.map(async category => {
    const [businessUnit] = await getCVLibraryBusinessUnitById(req.dbconnection, category?.businessUnit)
    const [module] = await getCVLibraryModuleById(req.dbconnection, category?.module)
    const [principal] = await getCVLibraryPrincipalById(req.dbconnection, category?.principal)
    const [product] = await getCVLibraryProductById(req.dbconnection, category?.product)
    const [subProduct] = await getCVLibrarySubProductById(req.dbconnection, category?.subProduct)
    category.businessUnit = businessUnit
    category.module = module
    category.principal = principal
    category.product = product
    category.subProduct = subProduct

    return category
  }))

  res.status(200).json(transformResponse(cvLibraryCategories));
};

export const getCVLibraryCategoriesForBusinessUnit = async (req, res) => {
  let cvLibraryCategories = []

  cvLibraryCategories = await getCVLibraryCategory(req.dbconnection, req.query)
  cvLibraryCategories = await Promise.all(cvLibraryCategories.map(async category => {
    const businessUnit = await Promise.all(category?.businessUnit?.split(',').map(async (bu) => {
      const [b] = await getCVLibraryBusinessUnitById(req.dbconnection, bu)
      return b
    }))

    category.businessUnit = _.flatMap(businessUnit);

    return category
  }))

  res.status(200).json(transformResponse(_.uniqBy(_.flatMap(cvLibraryCategories?.map(c => c.businessUnit)), item => item?.id)));
};

export const getCVLibraryCategoriesForModule = async (req, res) => {
  let cvLibraryCategories = []

  if (req.query?.businessUnit) {
    cvLibraryCategories = await getCVLibraryCategory(req.dbconnection, req.query)
    cvLibraryCategories = await Promise.all(cvLibraryCategories.map(async category => {
      const businessUnit = await Promise.all(category?.businessUnit?.split(',').filter(bu => req.query.businessUnit.split(',').includes(bu.toString())).map(async (bu) => {
        const [b] = await getCVLibraryBusinessUnitById(req.dbconnection, bu)
        return b
      }))

      const module = await Promise.all(category?.module?.split(',').map(async (mod) => {
        const [m] = await getCVLibraryModuleById(req.dbconnection, mod)
        return m
      }))

      category.module = _.flatMap(module.map((m => businessUnit.map(bu => ({ ...m, title: m.title, parent: bu })))));

      return category
    }))
  }

  res.status(200).json(transformResponse(req.query?.businessUnit ? _.uniqBy(_.flatMap(cvLibraryCategories?.map(c => c.module)), item => `${item?.id}-${item?.parent?.id}`) : []));
};

export const getCVLibraryCategoriesForPrincipal = async (req, res) => {
  let cvLibraryCategories = []

  if (req.query?.businessUnit && req.query?.module) {
    cvLibraryCategories = await getCVLibraryCategory(req.dbconnection, req.query)
    cvLibraryCategories = await Promise.all(cvLibraryCategories.map(async category => {
      const module = await Promise.all(category?.module?.split(',').filter(bu => req.query.module.split(',').includes(bu.toString())).map(async (bu) => {
        const [b] = await getCVLibraryModuleById(req.dbconnection, bu)
        return b
      }))

      const principal = await Promise.all(category?.principal?.split(',').map(async (mod) => {
        const [m] = await getCVLibraryPrincipalById(req.dbconnection, mod)
        return m
      }))

      category.principal = _.flatMap(principal.map((p => module.map(mo => ({ ...p, title: p.title, parent: mo })))));

      return category
    }))
  }

  res.status(200).json(transformResponse(req.query?.businessUnit && req.query?.module ? _.uniqBy(_.flatMap(cvLibraryCategories?.map(c => c.principal)), item => `${item?.id}-${item?.parent?.id}`) : []));
};

export const getCVLibraryCategoriesForProduct = async (req, res) => {
  let cvLibraryCategories = []

  if (req.query?.businessUnit && req.query?.module && req.query?.principal) {
    cvLibraryCategories = await getCVLibraryCategory(req.dbconnection, req.query)
    cvLibraryCategories = await Promise.all(cvLibraryCategories.map(async category => {
      const principal = await Promise.all(category?.principal?.split(',').filter(pri => req.query.principal.split(',').includes(pri.toString())).map(async (pri) => {
        const [b] = await getCVLibraryPrincipalById(req.dbconnection, pri)
        return b
      }))

      const product = await Promise.all(category?.product?.split(',').map(async (prod) => {
        const [p] = await getCVLibraryProductById(req.dbconnection, prod)
        return p
      }))

      category.product = _.flatMap(product.map((p => principal.map(pri => ({ ...p, title: p.title, parent: pri })))));

      return category
    }))
  }

  res.status(200).json(transformResponse(req.query?.businessUnit && req.query?.module && req.query?.principal ? _.uniqBy(_.flatMap(cvLibraryCategories?.map(c => c.product)), item => `${item?.id}-${item?.parent?.id}`) : []));
};

export const getCVLibraryCategoriesForSubProduct = async (req, res) => {
  let cvLibraryCategories = []

  if (req.query?.businessUnit && req.query?.module && req.query?.principal && req.query?.product) {
    cvLibraryCategories = await getCVLibraryCategory(req.dbconnection, req.query)
    cvLibraryCategories = await Promise.all(cvLibraryCategories.map(async category => {
      const product = await Promise.all(category?.product?.split(',').filter(bu => req.query.product.split(',').includes(bu.toString())).map(async (bu) => {
        const [b] = await getCVLibraryProductById(req.dbconnection, bu)
        return b
      }))

      const subProduct = await Promise.all(category?.subProduct?.split(',').map(async (sub) => {
        const [s] = await getCVLibrarySubProductById(req.dbconnection, sub)
        return s
      }))

      category.subProduct = _.flatMap(subProduct.map((p => product.map(pro => ({ ...p, title: p?.title, parent: pro })))));

      return category
    }))
  }

  res.status(200).json(transformResponse(req.query?.businessUnit && req.query?.module && req.query?.principal && req.query?.product ? _.uniqBy(_.flatMap(cvLibraryCategories?.map(c => c.subProduct)).filter(s => _.has(s, 'id')), item => `${item?.id}-${item?.parent?.id}`) : []));
};

export const createCVLibraryCategories = async (req, res) => {
  await validateCreateCVLibraryCategory(req.body)

  const cvLibraryCategory = await createCVLibraryCategory(req.dbconnection, req.body)

  res.status(201).json(cvLibraryCategory);
};

export const createCVLibraryCategoriesImport = async (req, res) => {
  const { type } = req.params
  let file = req.files?.singleFile
  const requiredTypes = {
    excel: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/csv',  // Less common, sometimes encountered
      'text/csv',
      'text/spreadsheet', // For SYLK files
      'text/tab-separated-values' // For TSV files
    ]
  }

  if (!file) throw Error(ValidationError('Please attached file'))

  if (file?.length !== 1) throw Error(ValidationError('One (1) file is required'))

  if (!type) throw Error(ValidationError('Import type as parameter is required'))

  file = file[0]

  if (!requiredTypes[type].includes(file?.mimetype)) throw Error(ValidationError('Invalid file'))

  const transformedData = [], newInserted = [];
  let i = 0;

  if (type === 'excel') {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const item of data) {
      let transformedItem = { ...item };

      // BUSINESS UNIT
      const { newItem: businessUnitItem } = await cachedAndTransformCategories(req, transformedItem, item, 'businessUnit')
      transformedItem = { ...businessUnitItem }

      // MODULE
      const { newItem: moduleItem } = await cachedAndTransformCategories(req, transformedItem, item, 'module')
      transformedItem = { ...moduleItem }

      // PRINCIPAL
      const { newItem: principalItem } = await cachedAndTransformCategories(req, transformedItem, item, 'principal')
      transformedItem = { ...principalItem }

      // PRODUCT
      const { newItem: productItem } = await cachedAndTransformCategories(req, transformedItem, item, 'product')
      transformedItem = { ...productItem }

      // SUB PRODUCT
      const { newItem: subProductItem } = await cachedAndTransformCategories(req, transformedItem, item, 'subProduct')
      transformedItem = { ...subProductItem }

      transformedData.push(transformedItem);
    }

    for (const item of transformedData) {
      const isExist = await getCVLibraryCategoryByCategory(req.dbconnection, item.businessUnit, item.module, item.principal, item.product, item.subProduct)

      if (isExist.length <= 0) {
        await createCVLibraryCategory(req.dbconnection, item)
        newInserted.push({ row: i + 1, ...data[i] })
      }
      i = i + 1;
    }
  }


  res.status(201).json({ message: 'OK', newInserted });
};

const nullishValue = ['', 'n/a', 'N/A']

async function cachedAndTransformCategories(req, transformedItem, item, key) {
  const newItem = { ...transformedItem }
  const newCached = key === 'businessUnit' ? cachedBusinessUnit : key === 'module' ? cachedModule : key === 'principal' ? cachedPrincipal : key === 'product' ? cachedProduct : key === 'subProduct' ? cachedSubProduct : {}

  // CHECK IF VALUE IS NULL
  if (!item[key] || nullishValue.includes(item[key])) newItem[key] = null

  // CHECK IF THIS IS NOT CACHED
  else if (!newCached?.[item[key]]) {

    const [result] = key === 'businessUnit' ? await getCVLibraryBusinessUnitByTitle(req.dbconnection, newItem[key])
      : key === 'module' ? await getCVLibraryModuleByTitle(req.dbconnection, newItem[key])
        : key === 'principal' ? await getCVLibraryPrincipalByTitle(req.dbconnection, newItem[key])
          : key === 'product' ? await getCVLibraryProductByTitle(req.dbconnection, newItem[key])
            : key === 'subProduct' ? await getCVLibrarySubProductByTitle(req.dbconnection, newItem[key]) : [null];
    // IF THIS IS EXISTING IN THE DATABASE
    if (result) {
      newItem[key] = result.id;
      newCached[item[key]] = result.id;
    }
    // CREATE NEW SINCE THIS IS NOT EXISTING IN THE DATABASE
    else {
      const result = key === 'businessUnit' ? await createCVLibraryBusinessUnit(req.dbconnection, { title: newItem[key] })
        : key === 'module' ? await createCVLibraryModule(req.dbconnection, { title: newItem[key] })
          : key === 'principal' ? await createCVLibraryPrincipal(req.dbconnection, { title: newItem[key] })
            : key === 'product' ? await createCVLibraryProduct(req.dbconnection, { title: newItem[key] })
              : key === 'subProduct' ? await createCVLibrarySubProduct(req.dbconnection, { title: newItem[key] }) : null;

      if (result) {
        newItem[key] = result.id;
        newCached[item[key]] = result.id;
      }
    }
  } else newItem[key] = newCached[item[key]];

  return { newItem, newCached }
}

export const updateCVLibraryCategories = async (req, res) => {
  await validateUpdateCVLibraryCategory({ ...req.params, ...req.body })

  const cvLibraryCategory = await updateCVLibraryCategory(req.dbconnection, req.body, req.params)

  res.status(200).json(cvLibraryCategory);
};

export const deleteCVLibraryCategories = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Category ID as parameter is required'))

  const cvLibraryCategory = await deleteCVLibraryCategory(req.dbconnection, id)

  if (cvLibraryCategory.affectedRows <= 0) throw Error(NotFoundError('CV Category is not found'))

  res.status(200).json({ message: 'CV Category deleted successfully' });
};