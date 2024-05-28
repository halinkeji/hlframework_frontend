<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">

    <div class="col-shrink full-height bg-grey-3">
      <q-scroll-area class="fit full-height">
        <div class="row">
          <div class="col-4 q-pa-sm" v-for="(item, key) in oilCountData">
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

              <q-item class="text-center" >
                <q-item-section >
                  <q-item-label class="text-primary text-weight-bold">消费汇总</q-item-label>
                </q-item-section  >
                <q-item-section :key="'item-section-' + k" v-for="(i, k) in item.sell">
                  <q-item-label class="text-weight-bold">{{ formatAmount(i.value) }} </q-item-label>
                  <q-item-label caption> {{ i.label }} </q-item-label>
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
export default {
  name: 'OilCount',
  components: {},
  data () {
    return {
      addPoppupStatus: false,
      text: '',
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },

      oilCountData: []
    }
  },
  created () {
    this.getErpTotal()
    this.context = this
  },
  computed: {

  },
  methods: {

    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    getErpTotal () {
      const obj = {
        text: this.text,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('openoil/getOilCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilCountData = res.data ? res.data : []
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
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
      }
    }, // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    clearBut () {
      this.text = ''
      this.selectStoreData = []
      this.getErpTotal()
    }
  }
}
</script>

<style></style>
