<template>
  <q-dialog @hide="hideDetailDialog" v-model="detailDialogStatus">
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.2 + 'px',
        'min-width': $q.screen.width * 0.2 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="row col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs q-pa-sm">
          <div class="text-subtitle2">订单详情</div>
          <q-space />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-form ref="orderFormRef">
            <q-input outlined dense v-model="orderForm.jo_wuliu_order" :rules="[val => !!val || '请输入物流单号']" label="物流单号" />
            <q-select
              outlined
              dense
              option-value="value"
              option-label="label"
              emit-value
              map-options
              bottom-slots
              v-model="orderForm.jo_wuliu_company"
              :options="$store.state.jfOrder.wuliuCompanyOptions"
              label="选择物流公司"
              :rules="[val => !!val || '请选择物流公司']"
            />
          </q-form>
        </div>
        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
          <q-btn class="q-px-xl" unelevated label="保存" @click="updateState" color="primary" />
          <q-btn class="q-px-xl" unelevated label="关闭" @click="hideDetailDialog" color="grey" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DeliverGoods',
  data () {
    return {
      orderData: {},
      deliceryman: {},
      step: 0,
      orderStatusObject: {},
      detailDialogStatus: false,
      orderForm: {
        jo_wuliu_order: '',
        jo_wuliu_company: ''
      }

    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    hideDetailDialog () {
      this.detailDialogStatus = false
      this.$emit('operateSuccess')
    },
    getItem (orderId) {
      this.detailDialogStatus = true
      this.$store
        .dispatch('jfOrder/getItem', orderId)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.orderData = res.data
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    updateState () {
      this.$refs.orderFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            order_id: this.orderData.id,
            ...this.orderForm,
            jo_state: 4
          }
          this.$store
            .dispatch('jfOrder/confirmOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '确认订单成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })

                this.hideDetailDialog()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },
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
