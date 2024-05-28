<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="row q-gutter-x-sm">
        <q-input class="col-12 col-md-2 q-mt-sm" label="请输入员工名称/联系电话" outlined v-model="searchQuery" dense />
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
        <div class="col-12 col-md-2 q-mt-sm">
          <q-input outlined v-model="startTime" label="月份" dense square readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy @before-show="startTime" transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" mask="YYYY-MM" today-btn minimal default-month>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat @click="getList" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn @click="getList" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
        <q-btn @click="clearnBut" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
        <q-btn @click="settleWageBtn" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="结算工资" />
      </div>
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
    <settle-wage v-if="settleWageStatus" ref="addSettleWageRef" @getMethods="getList"></settle-wage>
  </div>
</template>

<script>
import AgOperator from './AgOperator';
import SettleWage from './SettleWage';
export default {
  name: 'UserManage',
  components: {
    AgOperator,
    SettleWage,
  },
  data() {
    return {
      isDialogStatus: false,
      userStatus: false,
      settleWageStatus: false,
      context: null,
      gridOptions: {},
      positionData: [],
      columnDefs: [
      {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: ' 员工名称',
          field: 'rwr_reward_user_name',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '职位',
          field: 'position.prp_name',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '月份',
          field: 'prr_consume_reward_amount',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.rwr_start_time * 1000, 'YYYY-MM ');
          },
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '基础工资',
          field: 'rwr_base_salary',
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '消费奖励金额',
          field: 'rwr_open_card_reward_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '开卡奖励金额',
          field: 'rwr_consume_reward_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '指标完成率',
          field: 'rwr_complete_ratio',
          width: this.nowpx(0.08) + 'px',
        },

        {
          headerName: '提成工资',
          field: 'rwr_performance_wage',
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '补贴金额',
          field: 'rwr_subsidy_amount',
          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '扣除金额',
          field: 'rwr_deduct_amount',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '实发工资',
          field: 'rwr_real_wage',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          },
          width: this.nowpx(0.1) + 'px',
        },
        // {
        //   headerName: ' 操作',
        //   field: 'created_at',
        //   cellRendererFramework: 'AgOperator',
        //   width: this.nowpx(0.12) + 'px',
        // },
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      startTime: '',
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
  created() {
    if (this.is_main_store) {
      this.getLibInStoreData();
    }
    this.context = this;
  },
  mounted() {
    this.getList();
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store'];
    },
  },
  methods: {
    settleWageBtn() {
      this.settleWageStatus = true;
      this.$nextTick(() => {
        this.$refs.addSettleWageRef.getUser();
      });
    },
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    getList() {
      const startTimes = this.$q_date.formatDate(this.startTime, 'X')
      this.isDialogStatus = false;
      const obj = {
        name: this.searchQuery,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        startTime:startTimes,
        selectStoreData: this.selectStoreData,
      };
      this.$store
        .dispatch('rewardWages/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0;
            this.positionData = res.data ? res.data.list : [];
            this.dataListSelections = {};
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
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows();
    },
    clearnBut() {
      this.searchQuery = '';
      this.startTime = '';
      this.selectStoreData = [];
      this.getList();
      this.dataListSelections = [];
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
      return true;
    },
  },
};
</script>

<style></style>
