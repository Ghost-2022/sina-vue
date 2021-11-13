import request from '@/utils/axiosReq'

export function loginReq(data) {
  return request({
    url: '/api/v1/get-token',
    data: data,
    method: 'post',
    // bfLoading: false,
    // isParams: true
    isAlertErrorMsg: true
  })
}

export function getQRCordUrl() {
  return request({
    url: '/api/v1/qr-cord-url',
    method: 'get'
  })
}

export function checkSinaLoginStatus() {
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
