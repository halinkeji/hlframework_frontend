export default function () {
  return {
    financeStatusData: [
      { value: 1, label: '平台收入' },
      { value: 2, label: '商家收入' }
    ],

    financeStatusItem: {
      1: '平台收入',
      2: '商家收入'
    },

    invoiceStatusItem: {
      payCouponMarket: '支付卡券推广费'
    },
    invoiceStatusData: [
      { value: 'payCouponMarket', label: '支付卡券推广费' }
    ],

    financeTypeData: [

      { value: 'couponBrokerage', label: '卡券推广佣金' },
      { value: 'chuzhizhifu', label: '储值支付使用' },
      { value: 'jifenzhifu', label: '积分支付使用' },
      { value: 'kaquanyouhui', label: '卡券优惠使用' },
      { value: 'xiaochengxuxiaofei', label: '小程序在线支付' },
      { value: 'marketRewardWithdraw', label: '推商收益提现' }
    ],

    financeTypeItem: {
      couponBrokerage: '卡券推广佣金',
      chuzhizhifu: '储值支付使用',
      jifenzhifu: '积分支付使用',
      kaquanyouhui: '卡券优惠使用',
      xiaochengxuxiaofei: '小程序在线支付',
      marketRewardWithdraw: '推商收益提现'
    },

    settleStatusData: [
      { value: 1, label: '未结算' },
      { value: 2, label: '已结算' },
      { value: 3, label: '提现中' },
      { value: 4, label: '失效' }
    ],

    settleStatusItem: {
      1: '未结算',
      2: '已结算',
      3: '提现中',
      4: '失效'
    },

    orderSettleStatusItem: {
      '-2': '订单超时',
      '-1': '未支付',
      1: '支付成功',
      2: '支付失败'
    },

    withdrawStatusItem: {
      1: '提交申请',
      2: '已拒绝',
      3: '提现成功'
    },

    withdrawStatusData: [
      { value: 1, label: '提交申请' },
      { value: 2, label: '已拒绝' },
      { value: 3, label: '提现成功' }
    ]

  }
}
