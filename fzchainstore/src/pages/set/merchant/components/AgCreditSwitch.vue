<template>
  <div v-if="params.data.storeCredit">
    <q-toggle
      v-model="params.data.storeCredit.csc_credit_switch"
      :true-value="'1'"
      :false-value="'0'"
      @input="statusBut()"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: 'AgCreditSwitch',
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    // 修改状态
    statusBut () {
      const obj = {
        id: this.params.data.storeCredit.id,
        csc_credit_switch: this.params.data.storeCredit.csc_credit_switch
      }
      this.$store
        .dispatch('storeCredit/addData', obj)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getList()
            }, 100)
          }
        })
        .catch(error => {})
    }
  }
}
</script>
