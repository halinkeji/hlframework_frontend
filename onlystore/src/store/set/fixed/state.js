import { LocalStorage } from 'quasar'

const storeLocal = LocalStorage.getItem('onlystore_store_local')
let storeBaseConfig = {}
if (storeLocal && storeLocal.storeBaseConfig) {
  storeBaseConfig = storeLocal.storeBaseConfig
}

export default function () {
  return {
    typeDataList: [
      {
        label: '增加/扣除' + storeBaseConfig.consume_base_integralUnit,
        value: '1'
      },
      {
        label: '快速消费',
        value: '2'
      },
      {
        label: '会员充值',
        value: '3'
      },
      {
        label: storeBaseConfig.consume_base_balanceUnit + '扣费',
        value: '4'
      },
      {
        label: '收款码',
        value: '7'
      }
    ],
    typeDataItem: {
      1: '增加/扣除' + storeBaseConfig.consume_base_integralUnit,
      2: '快速消费',
      3: '会员充值',
      4: storeBaseConfig.consume_base_balanceUnit + '扣费',
      7: '收款码'
    }

  }
}
