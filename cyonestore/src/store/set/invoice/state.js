export default function () {
  return {
    payStatusData: [
      { value: 4, text: '未支付' },
      { value: 1, text: '支付成功' },
      { value: 2, text: '支付失败' },
      { value: 3, text: '退款成功' }
    ],
    consumePayType: [
      { value: '储值支付', text: '储值支付' },
      { value: '积分支付', text: '积分支付' },
      { value: '银行卡支付', text: '银行卡支付' },
      { value: '(刷卡)微信支付', text: '(刷卡)微信支付' },
      { value: '(刷卡)支付宝支付', text: '(刷卡)支付宝支付' },
      { value: '个人微信支付', text: '个人微信支付' },
      { value: '个人支付宝支付', text: '个人支付宝支付' },
      { value: '现金支付', text: '现金支付' },
      { value: '其他支付', text: '其他支付' }
    ],
    consumeTypeData: [
      { value: 'consume', label: '消费收银' },
      { value: 'quickConsume', label: '快速消费' },
      { value: 'consumeorder', label: '堂食点单' },
      { value: 'fastFood', label: '快餐' },
      { value: 'rechargeMoney', label: '会员充值' }
    ],
    returnStatusData: [
      { value: 1, text: '按原路退回' },
      { value: 2, text: '余额--退款', rechargeMoney: true },
      { value: 3, text: '现金--退款' },
      // { value: 4, text: '微信--退款' },
      // { value: 5, text: '支付宝-退款' },
      { value: 6, text: '银行卡-退款' },
      { value: 7, text: '其他--退款' }
    ],
    returnData: [
      { value: 2, text: '余额--退款' },
      { value: 3, text: '现金--退款' },
      // { value: 4, text: '微信--退款' },
      // { value: 5, text: '支付宝-退款' },
      { value: 6, text: '银行卡-退款' },
      { value: 7, text: '其他--退款' }
    ]
  }
}
