<template>
  <div>
    <q-btn color="red" unelevated label="积分记录" class="q-mx-xs" size="sm" @click="viewIntegral" />

    <q-btn color="orange" unelevated label="修改" size="sm" class="q-mx-xs" v-if="parseInt(params.data.psi_settle_status) == 1" @click="editFixedCost" />

    <q-btn color="primary" unelevated class="q-mx-xs" label="确认结算" size="sm" v-if="parseInt(params.data.psi_settle_status) == 1" @click="settlementRecord" />
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  data () {
    return {}
  },
  computed: {},
  components: {},
  created () {},
  mounted () {},
  methods: {
    viewIntegral () {
      this.params.context.viewIntegral(this.params.data.id)
    },
    settlementRecord () {
      const obj = {
        dayknot_id: this.params.data.id
      }

      this.$store
        .dispatch('shift/confirmSettle', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结班成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    editFixedCost () {
      this.$q
        .dialog({
          title: '确认更新固定成本金额?',
          message: '修改之后本次所有会员积分将会重新计算',
          prompt: {
            model: this.params.data.psi_give_integral,
            type: 'text', // optional
            isValid: (val) => /^(\d+|\d+\.\d{1,2})$/.test(val)
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          const obj = {
            dayknot_id: this.params.data.id,
            psi_fixed_costs: data
          }
          this.$store
            .dispatch('shift/saveDayknotRecord', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '更改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        })
        .onCancel(() => {})
    }
  }
}
</script>
