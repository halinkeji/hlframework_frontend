<template>
  <div>
    <q-btn unelevated color="warning" class="q-mr-sm" label="查看详情" @click="showTakeDetail" v-if="authorityMeta('detailTake')"> </q-btn>
    <q-btn unelevated color="red" label="重新审核" @click="setTakeAmountData(1,'确定重新审核吗？')" v-if="authorityMeta('editTake') && (parseInt(params.data.ftr_status) == 2 || parseInt(params.data.ftr_status) == 3) "> </q-btn>
    <q-btn unelevated color="primary" class="q-mr-sm" label="通过" @click="setTakeAmountData(2,'确定通过审核吗？')" v-if="authorityMeta('editTake') && parseInt(params.data.ftr_status) == 1"> </q-btn>
    <q-btn unelevated color="primary" class="q-mr-sm" label="打款" @click="setTakeAmountData(3,'确定打款吗？')" v-if="authorityMeta('editTake') && parseInt(params.data.ftr_status) == 2"> </q-btn>
    <q-btn unelevated color="red" label="拒绝" @click="setTakeAmountData(4,'确定拒绝吗？')" v-if="authorityMeta('editTake') && parseInt(params.data.ftr_status) == 1"> </q-btn>
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
    setTakeAmountData (takeStatus, messageText) {
      this.$q
        .dialog({
          title: '提示',
          message: messageText,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          let checkTime = ''
          let endTime = ''
          if (parseInt(takeStatus) == 1) {
            checkTime = ''
          }
          if (parseInt(takeStatus) == 2 || parseInt(takeStatus) == 4) {
            checkTime = parseInt(new Date().getTime() / 1000)
          }
          if (parseInt(takeStatus) == 3) {
            endTime = parseInt(new Date().getTime() / 1000)
          }
          if (parseInt(takeStatus) == 4 || parseInt(takeStatus) == 3) {
            endTime = parseInt(new Date().getTime() / 1000)
          }
          const params = {
            id: this.params.data.id,
            ftr_amount: this.params.data.ftr_amount,
            ftr_member_id: this.params.data.ftr_member_id,
            ftr_status: takeStatus,
            ftr_check_time: checkTime,
            ftr_end_time: endTime
          }
          this.$store.dispatch('fxzx/setTakeAmountData', params).then((res) => {
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
