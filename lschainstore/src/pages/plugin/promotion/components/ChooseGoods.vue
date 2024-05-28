<template>
  <q-dialog
    v-model="activePrompt"
    @close="closeDialog"
    fullscreen
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 1) + 'px',
        'max-width': parseInt(this.$q.screen.width * 1) + 'px',
      }"
      class="fit q-pa-sm full-height"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <q-card-section class="row items-center">
          <div class="text-h6">选择商品</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="col-shrink bg-white q-px-xs q-pb-xl row q-gutter-xs">
          <q-input outlined class="col-12 col-md-2 q-mr-sm" dense v-model="searchValue" label="名称/编码/助记码/简称" />
          <q-select
            outlined
            dense
            v-model="queryCondition.typeID"
            :options="typeData"
            class="col-12 col-md-2"
            option-value="id"
            option-label="gt_name"
            emit-value
            map-options
            label="商品分类 "
          />
         
          <q-btn class="col-12 col-md-1 q-mr-sm" unelevated label="搜索" color="primary" @click="getInquireType(goodsModel)" />
          <q-btn class="col-12 col-md-1 q-mr-sm" unelevated label="重置" color="warning" @click="clearBut()" />
          <q-btn unelevated class="col-12 col-md-1" label="关闭" color="grey" @click="activePrompt = false" />
        </div>
        <div class="col-shrink bg-white q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :components="components"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            rowSelection="multiple"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="specificationNewsData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            rowHeight="50"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md row q-gutter-md items-center q-px-md">
          <q-btn class="q-px-xl" unelevated color="primary" @click="getSelectedTabel(true)" label="确认" />
          <q-btn class="q-px-xl" unelevated color="green" @click="getSelectedTabel(false)" label="选中并关闭" />
          <q-btn class="q-px-xl" unelevated color="grey" @click="closeDialog" label="关闭" />
          <q-space />
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :current-page="page.pageIndex"
            :page-size="page.pSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ChooseGoods',
  components: {},
  data() {
    return {
      components: {},
      memberListData: [],
      maximizedToggle: true,
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0,
      },
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 50,
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false,
          width: 237,
          onCellValueChanged: function (p) {
            const itemsToUpdate = [];
            const data = p.data;
            data.goo_name = Math.floor(Math.random() * 20000 + 20000);
            itemsToUpdate.push(data);
            const res = p.api.applyTransaction({ update: itemsToUpdate });
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },

        {
          headerName: '单位',
          field: 'goodsUnit.gu_name',
          filter: false,
          width: 158,
        },
        {
          headerName: '分类',
          field: 'goodsType.gt_name',
          filter: false,
          width: 185,
        },
        {
          headerName: '售价',
          field: 'goo_price',
          filter: false,
          width: 200,
          valueGetter: function (p) {
            if (p.data.gs_price) {
              return p.data.gs_price;
            }
            return p.data.goo_price;
          },
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          // cellRenderer: "showCellRenderer",
          filter: false,
          width: 200,
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: 200,
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          filter: false,
          width: 200,
        },
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true,
      },
      queryCondition: {
        text: '',
        typeID: '',
      },
      gridOptions: {},
      isInputDisabled: false,
      activePrompt: false,
      specificationNewsData: [],
      searchValue: '',
      goodsModel: '',
      localeText: this.$ag_grid_localeText,
      invoice: {},
      supplierData: [],
      brandList: [],
      yearsList: [],
      seasonList: [],
      priorityList: [],
      tagList: [],
      typeData: [],
    };
  },

  computed: {},
  created() {},
  mounted() {
    // this.getSupplierList()
    // this.getPropertyAll()
    this.getType();
  },
  methods: {
    closeDialog() {
      this.activePrompt = false;
      this.$emit('closeDialog');
    },
    getSupplierList() {
      this.$store
        .dispatch('supplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : [];
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          });
        });
    },
    getPropertyAll() {
      this.$store
        .dispatch('clothingArchives/getLists')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.brandList = res.data.brand ? res.data.brand : [];
              this.yearsList = res.data.years ? res.data.years : [];
              this.seasonList = res.data.season ? res.data.season : [];
              this.priorityList = res.data.priority ? res.data.priority : [];
              this.tagList = res.data.tag ? res.data.tag : [];
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          });
        });
    },
    getType() {
      this.$store
        .dispatch('goodstype/getTreeList')
        .then((res) => {
          if (res.code == 200) {
            this.typeData = res.data ? res.data : [];
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          });
        });
    },
    getSelectedTabel(val) {
      const selectedRows = this.gridOptions.api.getSelectedRows();
      this.activePrompt = val;
      if (selectedRows && selectedRows.length > 0) {
        if (this.rowSelection != 'single') {
          this.$emit('getChooseGoods', selectedRows, val);
        } else {
          this.$emit('getChooseGoods', selectedRows[0], val);
        }
      }

      if (val) {
        this.getInquireType(this.goodsModel);
      }
    },
    rowSpan(params) {
      const fields = ['goo_name'];
      const data = this.specificationNewsData;
      const row = params.data;
      const rowIndex = params.node.rowIndex;
      const property = params.colDef.field;
      const cellValue = row[property];

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1];
        let nextRow = data[rowIndex + 1];
        let countRowspan = 0;
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan;
        } else {
          countRowspan = 1;
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex];
          }

          if (countRowspan > 1) {
            return countRowspan;
          }
        }
      }
    },

    // 选择商品开启弹窗调取数据
    getInquireType(val) {
      // vue 1实物服务 2套餐
      this.activePrompt = true;
      this.goodsModel = val;
      const obj = {
        type: val,
        ...this.queryCondition,
        text: this.searchValue,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
      };
      this.$store
        .dispatch('components/getGoodsListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data.list;

            this.page.pageTotal = parseInt(res.data.page.totalCount);
          }
        })
        .catch((error) => {});
    },

    // 每页数
    sizeChangeHandle(val) {
      this.page.pSize = val;
      this.page.pageIndex = 1;
      this.getInquireType(this.goodsModel);
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getInquireType(this.goodsModel);
    },
    // 查询
    handleFormSearchSubmit() {
      this.getInquireType(this.goodsModel);
    },
    // 重置
    handleFormReset() {
      this.getInquireType(this.goodsModel);
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
    clearBut() {
      this.searchValue = '';
      this.queryCondition.typeID = '';
      this.getInquireType(this.goodsModel);
    },
  },
};
</script>
