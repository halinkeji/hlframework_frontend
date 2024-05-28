<template>
  <div class="q-gutter-xs">
    <q-btn color="primary" v-if="parseInt(params.data.pmw_status) == 1" unelevated label="审核" @click="remitPay" />

    <q-btn color="positive" v-if="parseInt(params.data.pmw_status) == 1" unelevated label="拒绝" @click="refuseApply" />
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
          message: '当前单据已通过审核？',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('marketingManage/withdrawOrderCheck', {
              record_id: this.params.data.id
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '审核成功！',
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
            outlined: true,
            model: '',
            type: 'textarea' // optional
          }
        })
        .onOk((data) => {
          this.$store
            .dispatch('marketingManage/withdrawOrderRefuse', {
              record_id: this.params.data.id,
              refuse_reason: data
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '已拒绝当前订单',
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
        })
        .onCancel(() => {})
    },

    saveWithdrawData (obj) {
    }

  }
}
</script>
