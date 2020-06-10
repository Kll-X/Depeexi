import axios from '@/services/apiClient'

const mockUrl = 'http://39.100.141.76:3000/mock/679'
// deepexi-system-digital-retail/
const apiVersion = '/api/v1'
const prefix = `/deepexi-system-digital-retail`
const apiVersionMock = mockUrl + `${prefix}/api/v1`
const serviceType = '/commodity'
const basicUrl = `${prefix}${apiVersion}${serviceType}`

/**
 * @description 查询类目列表
 */
export const getBackCategorys = params =>
  axios.$get(`${basicUrl}/backCategories`, {params: {...params}})

/**
 * @description 查询类目列表树
 */
export const getBackCategorysTree = params =>
  axios.$get(`${basicUrl}/backCategories/tree`, {params: {...params}})

/**
 * @description 删除类目
 */
export const delAfterCategorysList = ({id}) =>
  axios.$delete(`${basicUrl}/backCategories/${id}`)

/**
 * @description 新增类目
 */
export const postAfterCategorysList = params =>
  axios.$post(`${basicUrl}/backCategories`, {
    ...params,
    sort: 1,
    opened: false,
  })

/**
 * @description 修改类目
 */
export const putAfterCategorysList = ({id, ...params}) =>
  axios.$put(`${basicUrl}/backCategories/${id}`, params)

/**w
 * @description 批量修改类目
 */
export const putAfterCategorysListBatch = params =>
  axios.$put(`${basicUrl}/backCategories/batch`, params)

/**
 * @description 修改类目信息
 */
export const putBackCategorysDetail = ({id, ...params}) =>
  axios.$put(`${basicUrl}/backCategories/${id}`, params)

/**-
 * @description 查询类目信息
 */
export const getBackCategorysDetail = ({id}) =>
  axios.$get(`${basicUrl}/backCategories/${id}`)

/**
 * @description 品牌列表apiString
 */
export const brandList_String = `${basicUrl}/brands`

/**-
 * @description 删除品牌信息
 */
export const delBrandManagement = id =>
  axios.$delete(`${basicUrl}/brands/${id}`)

/**
 * @description 查询品牌列表
 */
export const getBrandList = params => axios.$get(`${basicUrl}/brands`, {params})

/**-
 * @description 查询单个品牌信息
 */
export const getBrandManagement = ({id}) =>
  axios.$get(`${basicUrl}/brands/${id}`)

/**-
 * @description 新增品牌信息
 */
export const postBrandManagement = params =>
  axios.$post(`${basicUrl}/brands`, params)

/**-
 * @description 修改品牌信息
 */
export const putBrandManagement = ({id, ...params}) =>
  axios.$put(`${basicUrl}/brands/${id}`, params)

/**-
 * @description 根据ID查询品牌是否关联商品信息
 */
export const getBrandRelation = params =>
  axios.$get(`${basicUrl}/brands/relation`, {params})

/**-
 * @description 查询类目属性关联apiString
 */
export const backCategoryPropertyRelation_String = ({id}) =>
  `${basicUrl}/categoryPropertyRelationShip/${id}/propertys/relation`

/**-
 * @description 查询类目属性关联
 */
export const getbackCategoryPropertyRelation = ({id}) =>
  axios.$get(
    `${basicUrl}/categoryPropertyRelationShip/${id}/propertys/relation`,
  )

/**-
 * @description 批量修改类目属性关联
 */
export const putCategoryPropertyRelationShipBatch = params =>
  axios.$put(`${basicUrl}/categoryPropertyRelationShip/batch`, params)

/**-
 * @description 批量删除类目属性关联
 */
export const deleteCategoryPropertyRelationShipBatch = ids =>
  axios.$delete(`${basicUrl}/categoryPropertyRelationShip/${ids}`)

/**-
 * @description 保存类目属性关联
 */
export const postCategoryPropertyRelationShip = arr =>
  axios.$post(`${basicUrl}/categoryPropertyRelationShip/batch`, arr)

/**-
 * @description 查询类目未关联属性apiString
 */
export const backCategoryPropertyNotRelation_String = ({id}) =>
  `${basicUrl}/categoryPropertyRelationShip/${id}/propertys/notRelation`

/**
 * @description 属性apiString
 */
export const commodityPropertyList_String = `${basicUrl}/properties`

/**-
 * @description 新增单个属性
 */
export const postCommodityPropertys = params =>
  axios.$post(`${basicUrl}/properties`, {...params})

/**-
 * @description 修改单个属性
 */
export const putCommodityPropertys = ({id, ...params}) =>
  axios.$put(`${basicUrl}/properties/${id}`, {...params})

/**-
 * @description 查询单个属性
 */
