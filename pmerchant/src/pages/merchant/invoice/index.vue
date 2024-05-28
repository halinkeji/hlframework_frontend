<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-input clearable label="请输入单据号" outlined v-model="conditionForm.order_no" dense />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="conditionForm.order_type"
              :options="invoiceStatusData"
              dense
              label="请选择单据类型"
              clearable
            />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" unelevated label="重置" />
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
import Operating from '../components/AgOperator.vue'

export default {
  name: 'merchantPro',
  components: {
    Operating
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating
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

        {
          headerName: '单据号',
          field: 'pi_order_no'
        },
        {
          headerName: '支付商家',
          field: 'store.name'
        },
        {
          headerName: '单据类型',
          field: 'pi_type',
          valueGetter: (p) => {
            return this.invoiceStatusItem[p.data.pi_type]
          }
        },
        {
          headerName: '应付金额',
          field: 'pi_handle_amount'
        },
        {
          headerName: '实付金额',
          field: 'pi_real_amount'
        },

        {
          headerName: '单据状态',
          field: 'pi_status',
          valueGetter: (p) => {
            return this.orderSettleStatusItem[p.data.pi_status]
          }
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
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
      invoiceStatusItem: this.$store.state.financeManage.invoiceStatusItem,
      invoiceStatusData: this.$store.state.financeManage.invoiceStatusData,
      orderSettleStatusItem: this.$store.state.financeManage.orderSettleStatusItem,
      settleStatusData: this.$store.state.financeManage.settleStatusData,
      financeTypeData: this.$store.state.financeManage.financeTypeData,
      financeStatusData: this.$store.state.financeManage.financeStatusData,
      conditionForm: {
        order_type: '',
        order_no: '',
        finance_status: ''
      }
    }
  },

  mounted () {
    this.context = this
    this.getList()
  },
  computed: {},
  created () {},
  methods: {
    clearBut () {
      this.conditionForm = {
        order_type: '',
        order_no: '',
        finance_status: ''
      }

      this.getList()
    },
    getList () {
      const obj = {
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        ...this.conditionForm
      }
      this.$store
        .dispatch('financeManage/getOrderDataList', obj)
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
          message: `确定将${this.gridOptions.api.getSelectedRows().length} 条记录进行结算吗？`,
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
          .dispatch('financeManage/changeRecordData', {
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
                caption: '成功结算 ' + res.data + ' 条记录信息！'
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
