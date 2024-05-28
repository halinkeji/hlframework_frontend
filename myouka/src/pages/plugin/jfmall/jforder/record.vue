<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="q-gutter-x-xs row ">
        <q-input class="col-12 col-md-2 q-mt-sm" label="订单号" outlined v-model="text" dense />
        <q-select class="col-12 col-md-2 q-mt-sm" outlined v-model="stateId" :options="state" dense label="订单状态" emit-value map-options option-value="id" option-label="title" />
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getOrder" />
        <q-btn class=" q-mt-sm" unelevated color="warning" label="重置" @click="clean" />
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
    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
      <order-detail ref="orderDetailRef" @closeDialog="detailDialogStatus =false" v-if="detailDialogStatus" />

  </div>
</template>

<script>
import AgType from './components/AgType'
import AgOperator from './components/AgOperator'
import OrderDetail from './components/Detail'
export default {
  name: 'index',
  props: ['currentMemberId'],
  components: {
    AgType,
    AgOperator,
    OrderDetail
  },
  data () {
    return {
      components: {
        AgType,
        AgOperator
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
          title: '待收货'
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
          headerName: '订单号', // 列标题
          field: 'jo_order' // 列与数据源对应的字段
        },
        {
          headerName: '会员昵称', // 列标题
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
          headerName: '运费',
          field: 'jo_shipping',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '总金额',
          width: this.nowpx(0.08) + 'px',
          field: 'jo_money'
        },
        {
          headerName: '总' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit,
          width: this.nowpx(0.08) + 'px',
          field: 'jo_point'
        },
        {
          headerName: '总' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit,
          width: this.nowpx(0.08) + 'px',
          field: 'jo_saving_money'
        },
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
          width: this.nowpx(0.15) + 'px'
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
      detailDialogStatus: false
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
      const obj = {
        text: this.text,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        state: this.stateId,
        currentMemberId: this.currentMemberId
      }
      this.$store
        .dispatch('jforder/getData', obj)
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
    updateState (id, state, courier) {
      let data = ''
      if (state == 3) {
        data = '是否要确认订单'
      } else if (state == 6) {
        data = '是否要取消订单'
      } else if (state == 5) {
        data = '是否核销订单'
      }
      this.$q
        .dialog({
          title: '是否确认',
          message: `${data}`,
          cancel: true
        })
        .onOk(() => {
          const obj = {
            id: id,
            state: state
          }
          this.$store
            .dispatch('jforder/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                if (res.data.jo_state == 3) {
                  this.$q.notify({
                    message: '成功',
                    caption: '确认订单成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                } else if (res.data.jo_state == 6) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单取消成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                } else if (res.data.jo_state == 5) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单核销成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
                this.getOrder()
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
        })
        .onCancel(() => {})
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

    openDetailDialog (orderId) {
      this.detailDialogStatus = true

      this.$nextTick(() => {
        this.$refs.orderDetailRef.init(orderId)
      })
    }
  }
}
</script>
