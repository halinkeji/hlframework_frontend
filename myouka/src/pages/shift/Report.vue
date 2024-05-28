<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs row">
      <div class="col-auto q-px-sm">
        <q-input outlined dense label="开始时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
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
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-auto q-px-sm">
        <q-input outlined dense label="结束时间" v-model="endTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
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
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <q-btn label="确定" @click="getDatalist" color="primary" unelevated />
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

  </div>
</template>
<script>
export default {
  name: 'shiftReport',
  components: {},
  data () {
    return {
      psr_heir_time: '',

      countTimeType: 'shift',
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
      otherData: {}
    }
  },
  mounted () {
    this.getDatalist()
  },
  computed: {},
  created () {
    this.startTime = this.$q_date.formatDate(this.startTime, 'YYYY-MM-DD HH:mm:ss')
    this.endTime = this.$q_date.formatDate(this.endTime, 'YYYY-MM-DD HH:mm:ss')
  },
  methods: {
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
    }

  }
}
</script>
