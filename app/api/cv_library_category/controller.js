import _ from "lodash";
import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getCVLibraryBusinessUnitById } from "../cv_library_business_unit/query.js";
import { getCVLibraryModuleById } from "../cv_library_module/query.js";
import { getCVLibraryPrincipalById } from "../cv_library_principal/query.js";
import { getCVLibraryProductById } from "../cv_library_product/query.js";
import { getCVLibrarySubProductById } from "../cv_library_sub_product/query.js";
import { getCVLibraryCategory, createCVLibraryCategory, updateCVLibraryCategory, deleteCVLibraryCategory } from "./query.js";
import { validateCreateCVLibraryCategory, validateUpdateCVLibraryCategory } from "./validation.js";

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
  const requiredTypes = []
  if (!req.files?.singleFile) throw Error(ValidationError('Please attached file'))

  if (req.files?.singleFile?.length !== 1) throw Error(ValidationError('One (1) file is required'))

  if (!type) throw Error(ValidationError('Import type as parameter is required'))

  console.log(req.files?.singleFile[0])

  // const cvLibraryCategory = await createCVLibraryCategory(req.dbconnection, req.body)

  res.status(201).json({ message: 'OK' });
};

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