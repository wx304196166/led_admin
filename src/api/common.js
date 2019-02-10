import request from '@/utils/request';

export function  queryAll(index) {
  return request({
    url: '/master/queryAll/' + index,
    method: 'get'
  })
}
export function  upload(index,data) {
  return request({
    url: '/common/upload/' + index,
    method: 'post',
    headers: {'content-type': 'multipart/form-data'},
    data
  })
}
