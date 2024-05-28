<template>
  <q-dialog full-height v-model="visible" @close="closeDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.8 + 'px',
        'max-width': $q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-sm full-height fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-pb-md">
          <div class="text-subtitle2">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择单据
          </div>
          <div class="row q-mb-sm">
            <q-input outlined class="col-12 col-md-5 q-mr-sm" dense v-model="searchQuery" label="可搜索:单据号" />
            <q-btn class="col-12 col-md-1 q-mr-sm" label="搜索" unelevated color="primary" @click="getInvoice(invoice)" />
            <q-btn class="col-12 col-md-1 q-mr-sm" label="重置" unelevated color="warning" @click="clearBut()" />
            <q-btn class="col-12 col-md-1 q-mr-sm" label="确认" unelevated color="primary" :disable="dataListSelections.length > 0 ? false : true" @click="selectAdministrator()" />
            <q-btn class="col-12 col-md-1" label="关闭" unelevated color="grey" @click="visible = false" />
          </div>
        </div>
        <div class="col-shrink full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :components="components"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table w-full hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="invoiceData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            rowHeight="60"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            @rowSelected="rowSelectedAg"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'chooseInvoice',
  components: {},
  data () {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 50
        },
        {
          headerName: '单据号',
          field: 'gii_inventoryInCode'
        },
        {
          headerName: '折扣率',
          field: 'gii_discountRate',
          filter: false
        },
        {
          headerName: '折扣额',
          field: 'gii_discountAmount',
          filter: false
        },

        {
          headerName: '总金额',
          field: 'gii_total',
          filter: false
        },
        {
          headerName: '剩余欠款',
          field: 'gii_foldClause',
          filter: false
        },
        {
          headerName: '添加时间',
          field: 'receipt_code',
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
      isInputDisabled: false,
      visible: false,
      invoiceData: [],
      searchQuery: '',

      localeText: this.$ag_grid_localeText,
      invoice: {}
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    getInvoice (val) {
      this.dataListSelections = []
      this.invoice = val
      this.visible = true
      const obj = {
        searchQuery: this.searchQuery,
        inventoryType: val.type,
        clientId: val.clientId,
        supplierId: val.supplierId,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('repayment/getInvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getInvoice(this.invoice)
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getInvoice(this.invoice)
    },

    selectAdministrator () {
      this.visible = false
      this.$emit('getChooseInvoiceData', this.dataListSelections)
    },

    closeDialog () {
      this.$emit('closeChooseInvoice')
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
    clearBut () {
      this.searchQuery = ''
      this.getInvoice(this.invoice)
    }
  }
}
</script>
