<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-lg q-gutter-x-xs row">
      <q-input class="col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchNumber" label="商品名称/条码/助记码/简称" dense />
      <!-- <q-select
        class="col-12 col-md-2 q-mt-sm"
        v-if="is_main_store"
        outlined
        option-value="id"
        option-label="cd_name"
        emit-value
        map-options
        v-model="depot_id"
        :options="depotData"
        dense
        label="仓库"
      /> -->
      <div class="col-12 col-md-2 q-mt-sm">
        <hl-select-tree
          :list_width="400"
          @getItem="
            (item) => {
              goodsTypeId = item.id;
            }
          "
          @resetValue="goodsTypeId = ''"
          :dataList="goodsTypeData"
          textName="请选择分类"
          :inputLabel="'gt_name'"
          :inputValue="'id'"
          :showValue="goodsTypeId"
          ref="selectTreeRef"
        />
      </div>
      <!-- <q-select
        class="col-12 col-md-2 q-mt-sm"
        outlined
        option-value="id"
        option-label="gt_name"
        emit-value
        map-options
        v-model="tag"
        :options="tagData"
        dense
        label="商品标签"
      /> -->
      <q-input class="col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchText" label="所属入库单" dense />

      <div class="col-12 col-md-2 q-mt-sm">
        <q-input outlined v-model="quantity" dense>
          <template v-slot:before> <span class="text-body1"> 查询</span> </template>
          <template v-slot:after>
            <span class="text-body1"> 天内过期的商品</span>
          </template>
        </q-input>
      </div>

      <q-btn color="primary" class="q-mt-sm" unelevated label="搜索" @click="getList" />
      <q-btn color="warning" @click="resetCondition" class="q-mt-sm" unelevated label="重置" />
      <q-btn color="primary" class="q-mt-sm" unelevated @click="countExport" label="导出XLS文件" :disable="specificationNewsData.length == 0" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="specificationNewsData"
        @gridReady="onFirstDataRendered"
        :defaultColDef="defaultColDef"
        rowHeight="40"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCharts="true"
        :enableRangeSelection="true"
        :enableCellTextSelection="true"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="false"
        :localeText="localeText"
        :context="context"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :current-page="page.pageIndex"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'warningProduct',
  components: {},
  data() {
    return {
      activeName: '0',
      goodsTypedata: [],
      components: {},
      gridOptions: {},
      depotData: [],
      columnDefs: [
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.18) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '规格名称',
          field: 'sl_title',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },

        {
          headerName: '分类',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          field: 'goodsType.gt_name',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '售价(' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit + ')',
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          rowSpan: this.rowSpan,
          comparator: (a, b) => a - b,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '入库单据',
          field: 'cep_contract_number',
          filter: false,
          width: this.nowpx(0.12) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },

        {
          headerName: '生产日期',
          field: 'gnb_product_time',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          rowSpan: this.rowSpan,
          pinned: 'right',
          valueGetter: (p) => {
            if (p.data.gnb_product_time) {
              return this.$q_date.formatDate(p.data.gnb_product_time * 1000, 'YYYY-MM-DD ');
            }
            return '';
          },
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },
        {
          headerName: '保质期天数',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          pinned: 'right',
          field: 'gnb_shelf_life_days',
          comparator: (a, b) => a - b,
        },
        {
          headerName: '过期日期',
          field: 'gnb_shelf_life_time',
          filter: false,
          pinned: 'right',
          width: this.nowpx(0.06) + 'px',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            if (p.data.gnb_shelf_life_time) {
              return this.$q_date.formatDate(p.data.gnb_shelf_life_time * 1000, 'YYYY-MM-DD');
            }
            return '';
          },
          comparator: (a, b) => a - b,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true;
              }
            },
          },
        },

        {
          headerName: '剩余保质期',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          pinned: 'right',
          field: 'validDays',
          comparator: (a, b) => a - b,
        },

        {
          headerName: '库存',
          filter: false,
          width: this.nowpx(0.05) + 'px',
          pinned: 'right',
          field: 'gnb_number',
          comparator: (a, b) => a - b,
        },
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      goodsTypeId: '',
      quantity: '45',
      depot_id: '',
      searchText: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0,
      },
      defaultColDef: {
        sortable: true,
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      tagData: [],
      goodsTypeData: [],
    };
  },

  mounted() {
    this.getGoodsType();
    this.getDepotList();
    this.getList();
    this.getGoodsTagList();
  },
  created() {
    this.context = this;
    if (this.is_main_store) {
      this.getLibInStoreData();
    }
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store'];
    },
  },
  methods: {
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    getDepotList() {
      this.$store
        .dispatch('erpdepot/getAllListData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data;
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
    getGoodsType() {
      const obj = {
        goodsType: [1],
      };
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeData = res.data;
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
    getGoodsTagList() {
      this.$store
        .dispatch('goodsTag/getTagAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.tagData = res.data;
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

    exportCsv() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品库存管理记录',
      });
    },
    rowSpan(params) {
      const fields = [
        'goo_name',
        'main_goods_id',
        'goo_code',
        'goo_price',
        'gt_name',
        'sl_title',
        'gn_number',
        'storeName',
        'depotName',
        'storeNumber',
      ];
      const data = this.specificationNewsData;
      const row = params.data;
      const rowIndex = params.node.rowIndex;
      const property = params.colDef.field;
      const cellValue = row[property];

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1];
        let nextRow = data[rowIndex + 1];
        let countRowspan = 0;

        // 判断 当前列是总库存的同时 规格ID必须一致
        if (
          prevRow &&
          prevRow[property] === cellValue &&
          prevRow.goods_id == row.goods_id &&
          (property == 'gn_number' ? prevRow.spec_id == row.spec_id : true)
        ) {
          return countRowspan;
        } else {
          countRowspan = 1;

          while (
            nextRow &&
            nextRow[property] === cellValue &&
            nextRow.goods_id == row.goods_id &&
            (property == 'gn_number' ? nextRow.spec_id == row.spec_id : true)
          ) {
            nextRow = data[++countRowspan + rowIndex];
          }

          if (countRowspan > 1) {
            return countRowspan;
          }
        }
      }
    },
    getList() {
      const obj = {
        inType: 1,
        searchText: this.searchText,
        quantity: this.quantity,
        type: this.goodsTypeId,
        text: this.searchNumber,
        depot_id: this.depot_id,
        ...this.page,
      };
      this.$store
        .dispatch('warningProduct/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : [];
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0;
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
    countExport() {
      const obj = {
        inType: 1,
        searchText: this.searchText,
        quantity: this.quantity,
        type: this.goodsTypeId,
        text: this.searchNumber,
        depot_id: this.depot_id,
      };
      this.$store
        .dispatch('exports/getProductExport', obj)
        .then((res) => {
          if (res.code == 200) {
            window.location.href = res.data;
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right',
            });
          }
        })
        .catch((error) => {});
    },

    // 每页数
    sizeChangeHandle(val) {
      this.page.pSize = val;
      this.page.pageIndex = 1;
      this.getList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getList();
    },
    selfAdaption(params) {
      params.api.sizeColumnsToFit();
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },
    resetCondition() {
      this.searchNumber = '';
      this.goodsTypeId = '';
      this.depot_id = '';
      this.searchText = '';
      this.$refs.selectTreeRef.resetValueData();
      this.$nextTick(() => {
        this.getList();
      });
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id;
        });
        if (newArr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
<style>
.erp-number-table .cell-span-erp-number {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
