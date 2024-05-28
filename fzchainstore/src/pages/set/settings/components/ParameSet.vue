<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height ">
      <q-scroll-area class="fit full-height">
        <q-form ref="invoiceDataRef" class="q-gutter-md row">
          <q-card flat class="bg-white q-pa-md col-6">
            <q-list separator bordered padding>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit }}消费是否需要密码</q-item-label>
                  <q-item-label caption>默认关闭，开启后收银台{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit }}消费时需要密码进行验证</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(baseConfigData.consume_base_integralPayVerify, 'consume_base_integralPayVerify')"
                    v-model="baseConfigData.consume_base_integralPayVerify"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}消费是否需要密码</q-item-label>
                  <q-item-label caption>默认关闭，开启后收银台{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}消费时需要密码进行验证</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(baseConfigData.consume_base_balancePayVerify, 'consume_base_balancePayVerify')"
                    v-model="baseConfigData.consume_base_balancePayVerify"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}消费免密支付额度</q-item-label>
                  <q-item-label caption>默认‘0’，当时开启{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}消费使用密码时，判断使用金额是否免密</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_balanceNoSecret"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_balanceNoSecret, 'consume_base_balanceNoSecret')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <!-- <q-item>
                <q-item-section>
                  <q-item-label>计次功能相关单位</q-item-label>
                  <q-item-label caption>默认‘次’，开启后计次功能相关单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input outlined bottom-slots v-model="baseConfigData.consume_base_countUnit" dense @change="handleSwitchChange(baseConfigData.consume_base_countUnit, 'consume_base_countUnit')">
                  </q-input>
                </q-item-section>
              </q-item> -->

               <q-item>
                <q-item-section>
                  <q-item-label>积分单位</q-item-label>
                  <q-item-label caption>默认‘积分’，开启后积分单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input outlined bottom-slots v-model="baseConfigData.consume_base_integralUnit" dense @change="handleSwitchChange(baseConfigData.consume_base_integralUnit, 'consume_base_integralUnit')">
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>储值单位</q-item-label>
                  <q-item-label caption>默认‘储值’，开启后储值单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input outlined bottom-slots v-model="baseConfigData.consume_base_balanceUnit" dense @change="handleSwitchChange(baseConfigData.consume_base_balanceUnit, 'consume_base_balanceUnit')">
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>货币单位</q-item-label>
                  <q-item-label caption>默认‘元’，开启后所有货币单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input outlined bottom-slots v-model="baseConfigData.consume_base_moneyUnit" dense @change="handleSwitchChange(baseConfigData.consume_base_moneyUnit, 'consume_base_moneyUnit')">
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>货币单位符号</q-item-label>
                  <q-item-label caption>默认‘￥’，开启后所有货币单位符号会改为对应单位符号</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input outlined bottom-slots v-model="baseConfigData.consume_base_moneySymbol" dense @change="handleSwitchChange(baseConfigData.consume_base_moneySymbol, 'consume_base_moneySymbol')">
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>默认初始密码</q-item-label>
                  <q-item-label caption>默认‘888888’，开启后会员默认初始密码将会更新</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_memberCardPassword"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_memberCardPassword, 'consume_base_memberCardPassword')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
export default {
  name: 'invoiceSetDetails',
  data () {
    return {
      baseConfigData: {
        consume_base_countUnit: '次',
        consume_base_balanceUnit: '元',
        consume_base_integralUnit: '积分',
        consume_base_moneyUnit: '元',
        consume_base_moneySymbol: '￥',
        consume_base_memberCardPassword: '888888',
        consume_base_balancePayVerify: '0',
        consume_base_balanceNoSecret: '0',
        consume_base_integralPayVerify: '0'
      }
    }
  },
  components: {},
  mounted () {
    this.getConsumeSet()
  },

  computed: {},
  methods: {
    getConsumeSet () {
      const obj = {
        name: 'base'
      }
      this.$store
        .dispatch('settings/getConsumeSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.baseConfigData = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    handleSwitchChange (val, keyName) {
      const obj = {}
      obj[keyName] = val
      this.$store
        .dispatch('settings/addSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '添加成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getConsumeSet()
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
