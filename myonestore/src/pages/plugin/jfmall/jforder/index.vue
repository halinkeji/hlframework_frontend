<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="q-gutter-x-xs row">
          <div class="col-12 col-md-2">
            <q-input label="订单号" outlined v-model="text" dense />
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

          <q-btn color="primary" unelevated label="搜索" @click="getOrder" />
          <q-btn unelevated color="warning" label="重置" @click="clean" />

          <q-btn color="primary" unelevated label="自提核销" @click="checkSelfTack" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
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
    <deliver-goods @operateSuccess="getOrder" v-if="deliverGoodsDialog" ref="deliverGoodsRef" />
    <check-order @operateSuccess="getOrder" v-if="checkOrderDialog" ref="checkOrderRef" />
    <hl-wuliu-create-order @createOrderSucceed="getOrder" @closeDialog="getOrder" v-if="wuliuDialogStatus" ref="wuliuCreateOrderRef" />
  </q-page>
</template>

<script>
import AgType from './components/AgType'
import AgOperator from './components/AgOperator'
import OrderDetail from './components/Detail'
import DeliverGoods from './components/DeliverGoods'
import CheckOrder from './components/CheckOrder'
export default {
  name: 'jfmallOrder',
  components: {
    AgOperator,
    AgType,
    OrderDetail,
    DeliverGoods,
    CheckOrder
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
          id: '1',
          title: '待付款'
        },
        {
          id: '2',
          title: '待确认'
        },
        {
          id: '3',
          title: '待发货'
        },
        {
          id: '4',
          title: '待收(取)货'
        },
        {
          id: '5',
          title: '待评价'
        },
        {
          id: '6',
          title: '已完成'
        },
        {
          id: '7',
          title: '已取消'
        },
        {
          id: '-1',
          title: '已删除'
        }
      ],
      gridOptions: {},
      context: null,
      columnDefs: [
        // 表格列数据
        {
          width: this.nowpx(0.13) + 'px',
          headerName: '订单号',
          field: 'jo_order'
        },
        {
          headerName: '会员昵称',
          field: 'member.mem_memberName',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '是否自取', // 列标题
          valueGetter: (p) => {
            return p.data.jo_type == 1 ? '否' : '是'
          },
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '总' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          width: this.nowpx(0.07) + 'px',
          field: 'jo_point'
        },
        {
          headerName: '总' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
          width: this.nowpx(0.07) + 'px',
          field: 'jo_saving_money'
        },

        {
          headerName: '应付金额',
          field: 'jo_handle_amount',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '实付金额',
          field: 'jo_money',
          width: this.nowpx(0.07) + 'px'
        },
        // {
        //   headerName: '促销优惠',
        //   field: 'jo_promotion_amount',
        //   width: this.nowpx(0.07) + 'px'
        // },

        {
          headerName: '订单状态',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgType'
        },
        {
          headerName: '下单时间',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          }
        },
        {
          headerName: '更新时间',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          }
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.18) + 'px'
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
      wuliuDialogStatus: false,
      deliverGoodsDialog: false,
      checkOrderDialog: false
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
      this.checkOrderDialog = false
      const obj = {
        text: this.text,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        state: this.stateId
      }
      this.$store
        .dispatch('jfOrder/getData', obj)
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

    checkSelfTack () {
      this.checkOrderDialog = true
      this.$nextTick(() => {
        this.$refs.checkOrderRef.init()
      })
    },

    // 查看订单详情
    viewOrderDetail (orderId) {
      this.orderDetailDialog = true
      this.$nextTick(() => {
        this.$refs.orderDetailRef.getItem(orderId)
      })
    },
    // 发货
    orderDeliverGoods (orderId) {
      this.deliverGoodsDialog = true
      this.$nextTick(() => {
        this.$refs.deliverGoodsRef.getItem(orderId)
      })
    },

    // 创建物流订单
    createWuliuOrder (orderId) {
      this.wuliuDialogStatus = true

      this.$nextTick(() => {
        this.$refs.wuliuCreateOrderRef.init(orderId, 'jfmall')
      })
    }
  }
}
</script>
