import request from '@/utils/request';
const index = 'classification';

const classificationApi = {
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
    })
  }

}

export default classificationApi;
