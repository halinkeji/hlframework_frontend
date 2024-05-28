<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        关联还出
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2 q-pb-sm">
        <q-markup-table square flat bordered separator="cell">
          <thead class="text-subtitle2">
            <tr>
              <th style="width: 5%">订单号</th>
              <th style="width: 5%">油品</th>
              <th style="width: 5%">油品密度</th>
              <th style="width: 5%">剩余</th>
              <th style="width: 5%">单价</th>
              <th style="width: 5%">总欠款</th>
              <th style="width: 8%">还回方式</th>
              <th style="width: 35%">本次还回</th>
              <th style="width: 8%">小计</th>
              <th style="width: 3%">操作</th>
            </tr>
          </thead>
          <tbody class="text-center" v-if="takeOilData && takeOilData.length > 0">
            <tr v-for="(item, mainkey) in takeOilData">
              <td class="text-body1">
                {{ item.poi_invoice_code }}
              </td>
              <td class="text-body1">{{ item.oid_oil_name }}</td>
              <td>
                {{ item.oid_density }}
              </td>

              <td class="text-body1">
                <div v-if="parseInt(item.oid_unit) == 1">
                  <span>{{ item.oid_last_ton_count }}</span>
                  吨
                </div>
                <div v-if="parseInt(item.oid_unit) == 2">
                  <span>{{ item.oid_last_liter_count }}</span
                  >升
                </div>
              </td>

              <td class="text-body1">
                {{ item.oid_price }}
              </td>
              <td class="text-body1">{{ item.oid_last_total_price }}</td>

              <td class="text-body1">
                <q-select
                  outlined
                  dense
                  v-model="item.retrun_type"
                  :options="[
                    {
                      label: '以油还油',
                      value: '1',
                    },
                    {
                      label: '支付',
                      value: '2',
                    },
                  ]"
                  option-label="label"
                  emit-value
                  map-options
                />
              </td>
              <td class="text-body1 q-pa-none">
                <div v-if="parseInt(item.retrun_type) == 1">
                  <q-list separator>
                    <q-item class="q-pa-xs" :key="k" v-for="(i, k) in item.openOilRecord">
                      <q-item-section class="q-pa-xs" side>
                        <q-item-label caption class="text-dark text-weight-bold">{{ i.poi_invoice_code }}</q-item-label>
                        <q-item-label caption>单据号</q-item-label>
                      </q-item-section>
                      <q-item-section class="q-pa-xs">
                        <q-item-label caption class="text-dark text-weight-bold">{{ i.oid_last_ton_count }}</q-item-label>
                        <q-item-label caption>吨</q-item-label>
                      </q-item-section>
                      <q-item-section class="q-pa-xs">
                        <q-item-label caption class="text-dark text-weight-bold">{{ i.oid_last_liter_count }}</q-item-label>
                        <q-item-label caption>升</q-item-label>
                      </q-item-section>
                      <q-item-section class="q-pa-xs">
                        <q-item-label caption class="text-dark text-weight-bold">{{ i.oid_last_total_price }}</q-item-label>
                        <q-item-label caption>总额</q-item-label>
                      </q-item-section>

                      <q-item-section class="q-pa-xs" v-if="parseInt(item.oid_unit) != parseInt(i.oid_unit)">
                        <q-item-label caption class="text-dark text-weight-bold">
                          <q-input outlined dense v-model="i.oid_density" label="密度" />
                        </q-item-label>
                      </q-item-section>

                      <q-item-section class="q-pa-xs" v-else>
                        <q-item-label caption class="text-dark text-weight-bold">
                          {{ i.oid_density }}
                        </q-item-label>
                        <q-item-label caption>密度</q-item-label>
                      </q-item-section>

                      <q-item-section class="q-pa-xs" side>
                        <q-btn flat dense rounded color="red" @click="deleteDebtInvoice(mainkey, k)" size="sm" icon="delete_forever" />
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-btn flat color="primary" dense label="请选择单据" @click="openOilRecord('open', item.id)" />
                </div>

                <div class="row q-col-gutter-sm" v-if="parseInt(item.retrun_type) == 2">
                  <div class="col" v-if="parseInt(item.oid_unit) == 1">
                    <q-input dense outlined @input="changeRepaymentAmount(item, mainkey)" v-model="item.totalTonCount" label="请输入本次还油吨数" />
                  </div>
                  <div class="col" v-if="parseInt(item.oid_unit) == 2">
                    <q-input dense outlined @input="changeRepaymentAmount(item, mainkey)" v-model="item.totalLiterCount" label="请输入本次还油升数" />
                  </div>
                  <div class="col">
                    <q-input dense outlined @input="changeRepaymentAmount(item, mainkey)" v-model="item.currentPrice" label="单价" />
                  </div>

                  <div class="col">
                    <q-input dense outlined disable v-model="item.repaymentAmount" label="请输入本次还油金额" />
                  </div>
                </div>
              </td>
              <td class="text-body1 text-left">
                本次共还 <br />
                 <span class="text-subtitle1 text-weight-bold text-primary"> {{ item.repaymentAmount }}</span> 元<br />
                <span class="text-subtitle1 text-weight-bold text-primary">{{ item.totalTonCount }}</span> 吨<br />
                <span class="text-subtitle1 text-weight-bold text-primary">{{ item.totalLiterCount }}</span> 升<br />
                <span v-if="item.profitAmount > 0">盈</span>
                <span v-if="item.profitAmount < 0">亏</span>
                <span class="text-subtitle1 text-weight-bold text-primary"> {{ item.profitAmount }}</span> 元<br />
              </td>
              <td class="text-body1">
                <q-btn flat dense rounded color="red" @click="delRowData(mainkey)" icon="delete_forever" />
              </td>
            </tr>
          </tbody>
          <tbody class="text-center" v-else>
            <tr>
              <td class="text-grey-9" colspan="7">请选择开油单据</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn unelevated label="确认" @click="submitData()" :disable="addButtonDisabled" color="primary" class="q-px-xl" />
        <q-btn unelevated label="返回" type="reset" :to="{ name: 'oilDebt' }" color="grey" class="q-px-xl" />
      </div>
      <oil-record ref="oilopenRef" :type="operateType" v-if="openPoppupStatus" @getRecord="getSelectedTypeOilData" />
    </div>
  </q-page>
