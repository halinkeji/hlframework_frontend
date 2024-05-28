<template>
  <div>
    <q-btn unelevated color="warning" class="q-mr-sm" label="查看详情" @click="showTakeDetail" v-if="authorityMeta('detailTake')"> </q-btn>
    <q-btn unelevated color="primary" class="q-mr-sm" label="打款" @click="setTakeAmountData(3)" v-if="authorityMeta('editTake')"> </q-btn>
    <q-btn unelevated color="red" label="重新审核" @click="setTakeAmountData(1)" v-if="authorityMeta('editTake')"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'TakeWaitAmountAgOperate',
  components: {},
  data () {
    return {
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
          message: takeStatus == 3 ? '确定打款吗' : '确定重新审核吗',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          let checkTime = this.params.data.ptr_check_time
          let endTime = ''
          if (parseInt(takeStatus) == 1) {
            checkTime = ''
          }
          if (parseInt(takeStatus) == 3) {
            endTime = parseInt(new Date().getTime() / 1000)
          }
          const params = {
            id: this.params.data.id,
            ptr_amount: this.params.data.ptr_amount,
            ptr_member_id: this.params.data.ptr_member_id,
            ptr_status: takeStatus,
            ptr_check_time: checkTime,
            ptr_end_time: endTime
          }
          this.$store.dispatch('partner/setTakeAmountData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '操作成功',
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
