<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-x-sm items-center">
      <div class="col-4 q-mt-sm" v-if="is_main_store">
        <q-select
          label="查询门店"
          use-chips
          clearable
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
        />
      </div>
      <q-input class="col-12 col-md-2 q-mt-sm" label="请输入提成方案名称/方案编号" outlined v-model="searchQuery" dense />
      <q-btn @click="getList" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
      <q-btn @click="clearnBut" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
      <q-btn :to="{ name: 'addPerformance' }" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增" />
      <q-btn
        :disable="dataListSelections.length > 0 ? false : true"
        @click="delAll"
        color="red"
        class="col-12 col-md-1 q-mt-sm"
        unelevated
        v-if="authorityMeta('delAll')"
        label="批量删除"
      />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="positionData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :context="context"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
        @gridReady="onFirstDataRendered"
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
</template>

<script>
import AgPerOperator from './AgPerOperator';
import AgPerformanceMode from './AgPerformanceMode';

export default {
  name: 'Performance',
  components: {
    AgPerOperator,
    AgPerformanceMode,
  },
  data() {
    return {
      context: null,
      components: {
        AgPerOperator,
        AgPerformanceMode,
      },
      gridOptions: {},
      positionData: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px',
        },
        {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: '方案编号',
          field: 'prp_number',
          width: this.nowpx(0.12) + 'px',
        },
        {
          headerName: '方案名称',
          field: 'prp_name',
        },
        {
          headerName: '模式',
          field: 'prp_model',
          valueGetter: (p) => {
            if (parseInt(p.data.prp_model) == 1) {
              return '统提';
            }
            if (parseInt(p.data.prp_model) == 2) {
              return '阶段';
            }
          },
        },
        {
          headerName: '提成范围',
          field: 'prp_type',
          valueGetter: (p) => {
            if (parseInt(p.data.prp_type) == 1) {
              return '商品';
            }
            if (parseInt(p.data.prp_type) == 2) {
              return '类别';
            }
            if (parseInt(p.data.prp_type) == 3) {
              return '品牌';
            }
            if (parseInt(p.data.prp_type) == 4) {
              return '综合';
            }
            if (parseInt(p.data.prp_type) == 5) {
              return '全部';
            }
          },
        },
        {
          headerName: '状态',
          field: 'prp_status',
          cellRendererFramework: 'AgPerformanceMode',
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'AgPerOperator',
          width: this.nowpx(0.08) + 'px',
        },
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0,
      },
      dataListSelections: {},
      selectStoreData: [],
      libInStoreList: [],
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store'];
    },
  },
  created() {
    if (this.is_main_store) {
      this.getLibInStoreData();
    }
    this.context = this;
  },
  methods: {
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    getList() {
      const obj = {
        name: this.searchQuery,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        selectStoreData: this.selectStoreData,
      };
      this.$store
        .dispatch('rewardPerformance/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0;
            this.positionData = res.data ? res.data.list : [];

            this.dataListSelections = [];
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
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows();
    },
    delAll() {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条方案吗`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteRecord();
        });
    },
    deleteRecord() {
      const dataListSelections = this.gridOptions.api.getSelectedRows();
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id;
        });
        this.$store.dispatch('rewardPerformance/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 方案',
            });
            this.getList();
            this.dataListSelections = {};
          }
        });
      }
    },
    clearnBut() {
      this.searchQuery = '';
      this.selectStoreData = [];
      this.dataListSelections = [];
      this.getList();
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
        params.api.sizeColumnsToFit();
      }
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

<style></style>
