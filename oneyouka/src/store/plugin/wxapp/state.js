export default function () {
  return {
    companyCodeTypeObject: {
      1: '统一社会信用代码',
      2: '组织机构代码',
      3: '营业执照注册号'
    },
    companyCodeTypeData: [
      {
        label: '统一社会信用代码',
        value: '1'
      },
      {
        label: '组织机构代码',
        value: '2'
      },
      {
        label: '营业执照注册号',
        value: '3'
      }
    ],
    companyStatusObject: {
      1: '提交申请',
      2: '申请成功',
      3: '申请失败'
    }
  }
}
