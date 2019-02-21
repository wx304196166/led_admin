const maintenanceInfo = {
  model: {
    // UUID：自动生成
    id: '',
    product_id: '',
    sn: '',
    contract: '',
    purchase_date: '',
    warranty_date: '',
    warranty_period: '',
    modification_user_id: '',
    modification_user_type: 0
  },
  tableColumn: [{
      label: 'SN 号码',
      prop: 'sn'
    },
    {
      label: '产品名称',
      prop: 'product_id',
      hasMap: true
    },
    {
      label: '合同编号',
      prop: 'contract'
    },
    {
      label: '购买日期',
      prop: 'purchase_date'
    },
    {
      label: '质保日期',
      prop: 'warranty_date'
    },
    {
      label: '质保期限',
      prop: 'warranty_period'
    }
  ]
}
export default maintenanceInfo
