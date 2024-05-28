<template>
  <div class="centerx labelx">
    <q-dialog full-height v-model="visible" @close="closeDialog" persistent>
      <q-card
        :style="{
          width: $q.screen.width * 0.8 + 'px',
          'min-width': $q.screen.width * 0.8 + 'px'
        }"
        class="q-pa-sm full-height"
      >
        <div class="row q-mb-sm">
          <q-input
            outlined
            class="col-12 col-md-5 q-mr-sm"
            dense
            v-model="searchQuery"
            label="可搜索:单据号"
          />
          <q-btn
            class="col-12 col-md-1 q-mr-sm"
            label="搜索"
            color="primary"
            @click="getInvoice(invoice)"
          />
          <q-btn
            class="col-12 col-md-1 q-mr-sm"
            label="重置"
            color="warning"
            @click="clearBut()"
          />
          <q-btn
            class="col-12 col-md-1 q-mr-sm"
            label="确认"
            color="primary"
            :disable="dataListSelections.length > 0 ? false : true"
            @click="selectAdministrator()"
          />
          <q-btn
            class="col-12 col-md-1"
            label="关闭"
            color="grey"
            @click="visible = false"
          />
        </div>
        <div class="q-mt-sm" :style="`height:${gridOptions.rowHeight * 10}px`">
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
            rowHeight="50"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            @rowSelected="rowSelectedAg"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
          ></ag-grid-vue>
        </div>
        <hl-pagination
          class="mt-10"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "chooseInvoice",
  components: {},
  data() {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      columnDefs: [
        //表格列数据
        {
          checkboxSelection: true, //是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, //标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, //标题复选框开关状态
          width: 50
        },
        {
          headerName: "单据号",
          field: "gii_inventoryInCode"
        },
        {
          headerName: "折扣率",
          field: "gii_discountRate",
          filter: false
        },
        {
          headerName: "折扣额", //列标题
          field: "gii_discountAmount", //列与数据源对应的字段
          filter: false //是否过滤
        },

        {
          headerName: "总金额",
          field: "gii_total",
          filter: false
        },
        {
          headerName: "剩余欠款",
          field: "gii_foldClause",
          filter: false
        },
        {
          headerName: "添加时间",
          field: "receipt_code",
          valueGetter: p => {
            return this.$q_date.formatDate(
              p.data.created_at * 1000,
              "YYYY-MM-DD HH:mm:ss"
            );
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
      searchQuery: "",

      localeText: this.$ag_grid_localeText,
      invoice: {}
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
        clientId: val.clientId,
        supplierId: val.supplierId,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      };
      this.$store
        .dispatch("repayment/getInvoice", obj)
        .then(res => {
          if (res.code == 200) {
            this.invoiceData = res.data ? res.data.list : [];
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0;
          }
        })
        .catch(error => {});
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
      this.$emit("getChooseInvoiceData", this.dataListSelections);
    },

    closeDialog() {
      this.$emit("closeChooseInvoice");
    },
    onFirstDataRendered(params) {
      let nowWidth = this.$q.screen.width;
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
      this.searchQuery = "";
      this.getInvoice(this.invoice);
    }
  }
};
</script>
