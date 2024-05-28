<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-ma-sm q-gutter-x-sm">
        <q-input class="col-12 col-md-2 q-mt-sm" label="请输入云商通单据号" outlined v-model="searchFrom.order_no" dense />
        <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" class=" col-12 col-md-1 q-mt-sm" unelevated label="重置" />
        <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="allOrderSignal()" color="red" class="col-12 col-md-1 q-mt-sm" unelevated label="批量结算" />
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="payRecordData"
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
          :context="context"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
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
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgSend from './AgSend'
export default {
  name: 'allinpayRecord',
  components: {
    AgSend
  },
  data () {
    return {
      context: null,
      components: {},
      gridOptions: {},
      payRecordData: [],

      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '商户单据号',
          field: 'par_system_order_no',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '云商通单据号',
          field: 'par_allinpay_order_no',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '支付金额',
          field: 'par_total_amonut',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '手续费比例',
          field: 'par_proportion',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '实收比例',
          field: 'par_merchant_amount',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '收款ID',
          field: 'par_merchant_bizuser_id',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '修改时间',
          field: 'updated_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          field: 'par_status',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            switch (parseInt(p.data.par_status)) {
              case 0:
                return '支付失败'
              case 1:
                return '支付成功'
              case 2:
                return '已代付'
            }
          }
        },

        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'AgSend',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      startTime: '',
      endTime: '',
      searchFrom: {
        order_no: '',
        startTime: '',
        endTime: ''
      },
      dataListSelections: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.searchFrom.startTime = startTime
      this.searchFrom.endTime = endTime
      const obj = {
        ...this.searchFrom,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('allinpay/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.payRecordData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    clearnBut () {
      this.searchQuery = ''
      this.getList()
      this.dataListSelections = {}
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

    sendOrderSignalAgentPay (val) {
      const obj = {
        orderIds: val
      }
      this.$store
        .dispatch('allinpay/sendOrderSignalAgentPay', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功结算 ' + res.data + ' 条单据'
            })
          }
        })
        .catch((error) => {})
    },
    allOrderSignal () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.sendOrderSignalAgentPay(obj)
      }
    }
  }
}
</script>
