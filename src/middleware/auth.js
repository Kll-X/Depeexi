/*
 * @Author: Han
 * @Date: 2019-05-08 14:32:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-13 19:58:46
 * @Description 路由鉴权中间件，实现其他路由守卫功能请新建一个中间件
 *
 * **********************************************************
 * * @Strong 这是一个路由中间件，请不要在 serverMiddleware 中使用 *
 * **********************************************************
 */

import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'

const LOGIN_PATH = '/login'
// 路由白名单，直接绕过路由守卫
const whiteList = [LOGIN_PATH]

export default async ({store, redirect, env, route}) => {
  if (process.server) return

  const {NO_LOGIN} = env
  const {path} = route

  // 开发时可以用 NO_LOGIN 跳过路由鉴权
  if (NO_LOGIN > 0) return

  // 鉴权白名单
  if (whiteList.indexOf(path) > -1) return

  if (!store.state.token) {
    redirect('/login')
    return
  }

  // 如有没有用户信息，则先重新获取
  if (store.state.token && !store.state.user.id) {
    try {
      await store.dispatch('GET_USER_INFO')
      await store.dispatch('GET_USER_PERMISSION')
    } catch (e) {}
  }
}
