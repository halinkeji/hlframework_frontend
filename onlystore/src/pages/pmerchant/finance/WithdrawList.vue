<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="conditionForm.settle_status"
              :options="withdrawStatusData"
              dense
              label="请选择提现状态"
              clearable
            />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" unelevated label="重置" />
          <q-space />

          <q-btn @click="openMerchantWithdrawDoalog" color="primary" unelevated label="提现" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="financeDataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
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
      <withdraw-dialog ref="mechantWithdrawDialogRef" @closeDialog="closeWithdrawDialog" v-if="mechantWithdrawDialogStatus" />
    </div>
  </q-page>
</template>

<script>
import AgStatusChip from './AgStatusChip.vue'
import WithdrawDialog from './WithdrawDialog.vue'
export default {
  name: 'WithdrawList',
  components: {
    AgStatusChip,
    WithdrawDialog
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {},
      financeDataList: [],
      columnDefs: [
        // 表格列数据
        {
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        // {
        //   headerName: '平台',
        //   field: 'platform.name'
        // },

        {
          headerName: '单据号',
          field: 'pdw_order_no'
        },
        {
          headerName: '申请状态',
          field: 'pdw_status',
          cellRendererFramework: 'AgStatusChip'
        },
        {
          headerName: '门店名称',
          field: 'pdw_withdraw_lib_name'
        },
        {
          headerName: '提现金额',
          field: 'pdw_amount'
        },
        {
          headerName: '手续费',
          field: 'pdw_service_fee'
        },
        {
          headerName: '到账金额',
          field: 'pdw_arrival_amount'
        },

        {
          headerName: '申请时间',
          field: 'created_at',
          valueGetter: (p) => {
            return p.data.created_at > 0 ? this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
          }
        },

        {
          headerName: '完成时间',
          field: 'pdw_complete_time',
          valueGetter: (p) => {
            return p.data.pdw_complete_time > 0 ? this.$q_date.formatDate(p.data.pdw_complete_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
          }
        },

        {
          headerName: '拒接提现时间',
          field: 'pdw_error_time',
          valueGetter: (p) => {
            return p.data.pdw_error_time > 0 ? this.$q_date.formatDate(p.data.pdw_error_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
          }
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},

      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      storeSonNum: 0,
      editDialogStatus: false,
      financeStatusItem: this.$store.state.pmerchantManage.financeStatusItem,
      financeTypeItem: this.$store.state.pmerchantManage.financeTypeItem,
      settleStatusItem: this.$store.state.pmerchantManage.settleStatusItem,
      settleStatusData: this.$store.state.pmerchantManage.settleStatusData,
      financeTypeData: this.$store.state.pmerchantManage.financeTypeData,
      financeStatusData: this.$store.state.pmerchantManage.financeStatusData,
      withdrawStatusItem: this.$store.state.pmerchantManage.withdrawStatusItem,

      withdrawStatusData: this.$store.state.pmerchantManage.withdrawStatusData,
      conditionForm: {
        settle_status: ''
      },
      accountInfo: {},
      mechantWithdrawDialogStatus: false,
      storeInfo: {}
    }
  },

  mounted () {
    this.context = this
    this.getList()
  },
  computed: {},
  created () {
    if (this.$q.localStorage.getItem('onlystore_store_local')) {
      this.storeInfo = this.$q.localStorage.getItem('onlystore_store_local').storeInfo
    }
    if (this.$q.localStorage.getItem('onlystore_account_info')) {
      this.accountInfo = this.$q.localStorage.getItem('onlystore_account_info')
    }
  },
  methods: {
    clearBut () {
      this.conditionForm = {
        settle_status: ''
      }

      this.getList()
    },
    getList () {
      const obj = {
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        ...this.conditionForm,
        merchant_lib_id: this.accountInfo.lib_id
      }
      this.$store
        .dispatch('pmerchantManage/getWithdrawDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.financeDataList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
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
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    closeWithdrawDialog () {
      this.mechantWithdrawDialogStatus = false
      this.withdrawSetStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },

    openMerchantWithdrawDoalog () {
      this.mechantWithdrawDialogStatus = true
      this.$nextTick(() => {
        this.$refs.mechantWithdrawDialogRef.init(this.accountInfo.lib_id, this.storeInfo.name)
      })
    }
  }
}
</script>
