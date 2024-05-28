<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md text-subtitle2 q-mb-xs">
      <shift-date @getPeriod="init" />
      <div class="row q-mt-xs q-gutter-xs">
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
            use-chips
            label="请选择消费方式"
          />
        </div>

        <q-btn @click="getSummaryList()" color="primary" unelevated label="搜索" />
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
        @first-data-rendered="onFirstDataRendered"
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
import ShiftDate from '../../time.vue'
export default {
  name: 'ConsumDetail',
  components: {
    ShiftDate
  },
  data () {
    return {
      type: this.$store.state.invoice.consumePayType,
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      startTime: '',
      endTime: '',
      couponsType: '',
      searchFrom: {
        sc_consumeType: []
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
      columnDefs: [
        {
          headerName: '消费单号',
          field: 'sc_invoiceCode',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '消费类型',
          field: 'rcr_consume_type_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'rcr_member_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'rcr_member_card_num',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绩效金额',
          field: 'rcr_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '应付金额',
          field: 'rcr_handle_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实付金额',
          field: 'rcr_real_amount',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '卡券优惠',
          field: 'rcr_coupon_payment_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcr_coupon_payment_amount > 0 ? p.data.rcr_coupon_payment_amount : 0
          }
        },
        {
          headerName: '商家优惠',
          field: 'rcr_rule_payment_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcr_rule_payment_amount > 0 ? p.data.rcr_rule_payment_amount : 0
          }
        },

        {
          headerName: '加油优惠',
          field: 'rcr_refuel_discount_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcr_refuel_discount_amount > 0 ? p.data.rcr_refuel_discount_amount : 0
          }
        },
        {
          headerName: '专车优惠',
          field: 'rcr_zcrz_price_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rcr_zcrz_price_amount > 0 ? p.data.rcr_zcrz_price_amount : 0
          }
        },

        {
          headerName: '消费时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText

    }
  },
  created () {},
  computed: {},
  mounted () {

  },
  methods: {
    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },
    // 获取汇总数据
    getSummaryList () {
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('shift/getStaffList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumeData = res.data && res.data.list ? res.data.list : []
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
      this.getSummaryList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getSummaryList()
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
        sc_consumeType: []
      }
      this.getSummaryList()
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