export const getCommodityPropertysDetail = ({id}) =>
  axios.$get(`${basicUrl}/properties/${id}`)

/**-
 * @description 删除单个属性
 */
export const deleteProperties = ({id}) =>
  axios.$delete(`${basicUrl}/properties/${id}`)

/**-
 * @description 删除属性前查询是否有关联，批量
 */
export const getCommodityPropertysExistRelation= ({ids}) =>
  axios.$get(`${basicUrl}/properties/relation/${ids}`)


/**
 * @description 查询前台类目列表
 */
export const getFrontCategorys = params =>
  axios.$get(`${basicUrl}/frontCategories`, {params})

/**
 * @description 删除前台类目
 */
export const delFrontCategorysList = ({id}) =>
  axios.$delete(`${basicUrl}/frontCategories/${id}`)

/**
 * @description 新增前台类目
 */
export const postFrontCategorysList = params =>
  axios.$post(`${basicUrl}/frontCategories`, {
    ...params,
    sort: 1,
    opened: false,
  })

/**
 * @description 修改前台类目
 */
export const putFrontCategorysList = ({id, ...params}) =>
  axios.$put(`${basicUrl}/frontCategories/${id}`, params)

/**w
 * @description 批量修改前台类目
 */
export const putFrontCategorysListBatch = params =>
  axios.$put(`${basicUrl}/frontCategories/batch`, params)

/**-
 * @description 查询类目信息
 */
export const getFrontCategorysDetail = ({id}) =>
  axios.$get(`${basicUrl}/frontCategories/${id}`)

/**-
 * @description 根据前台类目ID查询后台类目
 */
export const getFrontCategoryRelationshipWithBack_String = id =>
  `${basicUrl}/categoryRelationship/listBackCategory/${id}`

/**-
 * @description 批量保存前后台类目关联
 */
export const postCategoryRelationshipBatch = params =>
  axios.$post(`${basicUrl}/categoryRelationship/batch`, params)

/**-
 * @description 批量删除前后台类目关联
 */
export const delCategoryRelationshipBatch = ids =>
  axios.$delete(`${basicUrl}/categoryRelationship/${ids}`)

/**-
 * @description 获取前台未关联的类目树
 */
export const getBackCategoryNoRelationWithFront = ({id, ...params}) =>
  axios.$get(
    `${basicUrl}/categoryRelationship/notRelation/backCategory/${id}/tree`,{params}
  )

/**
 * @description 商品列表apiString
 */
export const goodsList_String = `${basicUrl}/goods/page`

/**
 * @description 查询商品信息 批量
 */
export const getCommodityGoods = params =>
  axios.$get(`${basicUrl}/goods`, {params})

/**
 * @description 查询商品信息 单个
 */
export const getCommodityGoodSingle = id =>
  axios.$get(`${basicUrl}/goods/${id}`)

/**-
 * @description 商品删除
 */
export const delCommodityGoodsBatch = ({ids}) =>
  axios.$delete(`${basicUrl}/goods/${ids}`)

/**-
 * @description 更新商品
 */
export const putCommodityGoods = ({id, ...params}) =>
  axios.$put(`${basicUrl}/goods/${id}`, params)

/**-
 * @description 新增商品
 */
export const postCommodityGoods = params =>
  axios.$post(`${basicUrl}/goods`, params)

/**
 * @description 商品上下架列表apiString
 */
export const commodityShelvesPage_String = `${basicUrl}/shelves/page`

/**-
 * @description 修改上下架状态 单个
 */
export const putCommodityShelves = ({id, ...params}) =>
  axios.$put(`${basicUrl}/shelves/${id}`, params)

/**-
 * @description 修改上下架状态 批量
 */
export const putCommodityShelvesBatch = params =>
  axios.$put(`${basicUrl}/shelves/batch`, params)

/**-
 * @description 删除已上架商品
 */
export const delCommodityShelves = ({ids}) =>
  axios.$delete(`${basicUrl}/shelves/${ids}`, ids)

/**-
 * @description 获取上架详情
 */
export const getCommodityShelves = ({id}) =>
  axios.$get(`${basicUrl}/shelves/${id}`)

/**-
 * @description 新增上下架
 */
export const postCommodityShelves = (params, config) =>
  axios.$post(`${basicUrl}/shelves`, params, config)

/**-
 * @description 查询sku数据
 */
export const getSkuItem_String = `${basicUrl}/goods/page/skuAndItem`

/**-
 * @description 查询sku数据
 */
export const getSkuItem = (params) =>
  axios.$get(`${basicUrl}/goods/page/skuAndItem`, {params})

/**-
 * @description 查询sku数据
 */
export const getCheckBeforeDeleteBack = (params) =>
  axios.$get(`${basicUrl}/backCategories/delete/check`, {params})