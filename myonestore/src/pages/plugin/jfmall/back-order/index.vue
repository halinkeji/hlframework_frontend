<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm">
        <div class="q-gutter-x-xs row ">
          <div class="col-12 col-md-2">
             <q-input  label="订单号" outlined v-model="text" dense />
          </div>

          <div class="col-12 col-md-2">
            <q-select
              outlined
              v-model="stateId"
              :options="state"
              dense
              label="订单状态"
              emit-value
              map-options
              option-value="id"
              option-label="title"
            />
          </div>

          <q-btn color="primary"  unelevated label="搜索" @click="getOrder" />
          <q-btn  unelevated color="warning" label="重置" @click="clean" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="order"
          :rowDragManaged="true"
          rowSelection="multiple"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="55"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :rowMultiSelectWithClick="true"
          :singleClickEdit="true"
          @first-data-rendered="onFirstDataRendered"
          :context="context"
          :localeText="localeText"
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
          :page-size="page.pSize"
          :total="page.totalCount"
        ></hl-pagination>
      </div>
    </div>

    <order-detail @operateSuccess="getOrder" v-if="orderDetailDialog" ref="orderDetailRef" />
    <hl-wuliu-create-order @createOrderSucceed="getOrder" @closeDialog="getOrder" v-if="wuliuDialogStatus" ref="wuliuCreateOrderRef" />
  </q-page>
</template>

<script>
import AgType from './components/AgType'
import AgOperator from './components/AgOperator'
import OrderDetail from './components/Detail'
export default {
  name: 'jfmallBackOrder',
  components: {
    AgOperator,
    AgType,
    OrderDetail
  },
  data () {
    return {
      components: {
        AgOperator,
        AgType
      },
      text: '',
      state: [
        {
          id: '8',
          title: '申请退货退款'
        },
        {
          id: '9',
          title: '申请仅退款'
        },
        {
          id: '10',
          title: '商家拒绝退款退货申请'
        },
        {
          id: '11',
          title: '商家同意退款退货申请'
        },
        {
          id: '12',
          title: '订单回寄成功'
        },
        {
          id: '13',
          title: '订单退款成功'
        }

      ],
      stateObject: {
        8: '申请退货退款',
        9: '申请仅退款',
        10: '商家拒绝退款退货申请',
        11: '商家同意退款退货申请',
        12: '订单回寄成功',
        13: '订单退款成功'

      },
      gridOptions: {},
      context: null,
      columnDefs: [
        // 表格列数据
        {
          width: this.nowpx(0.1) + 'px',
          headerName: '支付订单号',
          field: 'orderInfo.jo_order'
        },
        {
          headerName: '会员昵称',
          field: 'memberInfo.mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '订单状态',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgType'
        },
        {
          headerName: '备注说明',
          field: 'ob_back_note',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '退单金额',
          field: 'ob_back_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '退单数量',
          field: 'goods_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '退款原因',
          field: 'ob_why_label',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '物流公司',
          field: 'ob_wuliu_company',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '物流单号',
          field: 'ob_wuliu_order_no',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '物流备注',
          field: 'ob_wuliu_note',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.2) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      order: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      stateId: '',
      orderDetailDialog: false,
      wuliuDialogStatus: false
    }
  },
  mounted () {},
  created () {
    this.getOrder()
    this.context = this
  },
  computed: {},
  methods: {
    clean () {
      this.text = ''
      this.stateId = ''
      this.getOrder()
    },
    getOrder () {
      this.orderDetailDialog = false
      this.wuliuDialogStatus = false
      const obj = {
        text: this.text,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        state: this.stateId
      }
      this.$store
        .dispatch('jfOrder/getBackOrderData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.order = res.data ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getOrder()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getOrder()
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
        // params.api.sizeColumnsToFit();
      }
    },
    // 浮动
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },

    // 查看订单详情
    viewOrderDetail (orderId) {
      this.orderDetailDialog = true
      this.$nextTick(() => {
        this.$refs.orderDetailRef.getItem(orderId)
      })
    },
    // 创建物流订单
    createWuliuOrder (orderId) {
      this.wuliuDialogStatus = true

      this.$nextTick(() => {
        this.$refs.wuliuCreateOrderRef.init(orderId, 'jfmall')
      })
    },

    stateValue (p) {
      return this.stateObject[p.data.wod_status]
    }
  }
}
</script>
