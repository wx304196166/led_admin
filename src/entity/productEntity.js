/**
 * Created by crit_space on 2018-12-28
 * 项目区间信息表 实体.
 */
const userInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 所属分类
    classification_id: '',
    // 所属品牌
    brand_id: '',
    // 所属标签
    label_id: '',
    // 产品介绍
    intro: '',
    // 规格
    specifications: [],
    // 图片列表
    img_list: [],
    // 缩略图
    thumbnail: '',
    // 关联产品列表
    related_product_list:[],
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
