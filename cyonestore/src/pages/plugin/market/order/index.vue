<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="invoiceCode" label="请输入订单编号" class="col-12 col-md-2" />
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            v-model="amountStatus"
            :options="statusOptions"
            label="请选择佣金状态"
            class="col-12 col-md-2"
            emit-value
            map-options
          />
          <q-select outlined dense v-model="typeStatus" :options="typeOptions" label="请选择类型" class="col-12 col-md-2" emit-value map-options />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
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
          rowHeight="50"
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
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
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
import ViewDetails from './ViewDetails'
export default {
  name: 'marketOrder',
  components: {
    AgOperate,
    ViewDetails
  },
  data () {
    return {
      viewDetailsStatus: false,
      invoiceCode: '',
      memberInfo: '',
      amountStatus: '',
      typeStatus: '',
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
          field: 'pmr_invoice_code',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '分佣级别',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_level) == 1) {
              return '一级分佣商'
            } else if (parseInt(p.data.pmr_level) == 2) {
              return '二级分佣商'
            } else if (parseInt(p.data.pmr_level) == 3) {
              return '三级分佣商'
            } else {
              return '暂无'
            }
          },
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '分佣商姓名',
          field: 'parentName',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '实付金额',
          field: 'pmr_real_amount',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '佣金比例',
          valueGetter: (p) => {
            return p.data.pmr_proportion + '%'
          },
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '佣金金额',
          field: 'pmr_amount',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '佣金状态',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_status) == -1) {
              return '作废'
            } else if (parseInt(p.data.pmr_status) == 1) {
              return '待入账'
            } else if (parseInt(p.data.pmr_status) == 2) {
              return '已入账'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '类型',
          field: 'pmr_type',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_type) == 1) {
              return '绑定'
            } else if (parseInt(p.data.pmr_type) == 2) {
              return '首次消费'
            } else if (parseInt(p.data.pmr_type) == 3) {
              return '消费'
            } else {
              return false
            }
          },
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.14) + 'px',
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
        typeStatus: this.typeStatus,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('market/getMarketOrderList', params)
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
            icon: 'ion-checkmark-circle-outline',
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
      this.typeStatus = ''
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
