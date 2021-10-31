import request from '@/utils/axiosReq'

export function loginReq() {
  return request({
    url: '/api/v1/sina-index',
    method: 'GET',
    // bfLoading: false,
    // isParams: true
    isAlertErrorMsg: true
  })
}

export function checkLoginStatus() {
  return request({
    url: '/api/v1/check-login',
    bfLoading: false,
    method: 'get'
  })
}

export function logoutReq() {
  return request({
    url: '/ty-user/user/loginOut',
    method: 'post'
  })
}
