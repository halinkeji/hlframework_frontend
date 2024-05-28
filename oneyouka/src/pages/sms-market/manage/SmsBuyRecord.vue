<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-xs text-subtitle2 q-pb-md">
      <div class="row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined clearable v-model="order_no" label="请输入单据号" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            v-model="orderStatus"
            :options="[
              { label: '未支付', value: 3 },
              { label: '支付成功', value: 1 },
              { label: '支付失败', value: 2 },
            ]"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            clearable
            label="请选择订单状态"
          />
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getBuySmsInvoiceList" />
        <q-btn color="warning" unelevated label="重置" @click="resetSearch" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height ">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="buySmsInvoiceListData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
        :singleClickEdit="true"
        :context="context"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.page"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmsBuyRecord',
  components: {},
  data () {
    return {
      buySmsInvoiceListData: [],
      currentLibId: 0,
      tab: 'today',
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      context: null,
      page: {
        page: 1,
        pSize: 20,
        pageTotal: 0
      },
      orderStatus: '',
      order_no: '',
      columnDefs: [
        {
          headerName: '单据号',
          field: 'ci_order_no',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '短信数量',
          field: 'sbi_sms_quantity',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '实付金额',
          field: 'sbi_real_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '应付金额',
          field: 'sbi_handle_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '支付状态',
          field: 'ci_status',
          filter: false,
          valueGetter: (p) => {
            if (parseInt(p.data.ci_status) == -1) {
              return '未支付'
            } else if (parseInt(p.data.ci_status) == -2) {
              return '支付超时'
            } else if (parseInt(p.data.ci_status) == 1) {
              return '支付成功'
            } else if (parseInt(p.data.ci_status) == 2) {
              return '支付失败'
            }
            return ''
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '购买时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '备注',
          field: 'sbi_note',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        }
      ]
    }
  },
  created () {},
  computed: {},
  beforeMount () {},
  mounted () {
    this.context = this
    this.getBuySmsInvoiceList()
  },
  methods: {
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getBuySmsInvoiceList()
    },

    currentChangeHandle (val) {
      this.page.page = val
      this.getBuySmsInvoiceList()
    },
    resetSearch () {
      this.orderStatus = ''
      this.order_no = ''
      this.$nextTick(() => {
        this.getBuySmsInvoiceList()
      })
    },
    getBuySmsInvoiceList () {
      const obj = {
        page: this.page.page,
        pSize: this.page.pSize,
        orderStatus: this.orderStatus,
        order_no: this.order_no
      }
      this.$store
        .dispatch('smsMarket/getBuySmsInvoiceList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.buySmsInvoiceListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
