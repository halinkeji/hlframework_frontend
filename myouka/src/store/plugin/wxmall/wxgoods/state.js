export default function () {
  return {
    attributeDataList: [
      { label: '实物', value: 'goods' },
      { label: '服务', value: 'service' },
      { label: '商品套餐', value: 'package' },
      { label: '次卡', value: 'count' },
      { label: '时卡', value: 'time' },
      { label: '卡券', value: 'coupon' }
    ],
    attributeObject: {
      goods: '实物',
      service: '服务',
      package: '商品套餐',
      count: '次卡',
      time: '时卡',
      coupon: '卡券'
    }

  }
}
