<template>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <div class="row text-h6 q-px-md">
          单据详情
        </div>
        <q-card-section>
          <q-item-label class="row q-gutter-y-md">
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发票单据号:<span class="text-body1">{{ invoiceData.pr_invoice_code }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发票代码:<span class="text-body1">{{ invoiceData.pr_invoice_code_info }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发票号码:<span class="text-body1">{{ invoiceData.pr_invoice_number }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发票总金额:<span class="text-body1">{{ invoiceData.pr_invoice_amount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              开具发票金额:<span class="text-body1">{{ invoiceData.pr_total_amount }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发票类型:<span class="text-body1">{{ invoiceData.pr_type == 1 ? '个人/事业单位' : '单位' }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发票抬头:<span class="text-body1">{{ invoiceData.pr_title_name }}</span>
            </div>

            <div class="col col-md-3 col-sm-6 col-xs-12">
              联系电话:<span class="text-body1">{{ invoiceData.pr_phone }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12" v-if="invoiceData.pr_type == 2">
              纳税人识别号:<span class="text-body1">{{ invoiceData.pr_identification_number }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              发送邮箱:<span class="text-body1">{{ invoiceData.pr_email }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12" v-if="invoiceData.pr_type == 2 && invoiceData.pr_bank">
              开户行:<span class="text-body1">{{ invoiceData.pr_bank }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12" v-if="invoiceData.pr_type == 2 && invoiceData.pr_bank_number">
              银行账号:<span class="text-body1">{{ invoiceData.pr_bank_number }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12" v-if="invoiceData.pr_type == 2 && invoiceData.pr_address">
              单位地址:<span class="text-body1">{{ invoiceData.pr_address }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              时间:<span class="text-body1">{{ this.$q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12" v-if="invoiceData.user">
              操作员:<span class="text-body1">{{ invoiceData.user.username }}</span>
            </div>
          </q-item-label>
        </q-card-section>

        <div v-if="invoiceData.record.length">
          <q-separator class="q-mt-md" />
          <q-table title="开票详情" :data="invoiceData.record" :columns="invoiceInfoData" row-key="name" hide-bottom />
        </div>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  name: 'ViewDetails',
  data () {
    return {
      dialogWidth: '1000px',
      invoiceData: {
        user: {}
      },
      viewDetails: false,
      invoiceInfoData: [
        {
          label: '单据号',
          align: 'left',
          field: 'invoice',
          format: this.invoiceCode
        },
        {
          align: 'left',
          label: '消费类型',
          field: 'invoice',
          format: this.consumeTypeName
        },
        {
          label: '实收金额',
          align: 'center',
          field: 'invoice',
          format: this.realMoneyCount
        },
        {
          label: '备注',
          align: 'left',
          field: 'invoice',
          format: this.note
        },
        {
          label: '时间',
          align: 'center',
          field: 'invoice',
          format: this.formatTime
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
    realMoneyCount (val) {
      return val.sc_realMoneyCount
    },

    invoiceCode (val) {
      return val.sc_invoiceCode
    },
    consumeTypeName (val) {
      return val.sc_consumeTypeName
    },
    formatTime (val) {
      if (!val) {
        return ''
      } else {
        return this.$q_date.formatDate(val.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    note (val) {
      return val.sc_note
    },
    getViewData (id) {
      this.viewDetails = true
      if (id > 0) {
        this.$store
          .dispatch('receipt/getRecordItemData', id)
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
