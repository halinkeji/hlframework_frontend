<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent full-height>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.8) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.8) + 'px'
        }"
        class="fit"
      >
        <div
          class="fit column no-wrap justify-between items-stretch content-stretch no-scroll"
        >
          <div
            class="row col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs"
          >
            <span class="row text-h6 q-px-md">
              整单退货
            </span>
            <q-space />
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              @click="hideNowPage"
            />
          </div>
          <div class="col-shrink q-pa-sm full-height bg-white ">
            <q-scroll-area class="fit full-height">
              <q-card-section>
                <q-item-label class="row q-gutter-y-md">
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    消费单据号:<span class="text-body1">{{
                      invoiceData.sc_invoiceCode
                    }}</span>
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    会员卡号:<span class="text-body1">{{
                      invoiceData.sc_memberCardNum
                    }}</span>
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    会员姓名:<span class="text-body1">{{
                      invoiceData.sc_memberName
                    }}</span>
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    时间:<span class="text-body1">{{
                      this.$q_date.formatDate(
                        invoiceData.created_at * 1000,
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    }}</span>
                  </div>

                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    应付金额:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{ invoiceData.sc_handleMoneyCount }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    实收金额:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{ invoiceData.sc_realMoneyCount }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    规则优惠:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{ invoiceData.sc_rulePaymentCount }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    卡券优惠:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{ invoiceData.sc_couponPaymentCount }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    {{
                      $q.localStorage.getItem("chainstore_store_local")
                        .storeBaseConfig.consume_base_balanceUnit
                    }}支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_rechargePaymentCount)
                      }}</span
                    >
                  </div>

                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    {{
                      $q.localStorage.getItem("chainstore_store_local")
                        .storeBaseConfig.consume_base_integralUnit
                    }}支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_pointPaymentCount)
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    银行卡支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_blankPaymentCount)
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    (刷卡)微信支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_wechatPaymentCount)
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    (刷卡)支付宝支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_alipayPaymentCount)
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    个人微信支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(
                          invoiceData.sc_wechatPersonalPaymentCount
                        )
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    个人支付宝支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(
                          invoiceData.sc_alipayPersonalPaymentCount
                        )
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    现金支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_cashPaymentCount)
                      }}</span
                    >
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    其他支付:<span class="text-body1"
                      >{{
                        $q.localStorage.getItem("chainstore_store_local")
                          .storeBaseConfig.consume_base_moneySymbol
                      }}{{
                        this.formatAmount(invoiceData.sc_otherPaymentCount)
                      }}</span
                    >
                  </div>

                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    操作员:<span class="text-body1">{{
                      invoiceData.user ? invoiceData.user.username : ""
                    }}</span>
                  </div>
                  <div class="col col-md-3 col-sm-6 col-xs-12">
                    备注:{{ invoiceData.sc_note }}
                  </div>
                </q-item-label>
              </q-card-section>
              <div
                class="q-mt-sm"
                v-if="invoiceData.consumeInvoiceDetail.length > 0"
              >
                <q-table
                  title="消费详情"
                  :data="invoiceData.consumeInvoiceDetail"
                  :columns="consumeData"
                  row-key="id"
                  hide-bottom
                  flat
                  bordered
                  title-classs="bg-brown"
                  separator="cell"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="cid_packageName" :props="props">
                        <div>
                          {{ props.row.cid_packageName }}
                          <q-tooltip>
                            {{ props.row.cid_packageName }}</q-tooltip
                          >
                        </div>
                      </q-td>
                      <q-td key="cid_goo_name" :props="props">
                        <div>
                          {{ props.row.cid_goo_name
                          }}{{ props.row.cid_specificationName }}
                          <q-tooltip>
                            {{ props.row.cid_goo_name
                            }}{{ props.row.cid_specificationName }}</q-tooltip
                          >
                        </div>
                      </q-td>
                      <q-td key="cid_goo_code" :props="props">
                        {{ props.row.cid_goo_code }}
                      </q-td>
                      <q-td key="cid_consumeNumber" :props="props">
                        <span
                          v-if="parseInt(props.row.cid_packageId) > 0"
                          class="text-red"
                          >[套]</span
                        >
                        {{ props.row.cid_consumeNumber }}
                      </q-td>
                      <q-td key="cid_goo_price" :props="props">
                        <span
                          v-if="parseInt(props.row.cid_packageId) > 0"
                          class="text-red"
                          >[套]</span
                        >
                        {{
                          $q.localStorage.getItem("chainstore_store_local")
                            .storeBaseConfig.consume_base_moneySymbol
                        }}
                        {{ props.row.cid_goo_price }}
                      </q-td>
                      <q-td key="cid_sellingPrice" :props="props">
                        <span
                          v-if="parseInt(props.row.cid_packageId) > 0"
                          class="text-red"
                          >[套]</span
                        >
                        {{
                          $q.localStorage.getItem("chainstore_store_local")
                            .storeBaseConfig.consume_base_moneySymbol
                        }}
                        {{ props.row.cid_sellingPrice }}
                      </q-td>
                      <q-td key="cid_totalPrice" :props="props">
                        <span
                          v-if="parseInt(props.row.cid_packageId) > 0"
                          class="text-red"
                          >[套]</span
                        >
                        {{
                          $q.localStorage.getItem("chainstore_store_local")
                            .storeBaseConfig.consume_base_moneySymbol
                        }}
                        {{ props.row.cid_totalPrice }}
                      </q-td>
                      <q-td key="alreadyReturnNumber" :props="props">
                        {{ props.row.alreadyReturnNumber }}
                      </q-td>

                      <q-td
                        :key="
                          rowSpan(
                            props.row,
                            props.rowIndex,
                            'cid_packageName'
                          ) > 0
                            ? 'cid_packageName'
                            : ''
                        "
                        :rowspan="
                          rowSpan(props.row, props.rowIndex, 'cid_packageName')
                        "
                        :props="props"
                      >
                        <span v-if="props.row.cid_goodsOrService == 2"
                          >服务不能单品退货</span
                        >
                        <span v-else>
                          <q-btn
                            color="primary"
                            text-color="white"
                            label="退货"
                            v-if="
                              props.row.alreadyReturnNumber <
                                props.row.cid_consumeNumber
                            "
                            class="q-px-sm"
                            @click="singleReturn(props.row)"
                            unelevated
                          />
                          <span v-else>已退货</span>
                        </span>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <q-card class="q-pa-sm" flat>
                <q-card-section class="row q-pa-none">
                  <span class="row text-h6">
                    退货详情
                  </span>
                  <q-space />
                </q-card-section>

                <div class="row q-col-gutter-sm">
                  <div class="col-md-3 col-12">
                    <q-input
                      outlined
                      dense
                      stack-label
                      v-model="sc_return_amount"
                      disable
                      label="退货金额"
                    />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input
                      outlined
                      dense
                      stack-label
                      v-model="returnPoint"
                      disable
                      :label="
                        `扣除${
                          $q.localStorage.getItem('chainstore_store_local')
                            .storeBaseConfig.consume_base_integralUnit
                        }`
                      "
                    />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input
                      outlined
                      dense
                      stack-label
                      disable
                      v-model="returnTime"
                      label="退货时间"
                    />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-select
                      dense
                      outlined
                      stack-label
                      v-model="returnMode"
                      :options="returnStatusData"
                      option-value="value"
                      option-label="text"
                      label="退款方式"
                      emit-value
                      map-options
                    />
                  </div>
                </div>
              </q-card>
            </q-scroll-area>
          </div>

          <div
            class="col-shrink bg-white q-mt-xs text-center  q-gutter-sm q-py-md"
            v-if="returnCount < 1"
          >
            <q-checkbox
              dense
              v-model="printInvoiceStatus"
              label="打印小票"
              color="blue-8"
            />
            <q-btn
              color="primary"
              text-color="white"
              label="退货"
              class="q-px-xl"
              @click="setReturnData"
              unelevated
            />
            <q-btn
              color="grey"
              text-color="white"
              label="关闭"
              class="q-px-xl"
              @click="hideNowPage"
              v-close-popup
              unelevated
            />
          </div>
        </div>
      </q-card>
      <single-return
        ref="singleReturnRef"
        v-if="singleStatus"
        @getMethods="singleData"
      ></single-return>
    </q-dialog>
  </div>
