<template>
  <q-page class="q-pa-xs">
    <div class="row text-center text-h6">
      <div class="col">
        {{ this.$q_date.formatDate(psr_heir_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}
      </div>
      <div class="col">
        {{ this.$q_date.formatDate(psr_transfer_time, 'YYYY-MM-DD HH:mm:ss') }}
      </div>
    </div>

    <count-report ref="reportPageData" :selectTimeStatus="false" />
    <q-form ref="shiftFormRef" class="q-gutter-md">
      <div class=" text-right q-mt-md">
        <div class="row">
          <q-space />

          <q-btn color="primary" unelevated class="q-px-xl q-mb-xl" @click="saveData">
            交 班
          </q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>
<script>
import TotalCount from './components/TotalCount'
import DiscountCount from './components/DiscountCount'
import CountReport from './Report.vue'
export default {
  name: 'printerIndex',
  components: {
    TotalCount,
    DiscountCount,
    CountReport
  },
  data () {
    return {
      psr_heir_time: '',
      psr_total_amount: '',
      psi_give_integral_ratio: '',
      consumeData: [],
      onOilStock: [],
      oilerpInvoice: [],
      discountData: [],
      psr_transfer_time: ''
    }
  },
  mounted () {
    this.getLastData()
  },
  computed: {},
  created () {
    this.psr_transfer_time = new Date()
  },
  methods: {
    // 获取最后一条数据
    getLastData () {
      this.$store
        .dispatch('shift/getLastData')
        .then((res) => {
          if (res.code == 200) {
            this.psr_heir_time = res.data ? res.data : parseInt(new Date().getTime() / 1000)
            this.getSummaryList(this.psr_heir_time, parseInt(new Date().getTime() / 1000))
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
    // 获取汇总数据
    getSummaryList (startTime, endTime) {
      if (this.$refs.reportPageData) {
        this.$refs.reportPageData.getSummaryList(startTime, endTime)
      }
    },
    // 提交
    saveData () {
      this.$refs.shiftFormRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              type: 'confirm',
              color: 'primary',
              title: '是否确认',
              message: '确定提交本次结班数据？',
              cancel: true
            })
            .onOk(() => {
              this.stop = true
              const obj = {
                psi_give_integral_ratio: this.psi_give_integral_ratio,
                psr_total_amount: this.psr_total_amount,
                psr_heir_time: this.psr_heir_time,
                psr_transfer_time: parseInt(new Date().getTime() / 1000)
              }
              this.$store
                .dispatch('shift/setData', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      message: '成功',
                      caption: '交接班成功',
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      color: 'green'
                    })
                    this.$router.push({ name: 'shiftRecord' })
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
        }
      })
    }
  }
}
</script>
