import request from '@/utils/request';
const index = 'integrate';
/**
 * Created by crit_space on 2018-12-28
 * 项目区间信息表前端api请求接口层.
 */
const integrationApi = {
  // 分页查询数据
  queryPageList(data) {
    return request({
      url: '/api/v1/master/queryPageList/' + index,
      method: 'post',
      data
    });
  },
  // 新增数据
  create(data) {
    return request({
      url: '/api/v1/master/create/' + index,
      method: 'post',
      data
    });
  },
  // 更新数据
  update(data) {
    return request({
      url: '/api/v1/master/update/' + index,
      method: 'post',
      data
    });
  },
  
  // 批量删除
  batchDelete(data) {
    return request({
      url: '/api/v1/master/batchDelete/' + index,
      method: 'delete',
      data
    });
  }

};

export default integrationApi;
