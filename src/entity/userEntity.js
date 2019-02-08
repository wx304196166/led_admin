const userInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 名称
    username: '',
    // 密码
    password: '',
    // 修改用户id
    modification_user_id: '',
    // 修改用户类型
    modification_user_type: 0

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
