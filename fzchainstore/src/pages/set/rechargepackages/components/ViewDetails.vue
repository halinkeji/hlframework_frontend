<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm"
      >
        <q-card-section class="row q-pa-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <div class="row text-h6 q-px-md">单据详情</div>
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
              时间:<span class="text-body1">{{ this.$q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm') }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              应付金额:<span class="text-body1">{{ invoiceData.sc_handleMoneyCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              实收金额:<span class="text-body1">{{ invoiceData.sc_realMoneyCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              规则优惠:<span class="text-body1">{{ invoiceData.sc_rulePaymentCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              卡券优惠:<span class="text-body1">{{ invoiceData.sc_couponPaymentCount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_rechargePaymentCount) }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付:<span class="text-body1">{{ formatAmount(invoiceData.sc_pointPaymentCount) }}</span>
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

        <div v-if="invoiceData.pointsCountRecord.length">
          <q-separator class="q-mt-md" />
          <q-table flat :title="`${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit}详情`" :data="invoiceData.pointsCountRecord" :columns="integralData" row-key="name" hide-bottom />
        </div>
        <div v-if="invoiceData.moneyCountRecord.length">
          <q-separator class="q-mt-md" />
          <q-table flat :title="`${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit}详情`" :data="invoiceData.moneyCountRecord" :columns="storedData" row-key="name" hide-bottom />
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
      dialogWidth: '1000px',
      invoiceData: {
        pointsCountRecord: [],
        moneyCountRecord: [],
        user: {}
      },
      viewDetails: false,
      integralData: [
        {
          label: '变更' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          align: 'left',
          field: 'pcr_pointsCount'
        },
        {
          align: 'left',
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
          align: 'left',
          field: 'pcr_operatingBehavior'
        }
      ],

      storedData: [
        {
          label: '变更' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          align: 'left',
          field: 'mcr_moneyCount'
        },
        {
          align: 'left',
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
          align: 'left',
          field: 'mcr_operatingBehavior'
        }
      ]
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
        return this.$q_date.formatDate(val * 1000, 'YYYY-MM-DD HH:mm')
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
              this.invoiceData = res.data ? res.data : []
            }
          })
          .catch((error) => {})
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
