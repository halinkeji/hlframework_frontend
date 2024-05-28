<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width:this.$q.screen.width * 0.8 + 'px',
          'max-width': this.$q.screen.width * 0.8 + 'px',
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
          <span class="row text-h6 q-px-md">
            单据详情
          </span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-card-section>
          <q-item-label class="row q-gutter-y-md">
            <div class="col col-md-3 col-sm-6 col-xs-12">
              消费单据号:<span class="text-body1">{{ invoiceData.sc_invoiceCode }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              会员卡号:<span class="text-body1">{{ invoiceData.sc_memberCardNum }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              会员姓名:<span class="text-body1">{{ invoiceData.sc_memberName }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              时间:<span class="text-body1">{{ this.$q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              应付金额:<span class="text-body1">{{ invoiceData.sc_handleMoneyCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              实收金额:<span class="text-body1">{{ invoiceData.sc_realMoneyCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              抹零:<span class="text-body1">{{ formatAmount(invoiceData.sc_handleMoneyCount - invoiceData.sc_realMoneyCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              规则优惠:<span class="text-body1">{{ invoiceData.sc_rulePaymentCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              卡券优惠:<span class="text-body1">{{ invoiceData.sc_couponPaymentCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_rechargePaymentCount) }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_pointPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              银行卡支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_blankPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              (刷卡)微信支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_wechatPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              (刷卡)支付宝支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_alipayPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              个人微信支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_wechatPersonalPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              个人支付宝支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_alipayPersonalPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              现金支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_cashPaymentCount) }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              其他支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_otherPaymentCount) }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              操作员:<span class="text-body1">{{ invoiceData.user ? invoiceData.user.username : '操作员' }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              备注:<span class="text-body1">{{ invoiceData.sc_note }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12 text-red" v-if="parseInt(invoiceData.sc_refund_type) > 0">
              已撤单:<span class="text-body1">{{ invoiceData.sc_refund_type_label }}</span>
            </div>
          </q-item-label>
        </q-card-section>
        <div class="q-mt-sm" v-if="invoiceData.marketAmount && invoiceData.marketAmount.length > 0 && invoiceData.marketAmount[0].pmr_amount > 0">
          <q-table
            title="佣金详情"
            :data="invoiceData.marketAmount"
            :columns="marketAmountData"
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
        <div class="q-mt-sm" v-if="invoiceData.pointsCountRecord && invoiceData.pointsCountRecord.length > 0">
          <q-table
            :title="`${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit}详情`"
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
            :title="`${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit}详情`"
            :data="invoiceData.moneyCountRecord"
            :columns="balanceData"
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
        <div class="q-mt-sm" v-if="invoiceData.memberRechargeCountDetail && invoiceData.memberRechargeCountDetail.length > 0">
          <q-table
            title="次卡详情"
            :data="invoiceData.memberRechargeCountDetail"
            :columns="countData"
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
        <div class="q-mt-sm" v-if="invoiceData.rechargeTimeDetail && invoiceData.rechargeTimeDetail.length > 0">
          <q-table
            title="计时卡详情"
            :data="invoiceData.rechargeTimeDetail"
            :columns="timingData"
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
        <div class="q-mt-sm" v-if="invoiceData.couponActivityRecord && invoiceData.couponActivityRecord.length > 0">
          <q-table
            title="优惠券详情"
            :data="invoiceData.couponActivityRecord"
            :columns="couponData"
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
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'ViewDetails',
  components: {},
  data () {
    return {
      invoiceData: {},
      viewDetails: false,
      // 佣金详情
      marketAmountData: [
        {
          label: '变更佣金',
          align: 'center',
          field: 'pmr_amount'
        },
        {
          align: 'center',
          label: '佣金来源',
          format: this.amountFrom
        },
        {
          label: '佣金状态',
          align: 'center',
          format: this.amountStatus
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
          format: this.operate
        }
      ],
      integralData: [
        {
          label: '变更' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'center',
          field: 'pcr_pointsCount'
        },
        {
          align: 'center',
          label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit + '来源',
          field: 'pcr_pointsCountSource'
        },
        {
          label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit + '状态',
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

      balanceData: [
        {
          label: '变更' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'mcr_moneyCount'
        },
        {
          align: 'center',
          label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '来源',
          field: 'mcr_moneyCountSource'
        },
        {
          label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '状态',
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
      // 次卡详情
      countData: [
        {
          label: '项目名称',
          align: 'center',
          field: 'mrc_goodsName'
        },
        {
          align: 'center',
          label: '项目次数',
          field: 'mrc_count'
        },
        {
          label: '时间',
          align: 'center',
          field: 'created_at',
          format: this.formatTime
        }
      ],
      // 计时卡详情
      timingData: [
        {
          label: '项目名称',
          align: 'center',
          field: 'rtd_goods_name'
        },
        {
          align: 'center',
          label: '时长(分钟)',
          field: 'rtd_duration_total'
        },
        {
          label: '时间',
          align: 'center',
          field: 'created_at',
          format: this.formatTime
        }
      ],
      // 卡券详情
      couponData: [
        {
          label: '卡券名称',
          align: 'center',
          field: 'coupon',
          format: this.couponName
        },
        {
          label: '卡券类型',
          align: 'center',
          field: 'cmd_type_name'
        },
        {
          align: 'center',
          label: '卡券有效期',
          field: 'coupon',
          format: this.cardDate
        },
        {
          label: '时间',
          align: 'center',
          field: 'created_at',
          format: this.formatTime
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    amountFrom () {
      return '分佣'
    },
    amountStatus () {
      return '增加'
    },
    formatStatus (val) {
      if (parseInt(val) == 1) {
        return '增加'
      } else if (parseInt(val) == 2) {
        return '减少'
      }
      return '未知'
    },
    operate () {
      return '分佣所得佣金'
    },
    couponName (val) {
      return val.cou_title
    },
    cardDate (val) {
      if (val.cou_dateType == 1) {
        return (
          this.$q_date.formatDate(val.cou_startTime * 1000, 'YYYY-MM-DD') +
          ' 至 ' +
          this.$q_date.formatDate(val.cou_endTime * 1000, 'YYYY-MM-DD') +
          ' 有效'
        )
      } else if (val.cou_dateType == 2) {
        let endText = ''
        switch (parseInt(val.data.cou_endDay)) {
          case 1:
            endText = '年'
            break
          case 2:
            endText = '季'
            break
          case 3:
            endText = '月'
            break
          case 4:
            endText = '周'
            break
          case 5:
            endText = '天'
            break
        }

        return '领取后' + val.data.cou_startDay + endText + '内有效'
      } else {
        return ''
      }
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
              } else {
                this.invoiceData = []
              }
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
    }
  }
}
</script>
