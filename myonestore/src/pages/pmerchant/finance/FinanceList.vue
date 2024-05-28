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

          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="conditionForm.finance_status"
              :options="financeStatusData"
              dense
              label="请选择收入类型"
              clearable
            />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" unelevated label="重置" />
          <q-space />
          <!-- <q-btn @click="batchSettle" :disable="dataListSelections.length <= 0" color="primary" unelevated label="批量结算" /> -->
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

    </div>
  </q-page>
</template>

<script>

export default {
  name: 'FinanceList',
  components: {
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {

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
          headerName: '商家',
          field: 'expendStore.name'
        },
        {
          headerName: '状态',
          field: 'dr_finance_status',
          valueGetter: (p) => {
            return this.financeStatusItem[p.data.dr_finance_status]
          }
        },

        // {
        //   headerName: '收入方',
        //   field: 'incomeStore.name'
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
          headerName: '收入类型',
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

        // {
        //   headerName: '操作',
        //   field: 'id',
        //   cellRendererFramework: 'Operating'
        // }
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
      conditionForm: {
        settle_status: '',
        finance_type: '',
        finance_status: ''
      },
      accountInfo: {}
    }
  },

  mounted () {
    this.context = this
    this.getList()
  },
  computed: {},
  created () {
    if (this.$q.localStorage.getItem('myonestore_account_info')) {
      this.accountInfo = this.$q.localStorage.getItem('myonestore_account_info')
    }
  },
  methods: {
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
        merchant_lib_id: this.accountInfo.lib_id
      }
      this.$store
        .dispatch('pmerchantManage/getDataList', obj)
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

    batchSettle () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定将${this.gridOptions.api.getSelectedRows().length} 条账务信息进行结算吗？`,
          cancel: true
          // options: {
          //   type: 'radio',
          //   model: 2,
          //   // inline: true
          //   items: [
          //     { value: 2, label: '已结算', color: 'primary' },
          //     { value: 3, label: '挂起' },
          //     { value: 4, label: '失效' }
          //   ]
          // }
        })
        .onOk((val) => {
          this.changeRecordData(val)
        })
        .onCancel(() => {})
    },
    changeRecordData (val) {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store
          .dispatch('pmerchantManage/changeRecordData', {
            recordIds: obj,
            settle_status: val
          })
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '成功',
                caption: '成功结算 ' + res.data + ' 条账务信息信息！'
              })
              this.getList()
              this.dataListSelections = []
            } else {
              this.$q.notify({
                message: '错误',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: res.message,
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '错误',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: error.message,
              color: 'red'
            })
          })
      }
    }
  }
}
</script>
