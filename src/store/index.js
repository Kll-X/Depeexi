import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'
import {Notification} from 'element-ui'

import {
  login,
  getUserInfo,
  getOpenProducts,
  getUserPermission,
  findDrProduct,
} from '@/services/index'

const cookieDomain = process.env.COOKIE_DOMAIN
const cookiePath = process.env.COOKIE_PATH
const cookieParams = {
  path: cookiePath,
  domain: cookieDomain,
}

// 最好提前在你的 store 中初始化好所有所需属性
// https://vuex.vuejs.org/zh-cn/mutations.html

export const state = () => ({
  get token() {
    return cookie.get('token', cookieParams)
  },
  set token(value) {
    if (value) {
      cookie.set('token', value, cookieParams)
    } else {
      // 清空当前所有域名下的token
      cookie.remove('token', cookieParams)
      cookie.remove('token')
    }
  },
  meta: {},
  user: {},
  menuList: [],
  breadcrumbList: [],
  permission: {},
})

//  mutation 必须同步执行
export const mutations = {
  LOGIN(state, token) {
    state.token = token
  },
  LOGOUT(state) {
    state.token = ''
    window.location.reload()
  },
  SET_USER_INFO(state, userData) {
    state.user = userData
  },
  SET_MENU(state, menuList) {
    state.menuList = menuList
  },
  SET_BREADCRUMB(state, breadcrumbList) {
    state.breadcrumbList = breadcrumbList
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  },
}

// Action 提交的是 mutation，而不是直接变更状态
// Action 可以包含任意异步操作
export const actions = {
  async LOGIN({commit}, params) {
    try {
      const res = await login(params)
      const token = res.payload.token
      commit('LOGIN', token)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async GET_USER_INFO({state, commit}) {
    let res = await getUserInfo(state.token)
    let userInfo = {
      ...res.payload,
      ...res.payload.params,
    }
    // 登陆做了调整，appid暂时写死
    commit('SET_USER_INFO', userInfo)
  },
  async GET_USER_PERMISSION({state, commit}) {
    let res = await getOpenProducts()
    let saasProduct = res.payload.saas || []
    let DR = findDrProduct(saasProduct)

    if (DR) {
      const permission = await getUserPermission(DR.id)
      commit('SET_MENU', permission.payload)
      commit('SET_USER_INFO', {
        ...state.user,
        appId: DR.id,
      })
    } else {
      Notification.error({
        title: '提示',
        message: '获取用户权限菜单失败',
      })
    }
  },
}
