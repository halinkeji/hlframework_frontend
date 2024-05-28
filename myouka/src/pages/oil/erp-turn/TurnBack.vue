<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        借回
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-form ref="takeDataRef">
            <!-- <q-btn color="orange" @click="turnStatus = true" unelevated class="q-mb-sm" label="选择调拨单据" size="md" /> -->

            <q-markup-table square flat bordered separator="cell">
              <thead class="text-subtitle2">
                <tr>
                  <th>订单号</th>
                  <th>油品</th>
                  <th style="width: 10%">油品密度</th>
                  <th style="width: 10%">油品损耗比</th>
                  <th>剩余</th>
                  <th style="width: 18%">油罐</th>
                  <th style="width: 10%">小计</th>
                  <th style="width: 10%">运费/开支</th>
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
                    <q-input outlined :rules="[(val) => !!val || '请输入油品密度']" dense v-model="item.oid_density"> </q-input>
                  </td>
                  <td>
                    <q-input
                      outlined
                      dense
                      v-model="item.oid_loss"
                      placeholder="损耗比"
                      lazy-rules
                      @input="inputOilCanData(mainkey, -1)"
                      :rules="[(val) => /^(\d+|\d+\.\d{1,3})$/.test(val) || '请输入油品损耗比']"
                    >
                    </q-input>
                  </td>

                  <td class="text-body1">
                    <div v-if="item.oid_unit == 1">
                      <span>{{ item.oid_last_ton_count }}</span>
                      吨
                    </div>
                    <div v-else-if="item.oid_unit == 2">
                      <span>{{ item.oid_last_liter_count }}</span
                      >升
                    </div>
                  </td>

                  <td class="text-body1 text-left">
                    <div v-for="(items, k) in item.oilCan">
                      <q-item class="q-pa-none">
                        <q-item-section>
                          <q-item-label>
                            <span class="text-orange text-weight-bold">{{ items.oc_name }}</span>
                            损耗:{{ formatAmountThree(items.ecr_loss_count) }}升，实际拉回{{ formatAmountThree(items.real_liter_count) }}升
                          </q-item-label>
                          <q-item-label>
                            <q-input
                              outlined
                              dense
                              v-model="items.takeCount"
                              @input="inputOilCanData(mainkey, k)"
                              :rules="[(val) => !!val || '请输入数量']"
                            >
                            </q-input>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </td>
                  <td class="text-body1 text-left">
                    共取回 {{ item.oid_liter_count }}升，{{ item.oid_ton_count }}吨，总损耗 {{ item.oid_loss_count }}，实际拉回{{ item.takeCount }}升
                  </td>

                  <td class="text-body1 text-left">
                    <q-input
                      outlined
                      dense
                      v-model="item.oid_ship_pay"
                      label="请输入运油开支"
                      lazy-rules
                      :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入运油开支']"
                    >
                    </q-input>
                    <q-input
                      outlined
                      dense
                      v-model="item.oid_freight"
                      label="请输入运费"
                      lazy-rules
                      :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入运费']"
                    >
                    </q-input>
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
          </q-form>
        </q-scroll-area>
      </div>

      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated label="保存" @click="setData" :disable="addButtonDisabled" color="primary" class="q-px-xl" />
        <q-btn unelevated label="返回" type="reset" :to="{ name: 'oilTurn' }" color="grey" class="q-px-xl" />
      </div>
    </div>
    <oil-record ref="takeRef" :type="'turn_out'" v-if="turnStatus" @getRecord="getSelectedOilData" />
  </q-page>
