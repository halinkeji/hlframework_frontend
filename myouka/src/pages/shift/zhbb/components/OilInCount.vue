<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <shift-count @getPeriod="init" />
    </div>

    <div class="col-shrink q-pa-sm full-height bg-white">
      <q-scroll-area class="fit full-height">
        <div class="row">
          <div class="col-4 q-pa-sm" v-for="(item, key) in oilInOutData">
            <q-list bordered padding class="bg-white">
              <q-item-label header class="text-dark text-weight-bold">{{ item.op_name }}</q-item-label>
              <q-separator spaced />

              <q-item class="text-center" :key="'item-' + k" v-for="(i, k) in item.erp">
                <q-item-section>
                  <q-item-label class="text-primary text-weight-bold">{{ i.label }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ i.totalTon }} <span class="text-caption q-ml-xs">吨</span> </q-item-label>
                  <q-item-label caption>总吨数</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ i.totalLiter }}<span class="text-caption q-ml-xs">升</span></q-item-label>
                  <q-item-label caption>总升数</q-item-label>
                </q-item-section>
                <q-item-section class="text-weight-bold">
                  <q-item-label>{{ i.totalPrice }}<span class="text-caption q-ml-xs">元</span></q-item-label>
                  <q-item-label caption>总金额</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import ShiftCount from '../../count.vue'
export default {
  name: 'OilInCount',
  components: {
    ShiftCount
  },
  data () {
    return {
      oilInOutData: [],
      startTime: '',
      endTime: ''

    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },
    // 获取汇总数据
    getSummaryList () {
      const obj = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getOilInoutCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilInOutData = res.data ? res.data : []
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

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0.0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style></style>
