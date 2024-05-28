<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        快速消费
      </div>
      <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
        <div class="row fit bg-white justify-around">
          <div class="col-12  col-md-4 q-px-xs q-pt-md text-center">
            <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
          </div>
          <q-separator vertical inset />
          <q-form ref="submitFormRef" class="col-12  col-md-4 text-center q-px-xs  q-pt-md">
            <q-card square flat class="full-width">
              <q-card-section class="q-py-sm">
                <q-input
                  outlined
                  bottom-slots
                  v-model="consumeAmount"
                  lazy-rules
                  class="text-h6 full-width"
                  :rules="[(val) => !!val || '请填写消费金额', (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的金额']"
                >
                  <template v-slot:append>
                    <div class="q-pl-none">
                      {{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneySymbol }}
                    </div>
                  </template>
                </q-input>
              </q-card-section>
              <q-separator inset />
              <div class="row">
                <div class="col-6 col-md-3 q-mt-md q-px-xs" v-for="(item, key) in fixedMoneyList">
                  <q-btn unelevated rounded color="green" @click="consumeAmount = item.fm_parameter" class="q-px-md full-width">
                    {{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ item.fm_parameter }}
                  </q-btn>
                </div>
              </div>
            </q-card>
          </q-form>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md q-gutter-md  q-mt-xs text-center">
        <q-btn unelevated color="amber-8" class="q-px-xl" label="重置" @click="refreshBut()" size="lg" />
        <q-btn unelevated color="blue-6" class="q-px-xl" label="结账" :disable="consumeAmount > 0 ? false : true" size="lg" @click="checkoutWindow()" />
      </div>
    </div>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout @closeCheckoutPopup="closeCheckoutPopup" @paySuccessCallBack="paySuccessCallBack" ref="openCheckoutCounterPage" v-if="openCheckoutPageIf"></hl-checkout>
  </q-page>
</template>
<script>
import keyboardJS from 'keyboardJS'
export default {
  name: 'quickconsume',
  components: {},
  data () {
    return {
      consumeAmount: '',
      memberId: 0,
      openCheckoutPageIf: false,
      fixedMoneyList: [],
      buttonDisabled: false
    }
  },
  watch: {},
  mounted () {
    this.getFixedmoneyList()
  },
  created () {
    keyboardJS.bind('space', (e) => {
      if (this.consumeAmount > 0) {
        this.checkoutWindow()
      }
    })
    keyboardJS.bind('alt + r', (e) => {
      this.refreshBut()
    })
  },
  computed: {},
  methods: {
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },

    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },
    // 获取固定金额列表
    getFixedmoneyList () {
      const obj = {
        type: 2,
        page: 1,
        pSize: 10
      }
      this.$store
        .dispatch('fixed/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.fixedMoneyList = res.data.list
            }
          }
        })
        .catch((error) => {})
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
        }
      }
    },
    // 重置
    refreshBut () {
      this.consumeAmount = ''
      this.memberId = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
    },
    paySuccessCallBack (v) {
      this.openCheckoutPageIf = false
      this.$store
        .dispatch('quickConsume/quickSetData', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '快速消费结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.refreshBut()
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '结账错误',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },
    checkoutWindow () {
      this.$refs.submitFormRef.validate().then((success) => {
        if (success) {
          this.openCheckoutPageIf = true
          const amountsPayable = this.consumeAmount
          const return_param = {
            currentMemberId: this.memberId,
            consumeAmount: this.consumeAmount
          }
          this.$nextTick(() => {
            this.$refs.openCheckoutCounterPage.checkoutPageReceive('quickConsume', amountsPayable, parseInt(this.memberId), return_param)
          })
        }
      })
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
