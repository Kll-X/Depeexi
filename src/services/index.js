import axios from '@/services/apiClient'
const context = '/deepexi-system-digital-retail'
const version = '/api/v1'
const baseUrl = context + version
const deepexiUrl = '/deepexi-cloud' + version
const deepexiCloudTenant = '/deepexi-cloud/tenant' + version

/**
 * 登陆
 */
export const login = params =>
  axios.$post(`${deepexiUrl}/login`, {
    channel: 'pc',
    ...params,
  })

/**
 * 根据token获取用户信息
 * @param {string} token
 */
export const getUserInfo = token =>
  axios.$get(`${deepexiUrl}/token?token=${token}`)

/**
 * 获取当前用户已开通的产品
 */
export const getOpenProducts = () =>
  axios.$get(
    `/asset-service/tenant/api/v1/products/permission-product-group-by-channel`,
  )

/**
 * 获取当前用户的菜单权限
 * @param {*} productId 菜单功能组id
 */
export const getUserPermission = productId =>
  axios.$get(
    `${deepexiCloudTenant}/menus?code=digital-retail-console-menu&appId=${productId}`,
  )

export const findDrProduct = saasProduct => {
  return saasProduct.find(v => v.productName == 'DR')
}
