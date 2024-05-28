<template>
  <div class="q-gutter-sm">
    <q-btn unelevated color="primary" v-if="statusText && parseInt(params.data.cr_status) == 1" @click="changeTimePeriod" label="换场" />

    <q-btn unelevated color="negative" v-if="statusText || parseInt(params.data.cr_status) == 5" @click="refundTimeAmount" label="退场" />
  </div>
</template>
<script>
import { date } from 'quasar'
export default {
  name: 'DetailAgOperate',
  data () {
    return {

    }
  },
  mounted () {},
  created () {},
  computed: {
    statusText () {
      const p = this.params.data
      const time = p.cr_year + '-' + p.cr_month + '-' + p.cr_day + ' ' + p.cr_start_hour + ':' + p.cr_start_minutes
      const yyTiem = date.formatDate(new Date(time), 'X')
      const nowTime = date.formatDate(new Date(), 'X')

      if (yyTiem < nowTime) {
        return false
      } else {
        if (parseInt(p.cr_status) == 1) {
          return true
        }
      }
      return false
    }
  },
  methods: {

    changeTimePeriod () {
      this.params.context.changeTimePeriod(this.params.data.id)
    },

    refundTimeAmount () {
      this.$store
        .dispatch('cdyy/refundTimeAmount', {
          recordId: this.params.data.id
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.dialog({
              title: '主动退场',
              message: res.data.text,
              cancel: true,
              persistent: true
            }).onOk(() => {
              this.$nextTick(() => {
                this.confirmChangeTime(res.data.refundAmount)
              })
            }).onCancel(() => {
              // console.log('Cancel')
            }).onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            })
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '查询失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },

    confirmChangeTime (cr_refund_amount) {
      this.$store
        .dispatch('cdyy/confirmRecordData', {
          recordId: this.params.data.id,
          cr_refund_amount
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '退场成功',
              color: 'green'
            })
            this.params.context.getList()
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '支付失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
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
