<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent full-height>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
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
        </q-card-section>
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
                  "YYYY-MM-DD HH:mm"
                )
              }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              应付金额:<span class="text-body1">{{
                invoiceData.sc_handleMoneyCount
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              实收金额:<span class="text-body1">{{
                invoiceData.sc_realMoneyCount
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              规则优惠:<span class="text-body1">{{
                invoiceData.sc_rulePaymentCount
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              卡券优惠:<span class="text-body1">{{
                invoiceData.sc_couponPaymentCount
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_rechargePaymentCount)
              }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
             {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_pointPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              银行卡支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_blankPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              (刷卡)微信支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_wechatPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              (刷卡)支付宝支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_alipayPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              个人微信支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_wechatPersonalPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              个人支付宝支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_alipayPersonalPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              现金支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_cashPaymentCount)
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              其他支付:<span class="text-body1">{{
                this.formatAmount(invoiceData.sc_otherPaymentCount)
              }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              操作员:<span class="text-body1">{{
                invoiceData.user ? invoiceData.user.username : "操作员"
              }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              备注:<span class="text-body1">{{ invoiceData.sc_note }}</span>
            </div>
          </q-item-label>
        </q-card-section>

        <div class="q-mt-sm" v-if="invoiceData.consumeInvoiceDetail.length > 0">
          <q-table
            title="消费详情"
            :data="invoiceData.consumeInvoiceDetail"
            :columns="consumeData"
            row-key="id"
            hide-bottom
            flat
            bordered
            title-classs="bg-brown"
            separator="vertical"
          >
            <template v-slot:body="props">
              <q-tr :props="props">

                <q-td key="cid_archives_name" :props="props">
                  <div>
                    {{ props.row.cid_archives_name }}
                    <q-tooltip> {{ props.row.cid_archives_name }}</q-tooltip>
                  </div>
                </q-td>
                <q-td key="cid_color_name" :props="props">
                  {{ props.row.cid_color_name }}
                </q-td>
                <q-td key="cid_size_name" :props="props">
                  {{ props.row.cid_size_name }}
                </q-td>
                <q-td key="cid_skc_code" :props="props">
                  {{ props.row.cid_skc_code }}
                </q-td>
                <q-td key="cid_consumeNumber" :props="props">
                  {{ props.row.cid_consumeNumber }}
                </q-td>
                <q-td key="cid_price" :props="props">
                  {{ props.row.cid_price }}
                </q-td>
                <q-td key="cid_sellingPrice" :props="props">

                  {{ props.row.cid_sellingPrice }}
                </q-td>
                <q-td key="cid_discount_rate" :props="props">

                  {{ props.row.cid_discount_rate }}
                </q-td>
                <q-td key="cid_discount_amount" :props="props">
                  {{ props.row.cid_discount_amount }}
                </q-td>
                <q-td key="cid_memberPrice" :props="props">
                  {{ props.row.cid_memberPrice }}
                </q-td>

                <q-td key="cid_totalPrice" :props="props">
                    {{ props.row.cid_totalPrice }}
                </q-td>
                <q-td key="alreadyReturnNumber" :props="props">
                  {{ props.row.alreadyReturnNumber }}
                </q-td>

                <q-td key="id" :props="props"
                >
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

                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <q-card class="q-pa-sm">
          <q-card-section class="row q-pa-none">
            <span class="row text-h6 q-px-md">
              退货详情
            </span>
            <q-space />
          </q-card-section>

          <div class="row">
            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                stack-label
                class="q-pa-none q-mx-lg q-mb-lg"
                v-model="sc_return_amount"
                disable
                label="退货金额"
              />
            </div>
            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                stack-label
                class="q-pa-none q-mx-lg q-mb-lg"
                v-model="returnPoint"
                disable
                :label="`扣除${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-12">
              <q-select
                dense
                outlined
                stack-label
                class="q-pa-none q-mx-lg q-mb-lg"
                v-model="returnMode"
                :options="returnStatusData"
                option-value="value"
                option-label="text"
                label="退款方式"
                emit-value
                map-options
              />
            </div>
            <div class="col-md-6 col-12">
              <q-input
                outlined
                dense
                stack-label
                disable
                class="q-pa-none q-mx-lg q-mb-lg"
                v-model="returnTime"
                label="退货时间"
              />
            </div>
          </div>
          <q-card-actions
            align="right"
            class="text-primary"
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
              class="q-px-sm q-ml-sm"
              @click="setReturnData"
              unelevated
            />
            <q-btn
              color="grey"
              text-color="white"
              label="返回"
              class="q-px-sm"
              @click="hideNowPage"
              v-close-popup
              unelevated
            />
          </q-card-actions>
        </q-card>
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
      dialogWidth: '1400px',
      sc_return_amount: '',
      returnPoint: 0,
      returnMode: '',
      returnTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
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
          label: '消费项目',
          align: 'center',
          name: 'cid_archives_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '颜色',
          name: 'cid_color_name'
        },
        {
          align: 'center',
          label: '尺码',
          name: 'cid_size_name'
        },
        {
          align: 'center',
          label: '编码',
          name: 'cid_skc_code'
        },
        {
          label: '数量',
          align: 'center',
          name: 'cid_consumeNumber'
        },
        {
          label: '原价',
          name: 'cid_price',
          align: 'left'
        },
        {
          label: '售价',
          align: 'center',
          name: 'cid_sellingPrice'
        },
        {
          label: '折扣率',
          align: 'center',
          name: 'cid_discount_rate'
        },
        {
          label: '折扣额',
          align: 'center',
          name: 'cid_discount_amount'
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
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.8) + 'px'
    }
  },
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
            caption: '原因：非会员不能退款到' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      }
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
    },
    hideNowPage () {
      this.viewDetails = false
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
