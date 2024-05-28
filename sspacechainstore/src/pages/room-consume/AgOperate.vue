<template>
  <div class="row q-gutter-sm">
    <q-btn
      unelevated
      color="primary"
      label="开台"
      :disable="params.data.srr_start_time <= nowTimestamp && nowTimestamp <= params.data.srr_end_time ? false : true"
      @click="clickOpenRoom(params.data.id)"
    />
    <q-btn unelevated color="red" label="取消" @click="cancelBookOrder(params.data.id)" />
  </div>
</template>
<script>
export default {
  name: 'TypeAgOperate',
  components: {},
  data () {
    return {
      dataId: '',
      nowTimestamp: 0
    }
  },
  created () {
    this.nowTimestamp = this.$q_date.formatDate(new Date(), 'X')
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    showPopup () {
      this.params.context.showAddType(this.dataId)
    },
    clickOpenRoom (order_id) {
      this.$q
        .dialog({
          title: '提示',
          message: '立即开台',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('bookManage/openRoomConsumeData', {
              order_id
            })
            .then((res) => {
              if (res.code == 200 && res.data && res.data.id) {
                this.$q.notify({
                  message: '提示',
                  caption: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.closeOpenRoomDialog()
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
                caption: error.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    },
    cancelBookOrder (order_id) {
      this.$store
        .dispatch('bookManage/cancelBookOrder', {
          order_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '取消成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getCurrentReserveDetail()
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '取消预订失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
