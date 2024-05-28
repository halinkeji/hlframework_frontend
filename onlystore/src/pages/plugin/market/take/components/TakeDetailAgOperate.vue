<template>
  <div>
    <q-btn unelevated color="warning" class="q-mr-sm" label="查看详情" @click="showTakeDetail" v-if="authorityMeta('detailTake')"> </q-btn>
    <q-btn unelevated color="primary" class="q-mr-sm" label="通过" @click="setTakeAmountData(2)" v-if="authorityMeta('editTake')"> </q-btn>
    <q-btn unelevated color="red" label="拒绝" @click="setTakeAmountData(4)" v-if="authorityMeta('editTake')"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'TakeDetailAgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showTakeDetail () {
      this.params.context.showTakeDetail(this.params.data.id)
    },
    setTakeAmountData (takeStatus) {
      this.$q
        .dialog({
          title: '提示',
          message: takeStatus == 4 ? '确定不通过审核吗' : '确定通过审核吗',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          let checkTime = ''
          if (parseInt(takeStatus) == 2 || parseInt(takeStatus) == 4) {
            checkTime = parseInt(new Date().getTime() / 1000)
          }
          let endTime = ''
          if (parseInt(takeStatus) == 4 || parseInt(takeStatus) == 3) {
            endTime = parseInt(new Date().getTime() / 1000)
          }
          const params = {
            id: this.params.data.id,
            mtr_amount: this.params.data.mtr_amount,
            mtr_status: takeStatus,
            mtr_check_time: checkTime,
            mtr_end_time: endTime
          }
          this.$store.dispatch('market/setTakeAmountData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功',
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
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
