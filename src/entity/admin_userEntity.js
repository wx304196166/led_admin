/**
 * Created by crit_space on 2018-12-28
 * 项目区间信息表 实体.
 */
const adminUserInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 名称
    username: '',
    // 备注
    password: '',
    // 修改用户id
    modification_user_type: '',
    // 修改用户类型
    modification_user_id: ''
  },
  tableColumn: [{
      label: '用户名',
      prop: 'username'
    }
  ]
}
export default adminUserInfo
