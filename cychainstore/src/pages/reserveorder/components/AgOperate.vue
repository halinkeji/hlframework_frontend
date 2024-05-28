<template>
  <div class="q-gutter-sm">
    <q-btn unelevated color="primary" label="接单" @click="setRecordAllow" v-if="parseInt(params.data.drr_status)  == 1" />
    <q-btn unelevated color="deep-orange" label="完成" @click="setRecordComplete" v-else-if="parseInt(params.data.drr_status) == 2" />
    <q-btn unelevated color="red" label="撤单" @click="setRecordCancel" v-if="parseInt(params.data.drr_status) == 1 || parseInt(params.data.drr_status) == 2" />
    <q-btn unelevated color="green" label="已完成" v-else-if="parseInt(params.data.drr_status) == 3" />
    <q-btn unelevated color="red" label="已撤销" v-else-if="parseInt(params.data.drr_status) == 4" />
    <!-- <q-btn unelevated color="grey" label="查看" @click="showReserveDetail" /> -->
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  data () {
    return {
      recordData: {
        drr_status: ''
      },
      dataId: ''
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    showReserveDetail () {
      this.dataId = this.params.data.id
      this.params.context.showReserveDetail(this.dataId)
    },
    setRecordCancel () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定撤销当前预约吗？',
          cancel: true
        })
        .onOk(() => {
          const data = {
            id: this.params.data.id,
            drr_status: 4
          }
          this.$store
            .dispatch('reserveorder/changeRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '已撤销预约!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    },
    setRecordComplete () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定完成当前预约吗？',
          cancel: true
        })
        .onOk(() => {
          const data = {
            id: this.params.data.id,
            drr_status: 3
          }
          this.$store
            .dispatch('reserveorder/changeRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '已完成预约!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    },
    setRecordAllow () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定接受当前预约吗？',
          cancel: true
        })
        .onOk(() => {
          const data = {
            id: this.params.data.id,
            drr_status: 2
          }
          this.$store
            .dispatch('reserveorder/changeRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '当前预约已接受!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    }
  }
}
</script>
