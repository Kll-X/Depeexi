import axios from '@/services/apiClient'
const context = '/deepexi-system-digital-retail'
const version = '/api/v1'
const baseUrl = context + version

/**
 * 查询用户列表
 */
export const userListUrl = `${baseUrl}/users`

/**
 * 新增角色
 */
export const newUser = data => axios.$post(`${baseUrl}/users`, data)

/**
 * 编辑角色
 */
export const editUser = (id, data) => axios.$put(`${baseUrl}/users/${id}`, data)

/**
 * 获取角色详情
 * @param {string} id
 */
export const getUserDetail = id => axios.$get(`${baseUrl}/users/${id}`)

/**
 * 修改用户状态
 * @params id 用户id
 * @params status 用户状态（1:启用，0:禁用）
 */
export const changeUserStatus = (id, status) =>
  axios.$put(`${baseUrl}/users/${id}/status`, {
    status,
  })

export const deleteUser = id => axios.$delete(`${baseUrl}/users/${id}`)

/**
 * 获取用户所绑定的角色
 * @params id 用户id
 */
export const getUserRoles = id => axios.$get(`${baseUrl}/users/${id}/roles`)

/*
 * 更新用户所绑定的角色
 * @params id 用户id
 */
export const updateUserRoles = (id, params) =>
  axios.$put(`${baseUrl}/users/${id}/roles`, params)
