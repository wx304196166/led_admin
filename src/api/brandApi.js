import request from '@/utils/request'
const index = 'brand'
/**
 * Created by crit_space on 2018-12-28
 * 项目区间信息表前端api请求接口层.
 */
const brandApi = {
  // 分页查询数据
  queryPageList: function (data) {
    return request({
      url: '/master/queryPageList/' + index,
      method: 'post',
      data
    })
  },
  // 新增数据
  create: function (data) {
    return request({
      url: '/master/create/' + index,
      method: 'post',
      data
    })
  },
  // 更新数据
  update: function (data) {
    return request({
      url: '/master/update/' + index,
      method: 'post',
      data
    })
  },
  
  // 批量删除
  batchDelete: function (data) {
    return request({
      url: '/master/batchDelete/' + index,
      method: 'delete',
      data
    })
  }

}

export default brandApi
