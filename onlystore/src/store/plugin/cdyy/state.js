export default function () {
  return {
    couponTypeObject: {
      1: '全免',
      2: '免时',
      3: '免钱',
      4: '多次全免'
    },
    couponTypeData: [
      {
        label: '全免',
        value: '1'
      },
      {
        label: '免时',
        value: '2'
      },
      {
        label: '免钱',
        value: '3'
      },
      {
        label: '多次全免',
        value: '4'
      }

    ],

    attributeTypeObject: {
      1: '卡密营销',
      2: '消费满额营销',
      3: '充值满额营销',
      4: '会员升级',
      5: '积分兑换'
    },
    attributeTypeData: [
      {
        label: '卡密营销',
        value: '1'
      },
      {
        label: '消费满额营销',
        value: '2'
      },
      {
        label: '充值满额营销',
        value: '3'
      },
      {
        label: '会员升级',
        value: '4'
      },
      {
        label: '积分兑换',
        value: '5'
      }

    ],
    limitOptions: [

      {
        label: '相对时间',
        value: '1'
      },
      {
        label: '指定时间',
        value: '2'
      }
    ],
    roleOptions: {
      1: '年',
      2: '季度',
      3: '月',
      4: '周',
      5: '天',
      6: '小时'
    },
    timeOptions: [
      {
        value: '1',
        label: '年'
      },
      {
        value: '2',
        label: '季度'
      },
      {
        value: '3',
        label: '月'
      },
      {
        value: '4',
        label: '周'
      },
      {
        value: '5',
        label: '天'
      },
      {
        value: '6',
        label: '小时'
      }
    ]
  }
}
