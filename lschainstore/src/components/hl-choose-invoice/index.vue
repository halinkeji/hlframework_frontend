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
            <q-btn
              class="col-12 col-md-1 q-mr-sm"
              label="确认"
              unelevated
              color="primary"
              :disable="dataListSelections.length > 0 ? false : true"
              @click="selectAdministrator()"
            />
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
  data() {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0,
      },
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 30,
        },
        {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: ' 单据号',
          field: 'cep_contract_number',
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: '供应商',
          field: 'cep_supplier_name',
          width: this.nowpx(0.07) + 'px',
        },
        {
          headerName: '仓库',
          field: 'cep_depot_name',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '订单应付',
          field: 'cep_total_purchase_amount',
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '订单总数',
          field: 'cep_total_purchase_num',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '采购员',
          field: 'cep_buyer_name',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '门店',
          field: 'inStore',
          valueGetter: (p) => {
            if (p.data.inStore) {
              return p.data.inStore.name;
            } else if (p.data.store) {
              return p.data.store.name;
            } else {
              return '';
            }
          },
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '采购时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm');
          },
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '备注',
          field: 'cep_note',
          width: this.nowpx(0.08) + 'px',
        },
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true,
      },
      gridOptions: {},
      isInputDisabled: false,
      visible: false,
      invoiceData: [],
      searchQuery: '',

      localeText: this.$ag_grid_localeText,
      invoice: {},
    };
  },

  computed: {},
  created() {},
  mounted() {},
  methods: {
    getInvoice(val) {
      this.dataListSelections = [];
      this.invoice = val;
      this.visible = true;
      const obj = {
        searchQuery: this.searchQuery,
        inventoryType: val.type,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex,
      };
      this.$store
        .dispatch('erpPurchase/getInvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data ? res.data.list : [];
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0;
          }
        })
        .catch((error) => {});
    },

    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows();
    },

    sizeChangeHandle(val) {
      this.page.pageSize = val;
      this.page.pageIndex = 1;
      this.getInvoice(this.invoice);
    },
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getInvoice(this.invoice);
    },

    selectAdministrator() {
      this.visible = false;
      this.$emit('getChooseInvoiceData', this.dataListSelections);
    },

    closeDialog() {
      this.$emit('closeChooseInvoice');
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    clearBut() {
      this.searchQuery = '';
      this.getInvoice(this.invoice);
    },
  },
};
</script>
