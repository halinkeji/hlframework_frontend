<template>
  <div>
    <q-btn v-if="parseInt(params.data.wod_status) == 8 || parseInt(params.data.wod_status) == 9" @click="agreeBackOrder" unelevated  color="positive" class="q-mr-md">同意退货 </q-btn>
    <q-btn v-if="parseInt(params.data.wod_status) == 8 || parseInt(params.data.wod_status) == 9" @click="refuseBackOrder" unelevated  color="negative" class="q-mr-md">拒绝退货 </q-btn>
    <q-btn v-if="parseInt(params.data.wod_status) == 12" @click="confirmBackOrder" unelevated  color="positive" class="q-mr-md">确认退款 </q-btn>
    <q-btn unelevated color="amber-6"  @click="viewOrderDetail">查看详情 </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      code: false,
      popUp: false,
      pickupCode: '',

      deliverData: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {

    viewOrderDetail () {
      this.params.context.viewOrderDetail(this.params.data.ob_order_detail_id)
    },

    agreeBackOrder () {
      this.$q
        .dialog({
          title: '同意退单申请？',
          message: `将单据号为${this.params.data.orderInfo.wo_order}的订单`,
          cancel: true
        })
        .onOk(() => {
          const obj = {
            order_id: this.params.data.ob_order_detail_id
          }
          this.$store
            .dispatch('wxMallOrder/agreeBackOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '同意退单成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getOrder()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.msg,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
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
        })
        .onCancel(() => {})
    },

    refuseBackOrder () {
      this.$q
        .dialog({
          title: '拒绝退单申请？',
          message: `将单据号为${this.params.data.orderInfo.wo_order}的订单`,
          cancel: true
        })
        .onOk(() => {
          const obj = {
            order_id: this.params.data.ob_order_detail_id
          }
          this.$store
            .dispatch('wxMallOrder/refuseBackOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '拒绝退单申请成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getOrder()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.msg,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
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
        })
        .onCancel(() => {})
    },

    confirmBackOrder () {
      this.$q
        .dialog({
          title: '确认退单？',
          message: `将单据号为${this.params.data.orderInfo.wo_order}的订单`,
          cancel: true
        })
        .onOk(() => {
          const obj = {
            order_id: this.params.data.ob_order_detail_id
          }
          this.$store
            .dispatch('wxMallOrder/confirmBackOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '确认退单成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getOrder()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.msg,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
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
        })
        .onCancel(() => {})
    }

  }
}
</script>

<style></style>