</template>
<script>
import OilRecord from '../erp-open/OilRecord.vue'
export default {
  name: 'TurnBack',
  components: { OilRecord },
  data () {
    return {
      options: [
        {
          label: '吨',
          value: '1'
        },
        {
          label: '升',
          value: '2'
        }
      ],
      LendData: {
        oti_in_store_id: '',
        oti_invoice_code: '',
        oti_in_store_name: '',
        oti_invoice_type: '4'
      },
      takeOilData: [],
      turnStatus: false,

      addButtonDisabled: false,
      context: null,
      gridOptions: {},
      totalTakeCount: 0
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
        .dispatch('turnoil/getInvoiceDetailData', { invoiceId: this.invoiceId, type: 'turn_return_out' })
        .then((res) => {
          if (res.code == 200) {
            // this.operateType = 'turn_return_out'

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

    // 获取选中开油数据
    getSelectedOilData (data) {
      this.turnStatus = false
      const that = this
      if (data) {
        if (data.length > 0) {
          const takeOilData = []
          data.forEach(function (value, index, array) {
            const findInvoiceIndex = _.findIndex(that.takeOilData, function (o) {
              return o.id == value.id
            })

            if (findInvoiceIndex < 0) {
              if (parseInt(value.oid_unit) == 1 && value.oid_last_ton_count > 0) {
                takeOilData.push(value)
              }
              if (parseInt(value.oid_unit) == 2 && value.oid_last_liter_count > 0) {
                takeOilData.push(value)
              }
            }
          })

          this.takeOilData = this.takeOilData.concat(takeOilData)
        }
      }
    },

    inputOilCanData (mainkey, k) {
      const oilCanList = this.takeOilData[mainkey]
      if (oilCanList && oilCanList.oid_loss) {
        let lossCount = 0
        let totalTakeCount = 0
        let allTonCount = 0
        let allLiterCount = 0
        let allRealLiterCount = 0

        oilCanList.oilCan.forEach((items) => {
          totalTakeCount += this.formatAmountThree(items.takeCount)

          if (parseInt(oilCanList.oid_unit) == 1) {
            // 吨换算升

            items.ecr_ton_count = items.takeCount
            items.ecr_liter_count = this.unitConvert(oilCanList, items.takeCount)
            items.ecr_loss_count = this.formatAmountThree(oilCanList.oid_loss * items.ecr_liter_count)
          } else {
            // 升换算吨

            items.ecr_ton_count = this.unitConvert(oilCanList, items.takeCount)
            items.ecr_liter_count = items.takeCount
            items.ecr_loss_count = this.formatAmountThree(oilCanList.oid_loss * items.ecr_liter_count)
          }

          lossCount += this.formatAmountThree(items.ecr_loss_count)
          allTonCount += this.formatAmountThree(items.ecr_ton_count)
          allLiterCount += this.formatAmountThree(items.ecr_liter_count)

          items.real_liter_count = this.formatAmountThree(items.ecr_liter_count - items.ecr_loss_count)
          allRealLiterCount += this.formatAmountThree(items.real_liter_count)
        })

        if (k > -1) {
          if (parseInt(oilCanList.oid_unit) == 1) {
            if (totalTakeCount > oilCanList.oid_last_ton_count) {
              this.$q.notify({
                message: '失败',
                caption: '操作取回吨数大于剩余吨数',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              oilCanList.oilCan[k].takeCount = 0
              this.inputOilCanData(mainkey, -1)
              return false
            }
          } else {
            if (totalTakeCount > oilCanList.oid_last_liter_count) {
              this.$q.notify({
                message: '失败',
                caption: '操作取回升数大于剩余升数',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              oilCanList.oilCan[k].takeCount = 0
              this.inputOilCanData(mainkey, -1)
              return false
            }
          }
        }

        oilCanList.oid_liter_count = this.formatAmountThree(allLiterCount)
        oilCanList.oid_ton_count = this.formatAmountThree(allTonCount)
        oilCanList.oid_loss_count = this.formatAmountThree(lossCount)
        oilCanList.takeCount = this.formatAmountThree(allRealLiterCount)
      }
    },

    setData () {
      this.$refs.takeDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          this.$q
            .dialog({
              title: '提示',
              message: '确认取回油品？',
              cancel: true
            })

            .onOk(() => {
              const data = {
                takeOilData: this.takeOilData
              }
              this.$store.dispatch('turnoil/turnBack', data).then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '取回成功',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'green'
                  })
                  this.$router.push({ name: 'oilTurn' })
                } else {
                  this.addButtonDisabled = false
                  this.$q.notify({
                    message: '失败',
                    caption: '取回失败',
                    color: 'red',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
              })
            })
            .onCancel(() => {})
        }
      })
    },

    // 升数换算
    unitConvert (data, item) {
      const oid_density = data.oid_density
      let nowCount = 0
      // 吨数换算成升
      if (oid_density && parseInt(data.oid_unit) == 1) {
        nowCount = this.formatAmountThree((item / oid_density) * 1000)
      } else if (oid_density && parseInt(data.oid_unit) == 2) {
        // 升数换吨数
        nowCount = this.formatAmountThree((item * oid_density) / 1000)
      }
      return this.formatAmountThree(nowCount)
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
    }
  }
}
</script>
