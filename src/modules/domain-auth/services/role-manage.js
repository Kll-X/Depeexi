import axios from '@/services/apiClient'
const context = '/deepexi-system-digital-retail'
const version = '/api/v1'
const baseUrl = context + version

/**
 * 查询角色列表
 */
export const roleListUrl = `${baseUrl}/roles`

/**
 * 修改角色状态（待定）
 */
export const changeUserStatus = data => axios.$post(`/`, data)

/**
 * 删除角色
 * @param {*} id 角色id
 */
export const deleteRole = id => axios.$delete(`${baseUrl}/roles/${id}`)

/**
 * 新增角色
 */
export const newRole = data => axios.$post(`${baseUrl}/roles`, data)

/**
 * 编辑角色
 */
export const editRole = (id, data) => axios.$put(`${baseUrl}/roles/${id}`, data)

/**
 * 获取角色详情
 * @param {string} id
 */
export const getRoleDetail = id => axios.$get(`${baseUrl}/roles/${id}`)

/**
 * 查询当前角色的菜单树
 * @params roleID 角色id
 * @params functionID 菜单树的功能组id
 */
export const getPermissionTree = (roleId, functionGroupId) =>
  axios.$get(
    `${baseUrl}/rolePermissions/roles/${roleId}/functionGroups/${functionGroupId}/elements`,
  )

/**
 * 获取所有的功能组
 */
export const getAllFunctionGroups = () =>
  axios.$get(`${baseUrl}/functionGroups`)

/**
 * 保存角色选中的菜单权限
 */
export const saveRolePermission = (roleId, functionGroupId, body) =>
  axios.$put(
    `${baseUrl}/rolePermissions/roles/${roleId}/functionGroups/${functionGroupId}/elements`,
    body,
  )
