<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.7) + 'px',
          'max-width': parseInt($q.screen.width * 0.7) + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs row">
            <span class="text-h6 q-px-md"> 日志详情 </span>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </div>

          <div class="col-shrink q-pa-sm full-height bg-white">
            <q-scroll-area class="fit full-height">
              <div class="row q-col-gutter-sm">
                <div class="col">
                  <q-card flat bordered>
                    <q-item>
                      <q-item-section>
                        <q-item-label>请求数据</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-card-section>
                      <vue-json-viewer :value="logDetail.request_data"></vue-json-viewer>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col">
                  <q-card flat bordered>
                    <q-item>
                      <q-item-section>
                        <q-item-label>响应数据</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-card-section>
                      <vue-json-viewer :value="logDetail.results_data"></vue-json-viewer>
                    </q-card-section>
                  </q-card>
                </div>

              </div>
            </q-scroll-area>
          </div>
          <hl-local-printer ref="localPrinterRef" />
          <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
            <q-btn class="q-px-xl" unelevated label="关闭" @click="hideNowPage" color="grey" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ViewDetails',
  data () {
    return {
      logDetail: {},

      viewDetails: false,

      invoiceId: ''
    }
  },
  components: {},
  mounted () {},

  computed: {},
  methods: {

    getViewData (id) {
      this.viewDetails = true
      this.invoiceId = id

      if (id > 0) {
        this.$store
          .dispatch('wuliuapi/getLogDetail', id)
          .then((res) => {
            if (res.code == 200) {
              this.logDetail = res.data ? res.data : {}
              this.logDetail.request_data = res.data && res.data.request_data ? JSON.parse(res.data.request_data) : {}
              this.logDetail.results_data = res.data && res.data.results_data ? JSON.parse(res.data.results_data) : {}
            }
          })
          .catch((error) => {})
      }
    },
    hideNowPage () {
      this.viewDetails = false
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    valueTimeFormat (val) {
      if (parseInt(val)) {
        return this.$q_date.formatDate(val, 'YYYY-MM-DD HH:mm:ss')
      }
      return ''
    }

  }
}
</script>