</template>
<script>
import OilRecord from '../../erp-open/OilRecord.vue'

export default {
  name: 'Lend',
  components: {
    OilRecord
  },
  data () {
    return {
      takeOilData: [],
      openPoppupStatus: false,
      addButtonDisabled: false,
      context: null,
      gridOptions: {},
      libInStoreList: [],
      localeText: this.$ag_grid_localeText,
      operateType: 'return_back',
      debtInvoiceId: 0
    }
  },
  created () {
    this.context = this

    if (this.$route.query.invoiceId > 0) {
      this.invoiceId = this.$route.query.invoiceId
      this.$nextTick(() => {
        this.getInvoiceDetail()
      })
    }
  },
  methods: {
    getInvoiceDetail () {
      this.$store
        .dispatch('turnoil/getInvoiceDetailData', { invoiceId: this.invoiceId })
        .then((res) => {
          if (res.code == 200) {
            this.getSelectedOilData(res.data)
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
    getSelectedTypeOilData (data) {
      this.openPoppupStatus = false
      if (this.operateType == 'open') {
        this.getSelectOpenData(data)
      } else if (this.operateType == 'return_back') {
        this.getSelectedOilData(data)
      }
    },

    getSelectOpenData (data) {
      const that = this

      if (this.debtInvoiceId > 0) {
        const findIndex = _.findIndex(this.takeOilData, function (o) {
          return parseInt(o.id) == parseInt(that.debtInvoiceId)
        })
        if (findIndex > -1) {
          let openOilRecord = this.takeOilData[findIndex].openOilRecord
          const oilRecordItem = this.takeOilData[findIndex]
          // 判断单据是否存在   判断单据油品是否一致
          if (data && data.length > 0) {
            const currentData = []
            data.forEach((item) => {
              const giveIndex = _.findIndex(openOilRecord, function (o) {
                return parseInt(o.id) == parseInt(item.id)
              })
              if (giveIndex < 0) {
                if (parseInt(oilRecordItem.oid_oil_id) == parseInt(item.oid_oil_id)) {
                  if (parseInt(item.oid_unit) == 1 && item.oid_last_ton_count > 0) {
                    currentData.push(item)
                  }
                  if (parseInt(item.oid_unit) == 2 && item.oid_last_liter_count > 0) {
                    currentData.push(item)
                  }
                }
              }
            })

            this.takeOilData[findIndex].openOilRecord = openOilRecord.concat(currentData)
            openOilRecord = this.takeOilData[findIndex].openOilRecord
          }

          if (openOilRecord && openOilRecord.length > 0) {
            let totalPrice = 0
            let totalTonCount = 0
            let totalLiterCount = 0
            let tonBakCount = oilRecordItem.oid_last_ton_count
            let literBakCount = oilRecordItem.oid_last_liter_count

            openOilRecord.forEach((item) => {
              let lastTonCount = item.oid_last_ton_count
              let lastLiterCount = item.oid_last_liter_count
              let lastTotalPriceCount = item.oid_last_total_price
              const density = 0.835

              if (parseInt(oilRecordItem.oid_unit) != parseInt(item.oid_unit)) {
                if (parseInt(item.oid_unit) == 1) {
                  lastLiterCount = that.calculateLiter(density, item.oid_last_ton_count)
                } else if (parseInt(item.oid_unit) == 2) {
                  lastTonCount = that.calculateTon(density, item.oid_last_liter_count)
                }
              }

              if (parseInt(item.oid_unit) == 1) {
                if (that.formatAmountThree(literBakCount) < that.formatAmountThree(lastLiterCount)) {
                  lastLiterCount = literBakCount
                }

                lastTonCount = that.formatAmountThree(that.calculateTon(density, literBakCount))
                lastTotalPriceCount = that.formatAmount(item.oid_price * lastTonCount)

                literBakCount = that.formatAmountThree(literBakCount - lastLiterCount)
              } else if (parseInt(item.oid_unit) == 2) {
                if (that.formatAmountThree(tonBakCount) < that.formatAmountThree(lastTonCount)) {
                  lastTonCount = tonBakCount
                }

                lastLiterCount = that.formatAmountThree(that.calculateLiter(density, lastTonCount))
                lastTotalPriceCount = that.formatAmount(item.oid_price * lastLiterCount)
                tonBakCount = that.formatAmountThree(tonBakCount - lastTonCount)
              }

              if (parseInt(oilRecordItem.oid_unit) == 1) {
                if (tonBakCount < 0) {
                  return false
                }
              } else if (parseInt(oilRecordItem.oid_unit) == 2) {
                if (lastLiterCount < 0) {
                  return false
                }
              }

              totalTonCount += that.formatAmountThree(lastTonCount)
              totalLiterCount += that.formatAmountThree(lastLiterCount)
              totalPrice += that.formatAmount(lastTotalPriceCount)
            })

            this.takeOilData[findIndex].repaymentAmount = that.formatAmountThree(totalPrice)
            this.takeOilData[findIndex].totalTonCount = that.formatAmountThree(totalTonCount)
            this.takeOilData[findIndex].totalLiterCount = that.formatAmountThree(totalLiterCount)
          }
        }
      }
    },

    getSelectedOilData (data) {
      this.openPoppupStatus = false
      const that = this
      if (data) {
        if (data.length > 0) {
          const takeOilData = []

          data.forEach(function (value, index, array) {
            const findInvoiceIndex = _.findIndex(that.takeOilData, function (o) {
              return o.id == value.id
            })

            value = JSON.parse(JSON.stringify(value))
            value.openOilRecord = []
            value.repaymentAmount = '0'
            value.retrun_type = '2'
            value.oid_note = ''
            value.totalTonCount = 0
            value.totalLiterCount = 0
            value.profitAmount = 0
            value.currentPrice = 0

            if (findInvoiceIndex < 0) {
              if (parseInt(value.oid_unit) == 1 && value.oid_last_ton_count > 0) {
                takeOilData.push(value)
              }
              if (parseInt(value.oid_unit) == 2 && value.oid_last_liter_count > 0) {
                takeOilData.push(value)
              }
            }
          })

          if (takeOilData && takeOilData.length > 0) {
            this.takeOilData = this.takeOilData.concat(takeOilData)
          }
        }
      }
    },

    submitData () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确认调拨借出？',
          cancel: true
        })
        .onOk(() => {
          this.addButtonDisabled = true

          const obj = {
            returnOilData: this.takeOilData
          }
          this.$store.dispatch('turnoil/setLinkBorrowOut', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '借出成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })

              this.$router.push({ name: 'oilDebt' })
            } else {
              this.$q.notify({
                message: '注意',
                caption: '借出失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })

              this.addButtonDisabled = false
            }
          })
        })
        .onCancel(() => {})
    },

    changeRepaymentAmount (item, key) {
      if (parseInt(item.oid_unit) == 1) {
        if (this.formatAmount(item.totalTonCount) > this.formatAmount(item.oid_last_ton_count)) {
          item.totalTonCount = 0
          this.$q.notify({
            message: '失败',
            caption: '归还吨数不能大于借油吨数',
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      }

      if (parseInt(item.oid_unit) == 2) {
        if (this.formatAmount(item.totalLiterCount) > this.formatAmount(item.oid_last_liter_count)) {
          item.totalLiterCount = 0
          this.$q.notify({
            message: '失败',
            caption: '归还升数不能大于借油升数',
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      }

      if (parseInt(item.oid_unit) == 1) {
        item.totalLiterCount = this.calculateLiter(item.oid_density, item.totalTonCount)
        item.repaymentAmount = this.formatAmount(item.totalTonCount * this.formatAmount(item.currentPrice))
        item.profitAmount = this.formatAmount(item.repaymentAmount - item.totalTonCount * item.oid_price)
      } else if (parseInt(item.oid_unit) == 2) {
        item.totalTonCount = this.calculateTon(item.oid_density, item.totalLiterCount)
        item.repaymentAmount = this.formatAmount(item.totalLiterCount * this.formatAmount(item.currentPrice))
        item.profitAmount = this.formatAmount(item.repaymentAmount - item.totalLiterCount * item.oid_price)
      }
    },

    // 吨换算升
    calculateLiter (density, ton) {
      if (density > 0 && ton > 0) {
        return this.formatAmountThree((this.formatAmountThree(ton) / this.formatAmountThree(density)) * 1000)
      }
      return 0
    },

    // 升换算吨
    calculateTon (density, liter) {
      if (density > 0 && liter > 0) {
        return this.formatAmountThree((this.formatAmountThree(liter) * this.formatAmountThree(density)) / 1000)
      }
      return 0
    },

    deleteDebtInvoice (mainKey, key) {
      if (
        this.takeOilData &&
        this.takeOilData[mainKey] &&
        this.takeOilData[mainKey].openOilRecord &&
        this.takeOilData[mainKey].openOilRecord.length > 0
      ) {
        this.takeOilData[mainKey].openOilRecord.splice(key, 1)
      }
    },

    delRowData (mainKey) {
      this.takeOilData.splice(mainKey, 1)
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
    },
    openOilRecord (type, invoiceId) {
      this.operateType = type
      this.debtInvoiceId = invoiceId
      this.$nextTick(() => {
        this.openPoppupStatus = true
      })
    }
  }
}
</script>
