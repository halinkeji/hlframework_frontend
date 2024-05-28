<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <q-input class="col-12 col-md-2 " outlined v-model="search" label="档期名称" dense />
      <div class="col-12 col-md-6 q-mr-xs">
        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" class="q-mx-sm" unelevated label="重置" @click="clean" />
        <q-btn color="primary" unelevated label="新增" v-if="authorityMeta('outAdd')" @click="addTime" />
        <q-btn
          :disabled="dataListSelections.length > 0 ? false : true"
          @click="delAll()"
          v-if="authorityMeta('delAll')"
          color="red"
          class="q-ml-sm"
          unelevated
          label="批量删除"
        />
      </div>
    </div>
    <add-time ref="addTimeRef" v-if="addTimeStatus" @dataList="getList" />

    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="configListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        rowSelection="multiple"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :components="components"
        @first-data-rendered="onFirstDataRendered"
        @rowSelected="rowSelectedAg"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
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
import AgTimeOperator from './AgTimeOperator';
import AddTime from './AddTime';
export default {
  name: 'TimeTab',
  components: {
    AgTimeOperator,
    AddTime,
  },
  data() {
    return {
      components: {
        AgTimeOperator,
      },
      endTime: '',
      addTimeStatus: false,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0,
      },
      localeText: this.$ag_grid_localeText,
      configListData: [],
      dataListSelections: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.01) + 'px',
        },
        {
          headerName: '档期编号',
          field: 'ppt_number',
          width: this.nowpx(0.13) + 'px',
        },

        {
          headerName: '档期名称',
          field: 'ppt_name',
          width: this.nowpx(0.13) + 'px',
        },

        {
          headerName: '起始时间',
          field: 'ppt_start_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.ppt_start_time * 1000, 'YYYY-MM-DD  HH:mm');
          },
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '结束时间',
          field: 'ppt_end_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.ppt_end_time * 1000, 'YYYY-MM-DD  HH:mm');
          },
          width: this.nowpx(0.08) + 'px',
        },

        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm');
          },
          width: this.nowpx(0.08) + 'px',
        },

        {
          headerName: '操作',
          field: '',
          cellRendererFramework: 'AgTimeOperator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.09) + 'px',
        },
      ],
      search: '',
      context: '',
      libInStoreList: [],
    };
  },

  created() {
    this.context = this;
    this.getList();
  },
  mounted() {},
  computed: {},
  methods: {
    optionEndDate(nowDate) {
      const newDate = new Date();
      return nowDate >= date.formatDate(date.subtractFromDate(newDate, { day: 1 }), 'YYYY/MM/DD');
    },
    getList() {
      const obj = {
        text: this.search,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
      };

      this.$store
        .dispatch('promotion/getTimeData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0;
            this.configListData = res.data ? res.data.list : [];
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
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows();
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
    exportCsv() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-订货单记录',
      });
    },
    addTime(val) {
      this.addTimeStatus = true;
      this.$nextTick(() => {
        this.$refs.addTimeRef.init(val);
      });
    },
    clean() {
      this.search = '';
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
    pinnedComputed(val) {
      const nowWidth = this.$q.screen.width;
      let pinned = val;
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = '';
      }
      return pinned;
    },
    delAll() {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条档期信息吗`,
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
        this.$store.dispatch('promotion/delTimeData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条档期',
            });
            this.getList();
            this.dataListSelections = [];
          }
        });
      }
    },
    // 限制保留小数
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    authorityMeta(key) {
      return true;
      // if (this.$route.meta) {
      //   const new_arr = this.$route.meta.map((obj) => {
      //     return obj.id
      //   })
      //   if (new_arr.indexOf(key) >= 0) {
      //     return true
      //   }
      // }
      // return false
    },
  },
};
</script>
