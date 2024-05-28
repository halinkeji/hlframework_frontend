<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="color_cinnabar q-mr-sm" />
        {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}扣费
      </div>

      <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
        <div class="row fit bg-white justify-around">
          <div class="col-12  col-md-4  q-px-xs q-pt-md">
            <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
          </div>
          <q-separator vertical inset />
          <q-form ref="submitFormRef" class="col-12  col-md-4  q-px-xs  q-pt-md">
            <q-card flat class="q-pa-md">
              <q-input
                class="text-h6"
                outlined
                bottom-slots
                v-model="deductAmount"
                :disable="!memberId"
                :rules="[(val) => (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) && !!val ? false : true || '请输入正确的金额')]"
              >
                <template v-slot:append>
                  <div class="q-pl-none">
                    {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                  </div>
                </template>
              </q-input>
              <q-input outlined rows="3" :disable="!memberId" dense bottom-slots label="备注" v-model="sc_note" type="textarea" class="q-mt-lg text-h6"> </q-input>
              <div class="q-pl-none text-subtitle1 text-right q-py-sm">
                <q-checkbox dense v-model="printInvoiceStatus" label="打印小票" color="blue-8" />
              </div>

              <q-separator />
              <q-card-section class="q-py-sm" v-if="fixedMoneyList.length > 0">
                <div class="row">
                  <div class="col-6 col-md-3 q-mt-md q-px-xs" v-for="item in fixedMoneyList">
                    <q-btn unelevated rounded color="green" class="q-px-md full-width" :disable="memberId == 0" @click="deductAmount = item.fm_parameter"> {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ item.fm_parameter }} </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>
      </div>
      <hl-local-printer ref="localPrinterRef" />
      <div class="col-shrink bg-white q-pb-md q-gutter-md text-center q-mt-xs">
        <q-btn unelevated color="amber-8" class="q-px-xl" size="lg" label="重置" :disable="memberId ? false : true" @click="refreshBut" icon="ion-refresh" />
        <q-btn unelevated class="q-px-xl bg_cinnabar text-white" size="lg" label="扣除" :disable="deductAmount ? false : true" @click="minusBut()" icon="las la-minus-circle" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      deductAmount: '',
      sc_note: '',
      buttonDisabled: false,
      printInvoiceStatus: true,
      memberId: 0,
      fixedMoneyList: []
    }
  },
  watch: {},
  mounted () {
    this.getFixedmoneyList()
  },
  created () {},
  computed: {},
  methods: {
    getFixedmoneyList () {
      const obj = {
        type: 4,
        page: 1,
        pSize: 200
      }
      this.$store
        .dispatch('fixed/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.fixedMoneyList = res.data.list
            } else {
              this.fixedMoneyList = []
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

    minusBut () {
      this.$refs.submitFormRef.validate().then((success) => {
        if (success) {
          this.buttonDisabled = true
          const obj = {
            member_id: this.memberId,
            printInvoiceStatus: this.printInvoiceStatus,
            sc_rechargePaymentCount: this.deductAmount,
            sc_note: this.sc_note
          }
          this.$store
            .dispatch('deductMoney/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '扣除成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right'
                })

                if (res.data && res.data.printTemplateData) {
                  this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
                }
                this.buttonDisabled = false
                this.refreshBut()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '扣除失败,' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit + '不足',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  position: 'top-right'
                })
                this.buttonDisabled = false
              }
            })
            .catch((error) => {
              this.buttonDisabled = false
            })
        }
      })
    },

    refreshBut () {
      this.deductAmount = ''
      this.sc_note = ''
      this.memberId = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
    }
  }
}
</script>
