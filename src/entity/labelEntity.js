/**
 * Created by crit_space on 2018-12-28
 * 项目区间信息表 实体.
 */
const labelInfo = {
  model: {
    // UUID：自动生成
    id: '',
    // 名称
    name: '',
    // 备注
    remark: '',
    // 修改用户id
    modification_user_id: '',
    // 修改用户类型
    modification_user_type: 0
  },
  tableColumn: [
    {
      label: '标签名称',
      prop: 'name'
    },
    {
      label: '备注信息',
      prop: 'remark'
    }
  ]
};
export default labelInfo;
