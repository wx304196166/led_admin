import request from '@/utils/request'

export function  queryAll(index) {
  return request({
    url: '/master/queryAll/' + index,
    method: 'get'
  })
}
