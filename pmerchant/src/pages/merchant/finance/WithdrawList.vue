<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-sm q-py-sm">
          <div class="text-subtitle1">提现记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <q-separator />
        <div class="col-shrink bg-white q-px-sm q-pt-xs q-pb-md">
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
            <!-- <q-btn @click="batchSettle" :disable="dataListSelections.length <= 0" color="primary" unelevated label="批量结算" /> -->
          </div>
        </div>

        <div class="col-shrink q-px-sm full-height ">
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
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import WithdrawOperator from '../components/WithdrawOperator.vue'

import AgStatusChip from '../components/AgStatusChip.vue'

export default {
  name: 'financeWithdraw',
  components: {
    WithdrawOperator,
    AgStatusChip
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        WithdrawOperator
      },
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
        },

        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'WithdrawOperator'
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
      financeStatusItem: this.$store.state.financeManage.financeStatusItem,
      financeTypeItem: this.$store.state.financeManage.financeTypeItem,
      settleStatusItem: this.$store.state.financeManage.settleStatusItem,
      settleStatusData: this.$store.state.financeManage.settleStatusData,
      financeTypeData: this.$store.state.financeManage.financeTypeData,
      financeStatusData: this.$store.state.financeManage.financeStatusData,
      withdrawStatusItem: this.$store.state.financeManage.withdrawStatusItem,

      withdrawStatusData: this.$store.state.financeManage.withdrawStatusData,
      conditionForm: {
        settle_status: ''
      },
      dialogStatus: false,
      merchantLibId: ''
    }
  },

  mounted () {
    this.context = this
  },
  computed: {},
  created () {},
  methods: {
    init (merchantLibId) {
      this.dialogStatus = true
      this.merchantLibId = merchantLibId
      if (merchantLibId) {
        this.$nextTick(() => {
          this.getList()
        })
      }
    },
    hideNowPage () {
      this.dialogStatus = false

      this.$emit('closeDialog')
    },

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
        merchant_lib_id: this.merchantLibId
      }
      this.$store
        .dispatch('financeManage/getWithdrawDataList', obj)
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
    }
  }
}
</script>
