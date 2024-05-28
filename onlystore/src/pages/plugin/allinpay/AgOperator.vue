<template>
  <div>
    <q-btn color="primary" class="q-mt-sm q-mx-sm" unelevated label="提现" @click="clickWithdraw" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    clickWithdraw () {
      this.$q
        .dialog({
          title: '提现操作',
          message: '请输入提现金额，提现金额不能大于可提现金额',
          prompt: {
            model: '',
            type: 'text'
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          this.$store
            .dispatch('allinpay/withdrawOperate', {
              ...this.params.data,
              amount: data
            })
            .then((res) => {
              if (res.code == 200) {
                if (res.data && res.data.subCode == 'OK') {
                  this.$q.notify({
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    message: '成功',
                    caption: res.data.subMsg,
                    color: 'green'
                  })
                } else {
                  this.$q.notify({
                    message: '失败',
                    caption: res.data.subMsg,
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'red'
                  })
                }
              }
            })
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    }
  }
}
</script>
