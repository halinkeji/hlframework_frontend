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
          <div class="text-subtitle1">收入记录</div>
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
                :options="settleStatusData"
                dense
                label="请选择结算状态"
                clearable
              />
            </div>

            <div class="col-12 col-md-2">
              <q-select
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="conditionForm.finance_type"
                :options="financeTypeData"
                dense
                label="请选择类型"
                clearable
              />
            </div>

            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearBut" color="warning" unelevated label="重置" />

            <q-btn icon="las la-exclamation-circle" dense flat color="primary">
              <q-tooltip>
                商家与平台之间的账务记录：1、会员使用平台储值、积分、卡券在商家买单。2、平台抽取商家服务费（比如商家卡券推广等）。
              </q-tooltip>
            </q-btn>
            <q-space />
          </div>
        </div>

        <div class="col-shrink q-px-sm full-height">
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
export default {
  name: 'FinanceList',
  components: {},
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
          headerName: '商家',
          field: 'incomeStore.name'
        },

        // {
        //   headerName: '收入方',
        //   field: 'expendStore.name'
        // },
        {
          headerName: '金额',
          field: 'dr_amount'
        },
        {
          headerName: '退款金额',
          field: 'dr_refund_amount'
        },
        {
          headerName: '类型',
          field: 'dr_finance_type',
          valueGetter: (p) => {
            return this.financeTypeItem[p.data.dr_finance_type]
          }
        },
        {
          headerName: '结算状态',
          field: 'dr_settle_status',
          valueGetter: (p) => {
            return this.settleStatusItem[p.data.dr_settle_status]
          }
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },

        {
          headerName: '结算时间',
          field: 'dr_settle_time',
          valueGetter: (p) => {
            return p.data.dr_settle_time > 0 ? this.$q_date.formatDate(p.data.dr_settle_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
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
      financeStatusItem: this.$store.state.financeManage.financeStatusItem,
      financeTypeItem: this.$store.state.financeManage.financeTypeItem,
      settleStatusItem: this.$store.state.financeManage.settleStatusItem,
      settleStatusData: this.$store.state.financeManage.settleStatusData,
      financeTypeData: this.$store.state.financeManage.financeTypeData,
      financeStatusData: this.$store.state.financeManage.financeStatusData,
      conditionForm: {
        settle_status: '',
        finance_type: '',
        finance_status: ''
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
        settle_status: '',
        finance_type: '',
        finance_status: ''
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
        .dispatch('financeManage/getDataList', obj)
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
