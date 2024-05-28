<template>
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
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
                      {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}

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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
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
                      >{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                      }}{{ this.formatAmount(invoiceData.sc_change_amount) }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <div class="q-mt-sm" v-if="invoiceData.consumeInvoiceDetail && invoiceData.consumeInvoiceDetail.length > 0">
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
                :pagination="{
                  rowsPerPage: 0,
                }"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="cid_goo_code" :props="props">
                      {{ props.row.cid_goo_code }}
                    </q-td>
                    <q-td key="cid_consumeNumber" :props="props">
                      {{ props.row.cid_consumeNumber }}
                    </q-td>
                    <q-td key="cid_goo_price" :props="props">
                      {{ props.row.cid_goo_price }}
                    </q-td>
                    <q-td key="cid_sellingPrice" :props="props">
                      {{ props.row.cid_sellingPrice }}
                    </q-td>
                    <q-td key="cid_memberPrice" :props="props">
                      {{ props.row.cid_memberPrice }}
                    </q-td>

                    <q-td key="cid_totalPrice" :props="props">
                      {{
                        formatAmount(
                          formatAmount(props.row.cid_consumeNumber * props.row.cid_goo_price) -
                            formatAmount(props.row.cid_consumeNumber * props.row.cid_sellingPrice)
                        )
                      }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>

            <div class="q-mt-sm" v-if="invoiceData.fzConsumeInvoiceDetail && invoiceData.fzConsumeInvoiceDetail.length > 0">
              <q-table
                title="消费详情"
                :data="invoiceData.fzConsumeInvoiceDetail"
                :columns="fzConsumeData"
                row-key="id"
                hide-bottom
                flat
                bordered
                title-classs="bg-brown"
                separator="vertical"
                :pagination="{
                  rowsPerPage: 0,
                }"
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
                      {{
                        formatAmount(
                          formatAmount(props.row.cid_consumeNumber * props.row.cid_price) -
                            formatAmount(props.row.cid_consumeNumber * props.row.cid_sellingPrice)
                        )
                      }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>

            <div class="q-mt-sm" v-if="invoiceData.pointsCountRecord && invoiceData.pointsCountRecord.length > 0">
              <q-table
                :title="`${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit}详情`"
                :data="invoiceData.pointsCountRecord"
                :columns="integralData"
                row-key="name"
                flat
                hide-bottom
                bordered
                :pagination="{
                  rowsPerPage: 0,
                }"
                separator="vertical"
              />
            </div>
            <div class="q-mt-sm" v-if="invoiceData.moneyCountRecord && invoiceData.moneyCountRecord.length > 0">
              <q-table
                :title="`${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit}详情`"
                :data="invoiceData.moneyCountRecord"
                :columns="storedData"
                row-key="name"
                hide-bottom
                flat
                :pagination="{
                  rowsPerPage: 0,
                }"
                bordered
                separator="vertical"
              />
            </div>
            <div class="q-mt-sm" v-if="invoiceData.invoice && invoiceData.invoice">
              <q-table
                title="退货详情"
                :data="returnGoodsDetail"
                :columns="returnGoodsData"
                row-key="name"
                hide-bottom
                flat
                bordered
                :pagination="{
                  rowsPerPage: 0,
                }"
                separator="vertical"
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
</template>

<script>
export default {
  name: 'ViewDetails',
  data () {
    return {
      invoiceData: {
        consumeInvoiceDetail: [],
        memberRechargeCountDetail: [],
        pointsCountRecord: [],
        moneyCountRecord: [],
        consumeDetail: [],
        user: {},
        invoice: {},
        fzConsumeInvoiceDetail: {}
      },
      returnGoodsDetail: [],
      viewDetails: false,
      // 消费详情
      consumeData: [
        {
          label: '套餐名称',
          align: 'center',
          name: 'cid_packageName',
          classes: 'ellipsis'
        },
        {
          label: '消费项目',
          align: 'center',
          name: 'cid_goo_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '编码',
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
          label: '优惠小计',
          name: 'cid_totalPrice',
          align: 'left'
        }
      ],
      integralData: [
        {
          label: '变更' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'center',
          field: 'pcr_pointsCount'
        },
        {
          align: 'center',
          label: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit + '来源',
          field: 'pcr_pointsCountSource'
        },
        {
          label: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit + '状态',
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
          label: '变更' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'mcr_moneyCount'
        },
        {
          align: 'center',
          label: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '来源',
          field: 'mcr_moneyCountSource'
        },
        {
          label: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '状态',
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

      returnGoodsData: [
        {
          label: '退货项目',
          align: 'center',
          name: 'rgd_goods_name',
          field: 'rgd_goods_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          label: '退货数量',
          align: 'center',
          name: 'rgd_return_quantity',
          field: 'rgd_return_quantity'
        },

        {
          label: '售价',
          align: 'center',
          name: 'rgd_selling_price',
          field: 'rgd_selling_price'
        },
        {
          label: '小计',
          name: 'rgd_return_subtotal_price',
          field: 'rgd_return_subtotal_price',
          align: 'center'
        },
        {
          label: '备注',
          name: 'rgd_remarks',
          field: 'rgd_remarks',
          align: 'center'
        }
      ],
      consumeBasisColumn: [
        {
          label: '消费单据号',
          align: 'left',
          field: 'sc_invoiceCode'
        },
        {
          align: 'left',
          label: '会员卡号',
          field: 'sc_memberCardNum'
        },
        {
          label: '会员姓名',
          align: 'left',
          field: 'sc_memberName'
        },
        {
          label: '时间',
          align: 'left',
          field: 'created_at',
          format: this.formatTime
        },
        {
          label: '应付金额',
          align: 'left',
          field: 'sc_handleMoneyCount'
        },
        {
          label: '实收金额',
          align: 'left',
          field: 'sc_realMoneyCount'
        },
        {
          label: '获得' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'left',
          field: 'sc_getPoint'
        }
      ],
      consumPayColumn: [
        {
          label: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '支付',
          align: 'left',
          field: 'sc_rechargePaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          align: 'left',
          label: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit + '支付',
          field: 'sc_pointPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '银行卡支付',
          align: 'left',
          field: 'sc_blankPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '(刷卡)微信支付',
          align: 'left',
          field: 'sc_wechatPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '(刷卡)支付宝支付',
          align: 'left',
          field: 'sc_alipayPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '个人微信支付',
          align: 'left',
          field: 'sc_wechatPersonalPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '个人支付宝支付',
          align: 'left',
          field: 'sc_alipayPersonalPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '现金支付',
          align: 'left',
          field: 'sc_cashPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '其他支付',
          align: 'left',
          field: 'sc_otherPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        }
      ],
      // 消费详情
      fzConsumeData: [
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
          label: '条码',
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
          label: '优惠小计',
          name: 'cid_totalPrice',
          align: 'left'
        }
      ],
      invoiceId: '',
      paymentChannel: [],
      extendPay: {},
      hlPay: {}
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
      if (this.$q.localStorage.getItem('fzchainstore_store_local') && this.$q.localStorage.getItem('fzchainstore_store_local').openPayment) {
        this.paymentChannel = this.$q.localStorage.getItem('fzchainstore_store_local').openPayment
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
