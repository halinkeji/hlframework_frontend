export default function () {
  return {
    attributeDataList: [
      { label: '实物', value: 'goods' },
      // { label: '服务', value: 'service' },
      // { label: '商品套餐', value: 'package' },
      // { label: '次卡', value: 'count' },
      // { label: '时卡', value: 'time' },
      { label: '卡券', value: 'coupon' }
    ],
    attributeObject: {
      goods: '实物',
      service: '服务',
      package: '商品套餐',
      count: '次卡',
      time: '时卡',
      coupon: '卡券'
    },
    topOptions: [
      {
        label: '精选置顶',
        value: '1'
      },
      {
        label: '热门活动',
        value: '2'
      },
      {
        label: '人气推荐',
        value: '3'
      },
      {
        label: '默认推荐',
        value: '4'
      }
    ],
    topObject: {
      1: '精选置顶',
      2: '热门活动',
      3: '人气推荐',
      4: '默认推荐'
    }
  }
}
