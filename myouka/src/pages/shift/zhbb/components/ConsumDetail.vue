<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-lg text-subtitle2 q-mb-xs">
      <shift-date @getPeriod="init" />
      <div class="row q-gutter-xs q-mt-xs">
        <div class="col-12 col-md-3">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            clearable
            map-options
            :options="consumeTypeData"
            multiple
            v-model="searchFrom.sc_consumeType"
            dense
            label="请选择消费方式"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="text"
            emit-value
            map-options
            :options="type"
            v-model="searchFrom.consumePayType"
            dense
            label="选择支付方式"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-input label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-input label="请输入会员卡号|昵称" outlined v-model="searchFrom.memberText" dense />
        </div>
        <q-btn @click="getConsumeSummaryList()" color="primary" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" unelevated label="重置" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-white">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        :rowData="consumeData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
        :localeText="localeText"
        :context="context"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import AgInvoiceOperating from 'pages/set/invoice/components/AgInvoiceOperating.vue'
import ShiftDate from '../../time.vue'
export default {
  name: 'ConsumDetail',
  components: {
    AgInvoiceOperating,
    ShiftDate
  },
  data () {
    return {
      components: {
        AgInvoiceOperating
      },
      type: this.$store.state.invoice.consumePayType,
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      startTime: '',
      endTime: '',
      couponsType: '',
      searchFrom: {
        sc_consumeType: [],
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: ''
      },
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      consumeData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '单据号',
          field: 'sc_invoiceCode',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '消费方式',
          field: 'sc_consumeTypeName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '会员姓名',
          field: 'sc_memberName',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'sc_memberCardNum',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '应付总金额',
          field: 'sc_handleMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_handleMoneyCount > 0 ? p.data.sc_handleMoneyCount : 0
          }
        },
        {
          headerName: '实收金额',
          field: 'sc_realMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_realMoneyCount > 0 ? p.data.sc_realMoneyCount : 0
          }
        },

        {
          headerName: '支付状态',
          field: 'sc_pay_status_label',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '商家优惠',
          field: 'sc_rulePaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rulePaymentCount > 0 ? p.data.sc_rulePaymentCount : 0
          }
        },
        {
          headerName: '抹零金额',
          field: 'sc_rounding_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rounding_amount > 0 ? p.data.sc_rounding_amount : 0
          }
        },
        {
          headerName: '卡券优惠',
          field: 'sc_couponPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_couponPaymentCount > 0 ? p.data.sc_couponPaymentCount : 0
          }
        },

        {
          headerName: '支付方式',
          field: 'sc_consumePayType',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if ([0, 1, 2].indexOf(parseInt(p.data.sc_pay_status))) {
              return p.data.sc_consumePayType
            } else if ([3, 4].indexOf(parseInt(p.data.sc_pay_status))) {
              return p.data.sc_refund_type_label
            }
          }
        },

        {
          headerName: this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit + '支付',
          field: 'sc_rechargePaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_rechargePaymentCount > 0 ? p.data.sc_rechargePaymentCount : 0
          }
        },
        {
          headerName: this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit + '支付',
          field: 'sc_pointPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_pointPaymentCount > 0 ? p.data.sc_pointPaymentCount : 0
          }
        },
        {
          headerName: '银行卡支付',
          field: 'sc_blankPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_blankPaymentCount > 0 ? p.data.sc_blankPaymentCount : 0
          }
        },
        {
          headerName: '(刷卡)微信支付',
          field: 'sc_wechatPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_wechatPaymentCount > 0 ? p.data.sc_wechatPaymentCount : 0
          }
        },
        {
          headerName: '(刷卡)支付宝支付',
          field: 'sc_alipayPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_alipayPaymentCount > 0 ? p.data.sc_alipayPaymentCount : 0
          }
        },
        {
          headerName: '个人微信支付',
          field: 'sc_wechatPersonalPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_wechatPersonalPaymentCount > 0 ? p.data.sc_wechatPersonalPaymentCount : 0
          }
        },
        {
          headerName: '个人支付宝支付',
          field: 'sc_alipayPersonalPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_alipayPersonalPaymentCount > 0 ? p.data.sc_alipayPersonalPaymentCount : 0
          }
        },

        {
          headerName: '现金支付',
          field: 'sc_cashPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_cashPaymentCount > 0 ? p.data.sc_cashPaymentCount : 0
          }
        },

        {
          headerName: '其他支付',
          field: 'sc_otherPaymentCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_otherPaymentCount > 0 ? p.data.sc_otherPaymentCount : 0
          }
        },
        {
          headerName: '备注',
          field: 'sc_note',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          valueGetter: this.createdAt,
          pinned: 'right',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '油站',
          field: 'store.name',
          pinned: 'right',
          width: this.nowpx(0.08) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },
    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },

    // 获取汇总数据
    getConsumeSummaryList () {
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getConsumList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumeData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getConsumeSummaryList()
    },
    // 当前页
    currentChangeHandle (val) {
      console.log('PAGE', this.page)
      this.page.pageIndex = val
      this.getConsumeSummaryList()
    },

    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    resetBut () {
      this.searchFrom = {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: ''
      }

      this.getConsumeSummaryList()
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0.0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style></style>
