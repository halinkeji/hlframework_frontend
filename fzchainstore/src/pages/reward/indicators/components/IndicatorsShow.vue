<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row q-pt-sm">
      <div class="col-4" v-if="is_main_store">
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
      <q-btn color="primary" class="col-6 col-xs-3 col-sm-1" unelevated @click="getList" label="搜索" v-if="is_main_store" />
      <q-btn color="warning" @click="clearButton" class="col-6 col-xs-3 col-sm-1" unelevated label="重置" v-if="is_main_store" />
      <q-btn @click="settleWageBtn" color="primary" class="col-12 col-md-1" unelevated label="新增店铺指标" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="openCardRecord"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :localeText="localeText"
        :animateRows="false"
        :context="context"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
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
      ></hl-pagination>
    </div>
    <add-store-indicators ref="addStoreRef" v-if="addStoreStatus" @getMethods="getList()"></add-store-indicators>
    <store-day-calendar
      ref="itemDataRef"
      v-if="showDetailStatus"
      @dataList="
        getList();
        showDetailStatus = false;
      "
    />
    <staff-indicators ref="staffDataRef" v-if="showStaffStatus" />
  </div>
</template>

<script>
import AddStoreIndicators from './AddStoreIndicators';
import StoreDayCalendar from './StoreDayCalendar';
import StaffIndicators from './StaffIndicators';
import AgOperator from './AgOperator';

export default {
  name: 'IndicatorsShow',
  components: { AddStoreIndicators, StoreDayCalendar, StaffIndicators, AgOperator },
  data() {
    return {
      context: '',
      recordDetailStatus: false,
      addStoreStatus: false,
      showDetailStatus: false,
      showStaffStatus: false,
      memberText: '',
      gridOptions: {},
      openCardRecord: [],
      columnDefs: [
      {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: '店铺名称',
          field: 'rsi_store_name',
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: '销售指标',
          field: 'rsi_consume_target_amount',
          width: this.nowpx(0.1) + 'px',
        },

        {
          headerName: '分解指数',
          field: 'rsi_resolve_exponent',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '每指数1代表',
          field: 'rsi_one_exponent',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '月实际金额',
          field: 'rsi_real_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '月指标完成率',
          field: 'rsi_complete_ratio',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '月份',
          field: 'prr_consume_reward_amount',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.rsi_start_time * 1000, 'YYYY-MM ');
          },
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          },
          width: this.nowpx(0.12) + 'px',
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'AgOperator',
          pinned: 'right',
          width: this.nowpx(0.25) + 'px',
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0,
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: [],
    };
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store'];
    },
  },
  created() {
    this.context = this;
    if (this.is_main_store) {
      this.getLibInStoreData();
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    settleWageBtn(id) {
      this.addStoreStatus = true;
      this.$nextTick(() => {
        this.$refs.addStoreRef.getUser(id);
      });
    },
    viewStoreDay(data) {
      this.showDetailStatus = true;
      this.$nextTick(() => {
        this.$refs.itemDataRef.init(data);
      });
    },
    viewStaff(data) {
      this.showStaffStatus = true;
      this.$nextTick(() => {
        this.$refs.staffDataRef.init(data);
      });
    },

    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    getList() {
      const obj = {
        memberText: this.memberText,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData,
      };
      this.$store
        .dispatch('rewardIndicators/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.openCardRecord = res.data ? res.data.list : [];
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0;
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red',
            });
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
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
    clearButton() {
      this.memberText = '';
      this.selectStoreData = [];
      this.getList();
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width - 550;
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
    }, // 表格宽度自适应
    showDetail(val) {
      this.recordDetailStatus = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.recordDetailRef.getUser(val);
        }, 500);
      });
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