</template>

<script>
import SingleReturn from './SingleReturn.vue'
export default {
  name: 'ReturnAllGoods',
  components: { SingleReturn },
  data () {
    return {
      sc_return_amount: '',
      returnPoint: 0,
      returnMode: 1,
      returnTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      invoiceData: {
        consumeInvoiceDetail: [],
        memberRechargeCountDetail: [],
        user: {}
      },
      returnStatusData: this.$store.state.invoice.returnStatusData,
      viewDetails: false,
      singleStatus: false,
      printInvoiceStatus: false,
      // 消费详情
      consumeData: [
        {
          label: '套餐名称',
          align: 'left',
          name: 'cid_packageName',
          classes: 'ellipsis'
        },
        {
          label: '消费项目',
          align: 'left',
          name: 'cid_goo_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '条码',
          name: 'cid_goo_code'
        },
        {
          label: '数量',
          align: 'center',
          name: 'cid_consumeNumber'
        },
        {
          label: '原价',
          name: 'cid_goo_price',
          align: 'left'
        },
        {
          label: '售价',
          align: 'center',
          name: 'cid_sellingPrice'
        },
        {
          label: '小计',
          name: 'cid_totalPrice',
          align: 'left'
        },
        {
          label: '已退数量',
          align: 'center',
          name: 'alreadyReturnNumber'
        },
        {
          label: '操作',
          name: 'id',
          align: 'center'
        }
      ],
      returnCount: 0
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    singleData (id) {
      this.singleStatus = false
      this.getViewData(id)
    },

    getViewData (id) {
      this.viewDetails = true
      if (id > 0) {
        this.$store
          .dispatch('returnGoods/getItem', id)
          .then(res => {
            if (res.code == 200) {
              if (res.data) {
                this.invoiceData = res.data
                this.sc_return_amount = this.invoiceData.sc_realMoneyCount
                let returnCount = 0
                this.invoiceData.consumeInvoiceDetail.forEach(val => {
                  returnCount += this.formatAmount(val.alreadyReturnNumber)
                })
                this.returnCount = this.formatAmount(returnCount)
              } else {
                this.invoiceData = []
              }
            }
          })
          .catch(error => {})
      }
    },
    setReturnData () {
      if (this.returnMode == 2) {
        if (this.invoiceData.member_id < 1) {
          this.$q.notify({
            message: '退货失败',
            caption:
              '原因：非会员不能退款到' +
              this.$q.localStorage.getItem('chainstore_store_local')
                .storeBaseConfig.consume_base_balanceUnit,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      }
      this.$q
        .dialog({
          title: '确定',
          message: '确定进行退货吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            printInvoiceStatus: this.printInvoiceStatus,
            invoiceData: this.invoiceData,
            returnMode: this.returnMode,
            sc_return_amount: this.sc_return_amount
          }
          this.$store
            .dispatch('returnGoods/setData', obj)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '退货成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.hideNowPage()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch(error => {})
        })
    },
    hideNowPage () {
      this.viewDetails = false
      this.$emit('getMethods')
    },
    singleReturn (data) {
      this.singleStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.singleReturnRef.init(data, this.invoiceData.member_id)
        }, 200)
      })
    },
    rowSpan (rows, rowIndexe, field) {
      const fields = [field]
      if (
        this.invoiceData &&
        this.invoiceData.consumeInvoiceDetail &&
        this.invoiceData.consumeInvoiceDetail.length > 0
      ) {
        const data = this.invoiceData.consumeInvoiceDetail
        const row = rows
        const rowIndex = rowIndexe
        const property = field
        const cellValue = row[property]
        if (cellValue && fields.includes(property)) {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          let countRowspan = 0
          if (prevRow && prevRow[property] === cellValue) {
            return countRowspan
          } else {
            countRowspan = 1
            while (nextRow && nextRow[property] === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }

            if (countRowspan > 1) {
              return countRowspan
            }
          }
        }
      }
      return 1
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
