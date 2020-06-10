import axios from './apiClient'

export const getMenuList = () => {
  return axios.get('http://39.100.141.76:3000/mock/679/deepexi-system-digital-retail/menus')
}
