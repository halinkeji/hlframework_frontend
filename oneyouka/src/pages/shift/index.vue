<template>
  <q-dialog @hide="hideNowPage" v-model="shiftDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        交接班
      </div>

      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs row">
        <div class="col-auto q-px-sm">
          <q-input outlined dense label="接班时间" v-model="startTime" readonly :disable="disableStatus">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup @click="getDatalist" label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup @click="getDatalist" label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-auto q-px-sm">
          <q-input outlined dense label="交班时间" v-model="endTime" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn @click="getDatalist" v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn @click="getDatalist" v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white">
        <q-scroll-area class="fit full-height">
          <div class="row fit q-col-gutter-sm">
            <div class="col-12" v-if="consumeData && consumeData.title">
              <q-table
                bordered
                :title="consumeData.title"
                :data="consumeData.dataList"
                :columns="consumeData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>

            <div class="col-6" v-if="kzlsIncomeData && kzlsIncomeData.title">
              <q-table
                bordered
                :title="kzlsIncomeData.title"
                :data="kzlsIncomeData.dataList"
                :columns="kzlsIncomeData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-6" v-if="kzlsExpendData && kzlsExpendData.title">
              <q-table
                bordered
                :title="kzlsExpendData.title"
                :data="kzlsExpendData.dataList"
                :columns="kzlsExpendData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-6" v-if="discountData && discountData.title">
              <q-table
                bordered
                :title="discountData.title"
                :data="discountData.dataList"
                :columns="discountData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-6" v-if="balanceAndIntegral && balanceAndIntegral.title">
              <q-table
                bordered
                :title="balanceAndIntegral.title"
                :data="balanceAndIntegral.dataList"
                :columns="balanceAndIntegral.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-12" v-if="staffData && staffData.title">
              <q-table
                bordered
                :title="staffData.title"
                :data="staffData.dataList"
                :columns="staffData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-12" v-if="onOilStock && onOilStock.title">
              <q-table
                bordered
                :title="onOilStock.title"
                :data="onOilStock.dataList"
                :columns="onOilStock.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-12" v-if="oilErpInvoice && oilErpInvoice.title">
              <q-table
                bordered
                :title="oilErpInvoice.title"
                :data="oilErpInvoice.dataList"
                :columns="oilErpInvoice.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
                 <div class="col-12" v-if="allTotalData && allTotalData.title">
              <q-table
                bordered
                :data="allTotalData.dataList"
                :columns="allTotalData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
            <div class="col-12" v-if="otherData && otherData.title">
              <q-table
                bordered
                :data="otherData.dataList"
                :columns="otherData.tabelColumns"
                row-key="name"
                no-data-label="空"
                flat
                title-class="text-subtitle2 text-weight-bold"
                hide-bottom
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
        <q-btn color="primary" unelevated class="btn-fixed-width q-px-xl" @click="saveData"> 交 班 </q-btn>
        <q-btn color="grey" unelevated class="btn-fixed-width q-px-xl" @click="hideNowPage"> 关 闭 </q-btn>

      </div>
    </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'shiftIndex',
  components: {},
  data () {
    return {
      startTime: new Date(),
      endTime: new Date(),
      consumeData: {},
      balanceAndIntegral: {},
      onOilStock: {},
      oilErpInvoice: {},
      discountData: {},
      staffData: {},
      allTotalData: {},
      kzlsIncomeData: {},
      kzlsExpendData: {},
      otherData: {},
      disableStatus: true,
      shiftDialogStatus: false
    }
  },
  mounted () {

  },
  computed: {},
  created () {

  },
  methods: {
    init () {
      this.shiftDialogStatus = true
      this.startTime = this.$q_date.formatDate(this.startTime, 'YYYY-MM-DD HH:mm:ss')
      this.endTime = this.$q_date.formatDate(this.endTime, 'YYYY-MM-DD HH:mm:ss')
      this.$nextTick(() => {
        this.getLastData()
      })
    },
    getDatalist () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      this.getSummaryList(startTime, endTime)
    },
    getSummaryList (startTime, endTime) {
      const obj = {
        startTime,
        endTime
      }
      this.$store
        .dispatch('shift/getSummary', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumeData = res.data ? res.data.consumeData : {}
            this.discountData = res.data ? res.data.discountData : {}
            this.balanceAndIntegral = res.data ? res.data.balanceAndIntegral : {}
            this.staffData = res.data ? res.data.staffData : {}
            this.kzlsIncomeData = res.data ? res.data.kzlsIncomeData : {}
            this.kzlsExpendData = res.data ? res.data.kzlsExpendData : {}
            this.onOilStock = res.data ? res.data.onOilStock : {}
            this.oilErpInvoice = res.data ? res.data.oilErpInvoice : {}

            this.allTotalData = res.data ? res.data.allTotalData : {}
            this.otherData = res.data ? res.data.otherData : {}
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

    // 获取最后一条数据
    getLastData () {
      this.$store
        .dispatch('shift/getLastData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.startTime = this.$q_date.formatDate(res.data.psr_out_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              this.disableStatus = false
            }
            this.getDatalist()
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

    hideNowPage () {
      this.shiftDialogStatus = false

      this.$emit('colseDialog')
    },

    // 提交
    saveData () {
      this.$q
        .dialog({
          title: '确定',
          message: '请再次确认交班时间? 时间:' + this.$q_date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss') + '确认交班?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.stop = true
          const obj = {
            psr_get_time: this.$q_date.formatDate(this.startTime, 'X'),
            psr_out_time: this.$q_date.formatDate(this.endTime, 'X'),
            psr_consume_count: this.consumeData,
            psr_other_expend_count: this.kzlsExpendData,
            psr_other_income_count: this.kzlsIncomeData,
            psr_discount_count: this.discountData,
            psr_wealth_count: this.balanceAndIntegral,
            psr_reward_count: this.staffData,
            psr_oil_local_count: this.onOilStock,
            psr_total_count: this.allTotalData,
            psr_total_settle_count: this.otherData
          }
          this.$store
            .dispatch('shift/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '交接班成功!',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.hideNowPage()
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
  }
}
</script>
