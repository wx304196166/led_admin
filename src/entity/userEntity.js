/**
 * Created by crit_space on 2018-12-28
 * 项目区间信息表 实体.
 */
const userInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 名称
    username: '',
    // 备注
    password: '',
    // 修改用户id
    modification_user_id: '',
    // 修改用户类型
    modification_user_type: ''

  },
  tableColumn: [{
      label: '账号',
      prop: 'username'
    },
    {
      label: '姓名',
      prop: 'real_name'
    },
    {
      label: '联系电话',
      prop: 'phone'
    },
    {
      label: '邮箱',
      prop: 'email'
    }
  ]
}
export default userInfo
