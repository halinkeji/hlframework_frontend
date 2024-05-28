export default function () {
  return {

    periodTimeData: [
      {
        label: '年',
        value: '1'
      },
      // {
      //   label: '季度', //
      //   value: '2'
      // },
      {
        label: '月', //
        value: '3'
      },
      // {
      //   label: '周',
      //   value: '3'
      // },
      {
        label: '天',
        value: '3'
      }
    ],
    periodTimeObject: {
      1: '年',
      // 2: '季度',
      2: '月',
      // 3: '周',
      3: '天'
    },
    interestTypeObject: {
      1: '固定额度',
      2: '比例额度'
    },
    interestTypeData: [
      {
        label: '固定额度',
        value: '1'
      },
      {
        label: '比例额度',
        value: '2'
      }

    ],
    operateTypeObject: {
      1: '首存',
      2: '产生利息',
      3: '取出利息',
      4: '取出首存'
    }
  }
}
