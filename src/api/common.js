import request from '@/utils/request';

export function queryNumber(data) {
  return request({
    url: '/master/queryNumber',
    method: 'post',
    data
  })
}
export function queryAllByList(data) {
  return request({
    url: '/common/queryAllByList',
    method: 'post',
    data
  })
}
export function queryAll(index) {
  return request({
    url: '/master/queryAll/' + index,
    method: 'get'
  })
}
export function queryMany(index, ids, range) {
  return request({
    url: '/master/queryMany/' + index,
    method: 'post',
    data: {
      ids,
      range
    }
  })
}
export function upload(index, data) {
  return request({
    url: '/common/upload/' + index,
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data
  })
}
