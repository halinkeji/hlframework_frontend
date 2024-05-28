<template>
  <div>
    <q-btn color="orange" class="q-mx-sm" unelevated label="确认订单" @click="sendStatus" v-if="this.params.data.pbo_send_status == -1 && authorityMeta('check') " />
    <q-btn class=" q-ma-xs" color="primary" unelevated label="查看详情" @click="viewBut" />
  </div>
</template>

<script>
export default {
  name: 'AgDetailOperator',
  components: {},
  data () {
    return {
      invoiceId: ''
    }
  },
  mounted () {},
  created () {
    this.invoiceId = this.params.data.id
  },
  computed: {},
  methods: {
    //  查看详情
    viewBut () {
      this.params.context.viewBut(this.params.data.id)
    },
    sendStatus () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确认订单',
          cancel: true
        })
        .onOk(() => {
          const params = [this.invoiceId]
          this.$store
            .dispatch('bmtk/sendStatus', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '确认订单成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map(obj => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
