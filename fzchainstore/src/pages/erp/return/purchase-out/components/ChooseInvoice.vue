<template>
  <div class="centerx labelx">
    <q-dialog full-height v-model="visible" @close="closeDialog" persistent>
      <q-card
        :style="{
          width: $q.screen.width * 0.8 + 'px',
          'min-width': $q.screen.width * 0.8 + 'px',
        }"
        class="q-pa-sm full-height fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
            <div class="col-12 col-md-5">
              <q-input outlined dense v-model="searchQuery" label="可搜索:单据号" />
            </div>

            <q-btn unelevated label="搜索" color="primary" @click="getInvoice(invoice)" />
            <q-btn unelevated label="重置" color="warning" @click="clearBut()" />
            <q-btn unelevated label="确认" color="primary" :disable="dataListSelections.length > 0 ? false : true" @click="selectAdministrator()" />
            <q-btn unelevated label="关闭" color="grey" @click="visible = false" />
          </div>
          <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
            <ag-grid-vue
              ref="agGridTable"
              :components="components"
              :gridOptions="gridOptions"
              class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :defaultColDef="defaultColDef"
              :rowData="invoiceData"
               rowSelection="single"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :animateRows="false"
               :floatingFilter="false"
              :enableRangeSelection="true"
              :enableCellTextSelection="true"
              :suppressRowTransform="true"
              :suppressCellSelection="true"
              :suppressRowClickSelection="false"
              @rowSelected="rowSelectedAg"
              :rowMultiSelectWithClick="true"
              :localeText="localeText"
              @first-data-rendered="onFirstDataRendered"
               rowHeight="50"
            ></ag-grid-vue>
          </div>
          <div class="col-shrink bg-white q-pb-md text-center">
            <hl-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="page.pageIndex"
              :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
              :page-size="page.pageSize"
              :total="page.pageTotal"
              layout="total, sizes, prev, pager, next, jumper"
            ></hl-pagination>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
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
          width: 30
        },
        {
          headerName: '单据号',
          field: 'cep_contract_number',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '仓库',
          field: 'cep_depot_name',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货总数',
          field: 'cep_total_purchase_num',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '创建时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '备注',
          field: 'cep_note',
          width: this.nowpx(0.08) + 'px'
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
        StoreId: val.StoreId,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('erpPurchaseOut/getInvoice', obj)
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
