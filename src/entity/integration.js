const IngrationInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 名称
    name: '',
    main_id: '',
    main_specification: '',
    main_level: '',
    main_vertical: '',
    // 修改用户id
    modification_user_id: '',
    // 修改用户类型
    modification_user_type: 0
  },
  tableColumn: [{
      label: '标签名称',
      prop: 'name'
    },
    {
      label: '主产品id',
      prop: 'main_id'
    },
    {
      label: '规格',
      prop: 'main_specification'
    },
    {
      label: '水平个数',
      prop: 'main_level'
    },
    {
      label: '垂直个数',
      prop: 'main_vertical'
    }
  ]
};
export default IngrationInfo;
