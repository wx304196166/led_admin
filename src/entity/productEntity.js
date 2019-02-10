const userInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 产品名称
    name: '',
    // 所属分类
    classification_id: '',
    // 所属品牌
    brand_id: '',
    // 所属标签
    label_id: '',
    // 是否主产品
    is_main: 0,
    // 产品介绍
    intro: '',
    // 规格
    specifications: '',
    // 图片列表
    img_list: [],
    // 缩略图
    thumbnail: '',
    // 关联产品列表
    product_id: [],
    // 产品详情（富文本）
    detail:'',
    // 修改用户id
    modification_user_id: '',
    // 修改用户类型
    modification_user_type: 0

  },
  tableColumn: [{
      label: '产品名称',
      prop: 'name'
    },
    {
      label: '所属分类',
      prop: 'classification_id'
    },
    {
      label: '所属品牌',
      prop: 'brand_id'
    },
    {
      label: '所属标签',
      prop: 'label_id'
    },
    {
      label: '是否主产品',
      prop: 'is_main'
    },    
    {
      label: '规格',
      prop: 'specifications'
    }    
  ]
}
export default userInfo
