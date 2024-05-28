export default function () {
  return {
    propertyData: [
      { value: 1, label: '免费领取' },
      { value: 2, label: '储值购买' },
      { value: 3, label: '积分兑换' },
      { value: 4, label: '主动购买' },
      { value: 5, label: '混合领取' },
      { value: 6, label: '其他属性' },
      { value: 7, label: '主动群发' },
      { value: 8, label: '共享平台推广' }
    ],
    typeData: [
      { value: 1, label: '折扣券' },
      { value: 2, label: '代金券' },
      { value: 3, label: '礼品券' },
      { value: 4, label: '团购券' },
      { value: 5, label: '优惠券' },
      { value: 6, label: '积分券' },
      { value: 7, label: '储值券' }
    ],
    propertyItem: {
      1: '免费领取',
      2: '储值购买',
      3: '积分兑换',
      4: '主动购买',
      5: '混合领取',
      6: '其他属性',
      7: '主动群发',
      8: '共享平台推广'
    },
    typeItem: {
      1: '折扣券',
      2: '代金券',
      3: '礼品券',
      4: '团购券',
      5: '优惠券',
      6: '积分券',
      7: '储值券'
    },
    marketStatusItem: {
      1: '创建中',
      2: '待审核',
      3: '推广中',
      4: '已结束'
    },

    statusItem: {
      1: '上架',
      2: '下架'
    }
  }
}
