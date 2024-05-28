<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="invoiceCode" label="请输入订单编号" class="col-12 col-md-2" />
          <q-input outlined dense v-model="memberInfo" label="请输入会员姓名|卡号|手机号" class="col-12 col-md-2" />
           <q-input outlined dense v-model="goodsName" label="请输入商品名称" class="col-12 col-md-2" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center hl-order"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="orderList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="130"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
    <view-details v-if="viewDetailsStatus" ref="viewDetails"></view-details>
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
import AmountInfo from './components/AmountInfo'
import ViewDetails from './ViewDetails'
export default {
  name: 'fxzxOrder',
  components: {
    AgOperate,
    AmountInfo,
    ViewDetails
  },
  data () {
    return {
      viewDetailsStatus: false,
      invoiceCode: '',
      memberInfo: '',
      goodsName: '',
      amountStatus: '',
      context: '',
      orderList: [],
      statusOptions: [
        { value: -1, label: '作废' },
        { value: 1, label: '待入账' },
        { value: 2, label: '已入账' }
      ],
      typeOptions: [
        { value: 1, label: '绑定' },
        { value: 2, label: '首次消费' },
        { value: 3, label: '消费' }
      ],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '订单号',
          field: 'pfo_invoice_code',
          valueGetter: (p) => {
            return p.data.pfo_invoice_code
          },
          width: this.nowpx(0.13) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '会员姓名',
          field: 'pfo_invoice_code',
          valueGetter: (p) => {
            return p.data.pfo_member_name
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'fgr_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '商品售价',
          field: 'fgr_selling_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品数量',
          field: 'fgr_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '佣金信息',
          cellRendererFramework: 'AmountInfo',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '佣金状态',
          valueGetter: (p) => {
            if (parseInt(p.data.fxzxRecord.pfr_status) == -1) {
              return '作废'
            } else if (parseInt(p.data.fxzxRecord.pfr_status) == 1) {
              return '待入账'
            } else if (parseInt(p.data.fxzxRecord.pfr_status) == 2) {
              return '已入账'
            } else {
              return ''
            }
          },
          field: 'pfo_invoice_code',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '操作',
          field: 'pfo_invoice_code',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-order': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        invoiceCode: this.invoiceCode,
        memberInfo: this.memberInfo,
        amountStatus: this.amountStatus,
        goodsName: this.goodsName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fxzx/getFxzxOrderList', params)
        .then((res) => {
          if (res.code == 200) {
            this.orderList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    },
    // 查看详情
    showOrderDetail (id) {
      this.viewDetailsStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.viewDetails.getViewData(id)
        }, 200)
      })
    },
    rowSpan (params) {
      const fields = ['pfo_invoice_code']
      const data = this.orderList
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
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
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.invoiceCode = ''
      this.memberInfo = ''
      this.amountStatus = ''
      this.goodsName = ''
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
<style>
.hl-order .cell-span-order {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
