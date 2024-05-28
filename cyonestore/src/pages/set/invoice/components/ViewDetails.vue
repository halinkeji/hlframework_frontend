<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.6) + 'px',
          'max-width': parseInt($q.screen.width * 0.6) + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs row">
            <span class="text-h6 q-px-md"> 单据详情 </span>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </div>

          <div class="col-shrink q-pa-sm full-height bg-white">
            <q-scroll-area class="fit full-height">
              <div class="row">
                <div class="col-6">
                  <q-item v-if="invoiceData.sc_invoiceCode">
                    <q-item-section>
                      <q-item-label class="text-grey-8">单据号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_invoiceCode }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_memberCardNum">
                    <q-item-section>
                      <q-item-label class="text-grey-8">会员卡号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_memberCardNum }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_memberName">
                    <q-item-section>
                      <q-item-label class="text-grey-8">会员姓名</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_memberName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_handleMoneyCount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{
                        $q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_handleMoneyCount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">应付金额</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ invoiceData.sc_handleMoneyCount }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_realMoneyCount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">实收金额</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ invoiceData.sc_realMoneyCount }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_rulePaymentCount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商家优惠</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ invoiceData.sc_rulePaymentCount }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_couponPaymentCount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">卡券优惠</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ invoiceData.sc_couponPaymentCount }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_rounding_amount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">抹零金额</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ invoiceData.sc_rounding_amount }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.user_id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">操作员</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.user ? invoiceData.user.username : '操作员' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_note">
                    <q-item-section>
                      <q-item-label class="text-grey-8">备注</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_note }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="parseInt(invoiceData.sc_refund_type) > 0">
                    <q-item-section>
                      <q-item-label class="text-grey-8">已撤单</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_refund_type_label }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.hyryx && invoiceData.hyryx.id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">会员日营销优惠</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ invoiceData.hyryx.hr_discount_amount }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item v-for="(item, key) in paymentChannel" :key="key">
                    <q-item-section>
                      <q-item-label class="text-grey-8">{{ item.name }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">
                        {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}

                        <span v-if="item.channel == 'local'">
                          {{ formatAmount(invoiceData[item.field]) }}
                        </span>
                        <span v-if="item.channel == 'extend'">
                          {{ formatAmount(extendPay[item.key]) }}
                        </span>
                        <span v-if="item.channel == 'hlpay'">
                          {{ formatAmount(hlPay[item.key]) }}
                        </span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.sc_real_payment_cash">
                    <q-item-section>
                      <q-item-label class="text-grey-8">现金实收</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ this.formatAmount(invoiceData.sc_real_payment_cash) }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.sc_change_amount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">现金找零</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"
                        >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol
                        }}{{ this.formatAmount(invoiceData.sc_change_amount) }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
              </div>

              <q-card class="row" flat bordered v-if="invoiceData.cyOneOrderLink && invoiceData.cyOneOrderLink.id">

                <div class="col-6">
                  <q-item>
                    <q-item-section>
                      <q-item-label >桌号</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label
                        class="text-h6 text-weight-bold text-dark"
                        v-if="invoiceData.cyOneOrderLink.orl_desk_id > 0 && invoiceData.cyOneOrderLink.deskPosition"
                      >
                        {{ invoiceData.cyOneOrderLink.deskPosition.dp_name }}</q-item-label
                      >
                      <q-item-label class="text-h6 text-weight-bold text-dark" v-else> 暂无 </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-item-section>
                      <q-item-label >菜品数量</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold text-dark">
                        {{ formatAmount(invoiceData.cyOneOrderLink.orl_foods_quantity) }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-item-section>
                      <q-item-label >应付</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold text-dark"
                        >¥ {{ formatAmount(invoiceData.cyOneOrderLink.orl_total_amount) }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-item-section>
                      <q-item-label >优惠</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold text-dark"
                        >- ¥ {{ formatAmount(invoiceData.cyOneOrderLink.orl_discount_amount) }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item>
                    <q-item-section>
                      <q-item-label >实付</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold text-dark"
                        >¥ {{ formatAmount(invoiceData.cyOneOrderLink.orl_real_pay_amount) }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
              </q-card>

              <div class="q-mt-sm" v-if="invoiceData.cyOneOrderDetail && invoiceData.cyOneOrderDetail.length > 0">
                <q-table
                  title="消费详情"
                  :data="invoiceData.cyOneOrderDetail"
                  :columns="consumeOrderData"
                  row-key="id"
                  hide-bottom
                  flat
                  bordered
                  title-classs="bg-brown"
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="dor_food_packages_name" :props="props">
                        {{ props.row.dor_food_packages_name }}
                      </q-td>

                      <q-td key="dor_food_name" :props="props">
                        {{ props.row.dor_food_name }}
                      </q-td>
                      <q-td key="dor_quantity" :props="props">
                        {{ props.row.dor_quantity }}
                      </q-td>
                      <q-td key="dor_list_price" :props="props">
                        {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ props.row.dor_list_price }}
                      </q-td>
                      <q-td key="dor_member_level_price" :props="props">
                        {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ props.row.dor_member_level_price }}
                      </q-td>
                      <q-td key="dor_subtotal_amount" :props="props">
                        {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                        {{ props.row.dor_subtotal_amount }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>

              <div class="q-mt-sm" v-if="invoiceData.pointsCountRecord && invoiceData.pointsCountRecord.length > 0">
                <q-table
                  :title="`${$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit}详情`"
                  :data="invoiceData.pointsCountRecord"
                  :columns="integralData"
                  row-key="name"
                  flat
                  hide-bottom
                  bordered
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                  separator="cell"
                />
              </div>

              <div class="q-mt-sm" v-if="invoiceData.moneyCountRecord && invoiceData.moneyCountRecord.length > 0">
                <q-table
                  :title="`${$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit}详情`"
                  :data="invoiceData.moneyCountRecord"
                  :columns="storedData"
                  row-key="name"
                  hide-bottom
                  flat
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                  bordered
                  separator="cell"
                />
              </div>

              <div class="q-mt-sm" v-if="deskOrderRecordLink && deskOrderRecordLink.length > 0">
                <q-table
                  title="消费详情"
                  :data="deskOrderRecordLink"
                  :columns="foodRecordListData"
                  row-key="name"
                  flat
                  hide-bottom
                  bordered
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                  separator="cell"
                />
              </div>

              <div class="q-mt-sm" v-if="foodsRecord && foodsRecord.length > 0">
                <q-table
                  title="点单详情"
                  :data="foodsRecord"
                  :columns="foodListData"
                  row-key="name"
                  flat
                  hide-bottom
                  bordered
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                  separator="cell"
                />
              </div>

            </q-scroll-area>
          </div>
          <hl-local-printer ref="localPrinterRef" />
          <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
            <q-btn class="q-px-xl" unelevated label="打印" @click="printBut" color="warning" />
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
      invoiceData: {
        cyOneOrderDetail: [],
        memberRechargeCountDetail: [],
        pointsCountRecord: [],
        moneyCountRecord: [],
        consumeDetail: [],
        user: {},
        invoice: {}
      },
      returnGoodsDetail: [],
      viewDetails: false,
      // 消费详情
      consumeOrderData: [
        {
          label: '套餐名称',
          align: 'center',
          name: 'dor_food_packages_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          label: '名称',
          align: 'center',
          name: 'dor_food_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '数量',
          name: 'dor_quantity'
        },
        {
          label: '价格',
          align: 'center',
          name: 'dor_list_price'
        },

        {
          label: '会员价',
          name: 'dor_member_level_price',
          align: 'center'
        },

        {
          label: '小计',
          name: 'dor_subtotal_amount',
          align: 'center'
        }
      ],
      integralData: [
        {
          label: '变更' + this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'center',
          field: 'pcr_pointsCount'
        },
        {
          align: 'center',
          label: this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit + '来源',
          field: 'pcr_pointsCountSource'
        },
        {
          label: this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit + '状态',
          align: 'center',
          field: 'pcr_pointsCountStatus',
          format: this.formatStatus
        },

        {
          label: '时间',
          align: 'center',
          field: 'created_at',
          format: this.formatTime
        },
        {
          label: '操作行为',
          align: 'center',
          field: 'pcr_operatingBehavior'
        }
      ],
      storedData: [
        {
          label: '变更' + this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'mcr_moneyCount'
        },
        {
          align: 'center',
          label: this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit + '来源',
          field: 'mcr_moneyCountSource'
        },
        {
          label: this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit + '状态',
          align: 'center',
          field: 'mcr_moneyCountStatus',
          format: this.formatStatus
        },

        {
          label: '时间',
          align: 'center',
          field: 'created_at',
          format: this.formatTime
        },
        {
          label: '操作行为',
          align: 'center',
          field: 'mcr_operatingBehavior'
        }
      ],

      foodListData: [
        {
          label: '名称',
          align: 'center',
          name: 'dor_food_name',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          field: 'dor_food_name'
        },

        {
          align: 'center',
          label: '数量',
          name: 'dor_quantity',
          field: 'dor_quantity'
        },
        {
          label: '标价',
          align: 'center',
          name: 'dor_list_price',
          field: 'dor_list_price'
        },

        {
          label: '会员价',
          name: 'dor_member_level_price',
          align: 'center',
          field: 'dor_member_level_price'
        },

        {
          label: '限时折扣价',
          name: 'dor_time_limit_discount_price',
          align: 'center',
          field: 'dor_time_limit_discount_price'
        },

        {
          label: '售价',
          name: 'dor_selling_price',
          align: 'center',
          field: 'dor_selling_price'
        },

        {
          label: '小计金额',
          name: 'dor_subtotal_amount',
          align: 'center',
          field: 'dor_subtotal_amount'
        }
      ],
      foodRecordListData: [
        {
          label: '取餐码',
          align: 'center',
          name: 'orl_take_code',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          field: 'orl_take_code'
        },

        {
          align: 'center',
          label: '菜品数量',
          name: 'orl_foods_quantity',
          field: 'orl_foods_quantity'
        },
        {
          label: '人数',
          align: 'center',
          name: 'orl_people_number',
          field: 'orl_people_number'
        },

        {
          label: '总应付',
          name: 'orl_total_amount',
          align: 'center',
          field: 'orl_total_amount'
        },

        {
          label: '总实付',
          name: 'orl_real_pay_amount',
          align: 'center',
          field: 'orl_real_pay_amount'
        },

        {
          label: '总优惠',
          name: 'orl_discount_amount',
          align: 'center',
          field: 'orl_discount_amount'
        }

      ],
      invoiceId: '',
      paymentChannel: [],
      extendPay: {},
      hlPay: {},
      deskOrderRecordLink: [],
      foodsRecord: []
    }
  },
  components: {},
  mounted () {},

  computed: {},
  methods: {
    formatStatus (val) {
      if (parseInt(val) == 1) {
        return '增加'
      } else if (parseInt(val) == 2) {
        return '减少'
      }
      return '未知'
    },
    formatTime (val) {
      if (!val) {
        return ''
      } else {
        return this.$q_date.formatDate(val * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    getViewData (id) {
      this.viewDetails = true
      this.invoiceId = id
      if (this.$q.localStorage.getItem('cyonestore_store_local') && this.$q.localStorage.getItem('cyonestore_store_local').openPayment) {
        this.paymentChannel = this.$q.localStorage.getItem('cyonestore_store_local').openPayment
      }
      if (id > 0) {
        const obj = {
          id: id
        }
        this.$store
          .dispatch('invoice/getInvoiceView', obj)
          .then((res) => {
            if (res.code == 200) {
              if (res.data) {
                this.invoiceData = res.data
                this.setExtendPay(res.data)
                this.setHlPay(res.data)

                this.returnGoodsDetail = this.invoiceData && this.invoiceData.invoice ? this.invoiceData.invoice.returnGoodsDetail : []

                this.deskOrderRecordLink = this.invoiceData && this.invoiceData.deskOrderRecordLink ? [this.invoiceData.deskOrderRecordLink] : []

                this.foodsRecord = this.invoiceData && this.invoiceData.foodsRecord ? this.invoiceData.foodsRecord : []
              } else {
                this.invoiceData = []
              }
            }
          })
          .catch((error) => {})
      }
    },
    setHlPay (data) {
      const that = this
      if (data && data.hl_pay) {
        this.hlPay = {}
        JSON.parse(data.hl_pay).forEach(function (item) {
          that.hlPay[item.key] = item.value
        })
      }
    },
    setExtendPay (data) {
      const that = this
      if (data && data.extend_pay) {
        this.extendPay = {}
        JSON.parse(data.extend_pay).forEach(function (item) {
          that.extendPay[item.key] = item.value
        })
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
    printBut () {
      const obj = {
        id: this.invoiceId
      }
      this.$store
        .dispatch('invoice/getInvoicePrint', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '补打成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
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
        .catch((error) => {})
    }
  }
}
</script>
