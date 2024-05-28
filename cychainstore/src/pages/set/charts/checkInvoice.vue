<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        门店资产对账
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <div class="row">
            <div class="row q-gutter-sm q-py-sm col">
              <div class="col">
                <q-input outlined readonly dense v-model="startTime" label="开始时间">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="startTime" minimal @input="changeTime" :options="optionStartDate" mask="YYYY/MM/DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input outlined readonly dense v-model="endTime" label="结束时间">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="endTime" minimal :options="optionEedDate" mask="YYYY/MM/DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <q-btn :color="selectDate == 0 ? 'primary' : 'grey'" unelevated label="今天" @click="setDateArea()" />
              <q-btn :color="selectDate == 1 ? 'primary' : 'grey'" unelevated label="昨天" @click="setDateArea(1)" />
              <q-btn :color="selectDate == 3 ? 'primary' : 'grey'" unelevated label="近三天" @click="setDateArea(3)" />
              <q-btn :color="selectDate == 7 ? 'primary' : 'grey'" unelevated label="近一周" @click="setDateArea(7)" />
              <q-btn :color="selectDate == 30 ? 'primary' : 'grey'" unelevated label="近一月" @click="setDateArea(30)" />

              <q-btn color="positive" unelevated label="查询" @click="getchartsData" />

              <q-btn
                color="primary"
                unelevated
                label="对账详情"
                v-if="!is_main_store"
                @click="
                  showDetailDialog({
                    storeId: nowStoreId,
                  })
                "
              />

              <div class="col-12" v-if="is_main_store">
                <q-table
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                  row-key="field"
                  hide-bottom
                  separator="cell"
                  :data="resultRecord"
                  :columns="columns"
                  flat
                  bordered
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="storeName" :props="props">
                        <span class="text-subtitle1"> {{ props.row.storeName }} </span>
                      </q-td>

                      <q-td key="rechargeMoneyTotal" :props="props">
                        <span class="text-subtitle1">
                          +{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                          {{ formatAmount(props.row.rechargeMoneyTotal) }}
                        </span>
                      </q-td>

                      <q-td key="giveMoneyTotal" :props="props">
                        <span class="text-subtitle1">
                          +{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                          {{ formatAmount(props.row.giveMoneyTotal) }}
                        </span>
                      </q-td>

                      <q-td key="useMoneyTotal" :props="props">
                        <span class="text-subtitle1">
                          -{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                          }}{{ formatAmount(props.row.useMoneyTotal) }}
                        </span>
                      </q-td>

                      <q-td key="pushIntegralTotal" :props="props">
                        <span class="text-subtitle1">
                          {{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                          }}{{ formatAmount(props.row.pushIntegralTotal) }}
                        </span>
                      </q-td>

                      <q-td key="useIntegralTotal" :props="props">
                        <span class="text-subtitle1">
                          {{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                          }}{{ formatAmount(props.row.useIntegralTotal) }}
                        </span>
                      </q-td>

                      <q-td key="couponDiscountTotal" :props="props">
                        <span class="text-subtitle1">
                          -{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                          {{ formatAmount(props.row.couponDiscountTotal) }}
                        </span>
                      </q-td>

                      <q-td key="id" :props="props">
                        <q-btn color="primary" unelevated label="详情" @click="showDetailDialog(props.row)" />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <div class="col-12" v-else>
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <q-card flat bordered>
                      <q-card-section align="center" class="q-py-lg">
                        <div class="text-h5">
                          {{ formatAmount(storeCountItem.rechargeMoneyTotal) }}
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions class="bg-primary text-white" align="center">
                        <div class="q-py-sm">
                     +充值{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                        </div>
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered>
                      <q-card-section align="center" class="q-py-lg">
                        <div class="text-h5">
                          {{ formatAmount(storeCountItem.giveMoneyTotal) }}
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions class="bg-primary text-white" align="center">
                        <div class="q-py-sm">
                      +赠送{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                        </div>
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered>
                      <q-card-section align="center" class="q-py-lg">
                        <div class="text-h5">
                          {{ formatAmount(storeCountItem.useMoneyTotal) }}
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions class="bg-primary text-white" align="center">
                        <div class="q-py-sm">
                        -使用{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                        </div>
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered>
                      <q-card-section align="center" class="q-py-lg">
                        <div class="text-h5">
                          {{ formatAmount(storeCountItem.pushIntegralTotal) }}
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions class="bg-primary text-white" align="center">
                        <div class="q-py-sm">
                          新增{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit }}
                        </div>
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered>
                      <q-card-section align="center" class="q-py-lg">
                        <div class="text-h5">
                          {{ formatAmount(storeCountItem.useIntegralTotal) }}
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions class="bg-primary text-white" align="center">
                        <div class="q-py-sm">
                          减少{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit }}
                        </div>
                      </q-card-actions>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered>
                      <q-card-section align="center" class="q-py-lg">
                        <div class="text-h5">
                         - {{ formatAmount(storeCountItem.couponDiscountTotal) }}
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-actions class="bg-primary text-white" align="center">
                        <div class="q-py-sm">卡券优惠</div>
                      </q-card-actions>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <detail-manage ref="detailManageRef" @colseDialog="detailDialogStatus = false" v-if="detailDialogStatus" />
    </div>
  </q-page>
</template>
<script>
import { LocalStorage, date } from 'quasar'

import DetailManage from './check-component/DetailManage.vue'
export default {
  name: 'chartsService',
  components: { DetailManage },
  data () {
    return {
      selectDate: 7,

      startTime: '',
      endTime: '',
      resultRecord: [],
      memberData: [],
      context: '',
      totalCount: [],
      storeCountItem: {},
      columns: [
        {
          name: 'storeName',
          label: '门店',
          align: 'center',
          field: 'storeName'
        },
        {
          name: 'rechargeMoneyTotal',
          label: '充值' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'rechargeMoneyTotal'
        },
        {
          name: 'giveMoneyTotal',
          label: '赠送' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'giveMoneyTotal'
        },
        {
          name: 'useMoneyTotal',
          label: '会员消费使用' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'useMoneyTotal'
        },
        {
          name: 'pushIntegralTotal',
          label: '新增' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'center',
          field: 'pushIntegralTotal'
        },
        {
          name: 'useIntegralTotal',
          label: '减少' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'center',
          field: 'useIntegralTotal'
        },
        {
          name: 'couponDiscountTotal',
          label: '卡券优惠',
          align: 'center',
          field: 'couponDiscountTotal'
        },
        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id'
        }
      ],
      detailDialogStatus: false,
      nowStoreId: 0
    }
  },
  created () {
    const account_info = LocalStorage.getItem('cychainstore_account_info')
    if (account_info && account_info.store_id) {
      this.nowStoreId = account_info.store_id
    }
    this.setDateArea(7)
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    setDateArea (val) {
      this.selectDate = val || 0
      const newDate = new Date()
      const startDate = date.formatDate(date.startOfDate(newDate, 'day'), 'YYYY-MM-DD')
      const endDate = date.formatDate(date.endOfDate(newDate, 'day'), 'YYYY-MM-DD')
      if (val) {
        this.startTime = date.formatDate(date.subtractFromDate(startDate, { days: val }), 'YYYY-MM-DD')
        this.endTime = date.formatDate(date.subtractFromDate(endDate, { days: 1 }), 'YYYY-MM-DD')
      } else {
        this.startTime = startDate
        this.endTime = endDate
      }
      this.getchartsData()
    },

    formatDate (val, row) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY/MM/DD')
      }
    },
    changeTime () {
      this.endTime = ''
    },
    optionStartDate (nowDate) {
      return nowDate < date.formatDate(new Date(), 'YYYY/MM/DD')
    },
    optionEedDate (nowDate) {
      return (
        nowDate < date.formatDate(new Date(), 'YYYY/MM/DD') &&
        nowDate != this.startTime &&
        nowDate > date.formatDate(date.subtractFromDate(this.startTime, { days: 7 }), 'YYYY/MM/DD') &&
        nowDate < date.formatDate(date.addToDate(this.startTime, { days: 7 }), 'YYYY/MM/DD')
      )
    },
    formatRowDate (val, row) {
      return this.formatAmount(val)
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    getchartsData () {
      if (!this.startTime || !this.endTime) {
        this.$q.notify({
          message: '错误',
          caption: '请选择时间段',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })

        return false
      }

      const params = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('charts/getCheckInvoiceData', params)
        .then((res) => {
          if (res.code == 200) {
            this.storeCountItem = res.data.storeCountItem ? res.data.storeCountItem : {}

            this.resultRecord = res.data.storeCountData ? res.data.storeCountData : []
            // const resultData = res.data ? res.data : {}
            // this.drawLine(resultData.xAxis, resultData.seriesData, resultData.legendData)
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    showDetailDialog (row) {
      this.detailDialogStatus = true

      // 当天开始时间
      const startTime = date.formatDate(new Date(new Date(this.startTime).setHours(0, 0, 0, 0)).getTime(), 'X')
      // 当天结束时间
      const endTime = date.formatDate(new Date(new Date(this.endTime).setHours(23, 59, 59, 999)).getTime(), 'X')

      this.$nextTick(() => {
        this.$refs.detailManageRef.init(row.storeId, startTime, endTime)
      })
    }
  }
}
</script>
