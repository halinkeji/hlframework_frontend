<template>
  <q-dialog @hide="hideNowPage" v-model="singleReturnDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-sm "
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ goo_name }}单品退货</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="singleReturnDialog = false" />
      </q-card-section>

      <q-form ref="singleReturnRef" class="q-gutter-md">
        <div class="q-my-lg">
          <q-input
            outlined
            dense
            class="q-pa-none q-mx-lg q-mb-lg"
            label="退货数量"
            :rules="[
              (val) => !!val || '必填项',
              (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的退货数量',
            ]"
            @input="changeNumber"
            v-model="rgd_return_quantity"
          />

          <q-input
            outlined
            dense
            class="q-pa-none q-mx-lg q-mb-lg"
            label=" 退款金额"
            :rules="[
              (val) => !!val || '必填项',
              (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的退款金额',
            ]"
            v-model="rgd_return_amount"
          />

          <q-input outlined dense stack-label class="q-pa-none q-mx-lg q-mb-lg" v-model="returnPoint" disable :label="`扣除${$q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit}`" />
          <q-input outlined dense stack-label disable class="q-pa-none q-mx-lg q-mb-lg" v-model="returnTime" label="退货时间" />
          <q-select
            dense
            outlined
            stack-label
            class="q-pa-none q-mx-lg q-mb-lg"
            v-model="returnMode"
            :options="returnStatusData"
            option-value="value"
            option-label="text"
            label="退款方式"
            emit-value
            map-options
          />

          <q-input outlined type="textarea" dense class="q-pa-none q-mx-lg q-mb-lg" :rows="2" v-model="rgd_remarks" label="说明" />
        </div>
      </q-form>
      <q-card-actions align="right" class="text-primary">
        <q-checkbox dense v-model="printInvoiceStatus" label="打印小票" color="blue-8" />
        <q-btn color="primary" text-color="white" label="退货" class="q-px-sm q-ml-sm" @click="setReturnData" unelevated />
        <q-btn color="grey" text-color="white" label="关闭" class="q-px-sm" @click="hideNowPage" v-close-popup unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SingleReturn',
  components: {},
  data () {
    return {
      singleReturnDialog: false,
      consumeData: {},
      rgd_remarks: '',
      returnTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      returnPoint: 0,
      rgd_return_quantity: 0,
      totalNember: '',
      returnMode: 2,
      rgd_return_amount: '',
      saveStopData: false,
      printInvoiceStatus: false,
      goo_name: '',
      returnStatusData: this.$store.state.invoice.returnData
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (data, member_id) {
      this.singleReturnDialog = true
      this.consumeData = data
      this.member_id = member_id

      if (this.consumeData.cid_goodsOrService == 3) {
        this.goo_name = this.consumeData.cid_packageName
        this.totalNember =
          this.formatAmount(this.consumeData.cid_consumeNumber / this.consumeData.cid_package_number) -
          this.formatAmount(this.consumeData.alreadyReturnNumber / this.consumeData.cid_package_number)
        this.rgd_return_quantity = this.totalNember
        this.rgd_return_amount = this.formatAmount(this.totalNember * this.consumeData.cid_sellingPrice)
      } else {
        this.goo_name = this.consumeData.cid_goo_name
        this.totalNember = this.formatAmount(this.consumeData.cid_consumeNumber) - this.formatAmount(this.consumeData.alreadyReturnNumber)

        this.rgd_return_quantity = this.totalNember
        this.rgd_return_amount = this.formatAmount(this.totalNember * this.consumeData.cid_sellingPrice)
      }
    },
    changeNumber (val) {
      if (val > this.totalNember) {
        this.rgd_return_quantity = this.totalNember
      }
      this.rgd_return_amount = this.formatAmount(this.consumeData.cid_sellingPrice * this.rgd_return_quantity)
    },
    setReturnData () {
      this.$refs.singleReturnRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '确定',
              message: '确定进行退货吗？',
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              if (this.returnMode == 2) {
                if (parseInt(this.member_id) < 1) {
                  this.$q.notify({
                    message: '退货失败',
                    caption: '原因：非会员不能退款到' + this.$q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
                    color: 'red',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                  return false
                }
              }
              this.saveStopData = true
              const obj = {
                member_id: this.member_id,
                rgd_remarks: this.rgd_remarks,
                consumeData: this.consumeData,
                returnMode: this.returnMode,
                rgd_return_quantity: this.rgd_return_quantity,
                rgd_return_amount: this.rgd_return_amount,
                printInvoiceStatus: this.printInvoiceStatus
              }

              this.$store
                .dispatch('returnGoods/setSingleData', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      message: '成功',
                      caption: '退货成功',
                      icon: 'ion-checkmark-circle-outline',
                      color: 'green',
                      timeout: 500,
                      position: 'top-right'
                    })
                    this.$nextTick(() => {
                      this.hideNowPage()
                    })
                  }
                })
                .catch((error) => {
                  this.$q.notify({
                    message: '操作失败',
                    caption: error.message,
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'red'
                  })
                  this.saveStopData = false
                })
            })
        }
      })
    },

    hideNowPage () {
      this.singleReturnDialog = false
      this.$emit('getMethods', this.consumeData.consumeinvoice_id)
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
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
    }
  }
}
</script>
