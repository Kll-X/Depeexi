import axios from '@/services/apiClient'

export const setPayment = data => axios.$post(`/`, data)
