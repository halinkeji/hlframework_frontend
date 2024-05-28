<template>
  <div class="q-gutter-xs">
    <q-btn color="primary" v-if="parseInt(params.data.pdw_status) == 1" unelevated label="打款" @click="remitPay" />

    <q-btn color="positive" v-if="parseInt(params.data.pdw_status) == 1" unelevated label="拒绝" @click="refuseApply" />
  </div>
</template>

<script>
export default {
  name: 'WithdrawOperator',
  components: {},
  data () {
    return {
      dataId: 0,
      qrcodeDialog: false,
      wxappQrcodeUrl: '',
      withdrawSetStatus: false,
      mechantWithdrawDialogStatus: false
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    remitPay () {
      this.$q
        .dialog({
          title: '确认',
          message: '成功将提现金额打款至提现商户？',
          cancel: true
        })
        .onOk(() => {
          this.saveWithdrawData({
            invoice_id: this.dataId,
            pdw_status: 3,
            pdw_complete_time: this.$q_date.formatDate(new Date(), 'X')
          })
        })
        .onCancel(() => {})
    },

    refuseApply () {
      this.$q
        .dialog({
          title: '拒绝',
          message: '请输入拒绝提现原因',
          cancel: true,
          prompt: {
            model: '',
            type: 'textarea' // optional
          }
        })
        .onOk((data) => {
          this.saveWithdrawData({
            invoice_id: this.dataId,
            pdw_status: 2,
            pdw_refuse_reason: data,
            pdw_error_time: this.$q_date.formatDate(new Date(), 'X')
          })
        })
        .onCancel(() => {})
    },

    saveWithdrawData (obj) {
      this.$store
        .dispatch('financeManage/updateMechantWithdrawData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新提现单据成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.params.context.getList()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red'
          })
        })
    }

  }
}
</script>
