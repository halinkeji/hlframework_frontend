<template>
  <q-dialog @hide="hideNowPage" v-model="staffStatus" persistent full-height>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.85) + 'px',
        'max-width': parseInt($q.screen.width * 0.85) + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">员工指标</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </q-card-section>
          <q-separator class="q-ma-md q-my-sm" />
          <div class="row">
            <div class="col-3 q-ml-lg">
              <div class="no-margin">店铺名称: {{ storeDayData.rsi_store_name }}</div>
            </div>
            <div class="col-2">
              <div class="no-margin">月份: {{ $q_date.formatDate(storeDayData.rsi_start_time * 1000, 'YYYY-MM') }}</div>
            </div>
            <div class="col">
              <div class="no-margin">
                月销售指标: {{ storeDayData.rsi_consume_target_amount }}
                {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}
              </div>
            </div>
            <div class="col">
              <div class="no-margin">
                未分配指标:
                <span class="text-red">
                  {{ noTargetTamount }} {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="col-shrink full-height bg-grey-2">
          <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
            <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row q-pt-sm">
              <q-input class="col-12 col-md-2 q-mt-sm" label="请输入员工名称" outlined v-model="searchQuery" dense />
              <q-btn color="primary" class="col-6 col-xs-3 col-sm-1" unelevated @click="getList" label="搜索" />
              <q-btn color="warning" @click="clearButton" class="col-6 col-xs-3 col-sm-1" unelevated label="重置" />
              <q-btn
                @click="settleWageBtn(0)"
                color="primary"
                class="col-12 col-md-1"
                unelevated
                label="新增员工指标"
                :disable="noTargetTamount == 0 ? true : false"
              />
            </div>
            <div class="col-shrink q-px-xs full-height bg-grey-2">
              <ag-grid-vue
                ref="agGridTable"
                :gridOptions="gridOptions"
                class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                :columnDefs="columnDefs"
                :suppressMovableColumns="true"
                :rowData="staffIndicatorsData"
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
            <add-user-indicators v-if="addUserStatus" ref="addUserRef" @getMethods="getList" />
            <user-day-calendar
              ref="itemDataRef"
              v-if="showDetailStatus"
              @dataList="
                getList();
                showDetailStatus = false;
              "
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import AgUserOperator from './AgUserOperator';
import AddUserIndicators from './AddUserIndicators';
import UserDayCalendar from './UserDayCalendar';
export default {
  name: 'StaffIndicators',
  components: { AgUserOperator, AddUserIndicators, UserDayCalendar },
  data() {
    return {
      dialogWidth: '1000px',
      addUserStatus: false,
      staffStatus: false,
      showDetailStatus: false,
      storeDayData: [],
      calendarDate: '',
      context: '',
      gridOptions: {},
      columnDefs: [
      {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: '员工名称',
          field: 'rui_reward_user_name',
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: '销售指标',
          field: 'rui_consume_target_amount',
          width: this.nowpx(0.1) + 'px',
        },

        {
          headerName: '分解指数',
          field: 'rui_resolve_exponent',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '每指数1代表',
          field: 'rui_one_exponent',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '月实际金额',
          field: 'rui_real_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '月指标完成率',
          field: 'rui_complete_ratio',
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '月份',
          field: 'prr_consume_reward_amount',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.rui_start_time * 1000, 'YYYY-MM ');
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
        // {
        //   headerName: '门店',
        //   field: 'store.name',
        //   width: this.nowpx(0.13) + 'px',
        // },
        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'AgUserOperator',
          pinned: 'right',
          width: this.nowpx(0.2) + 'px',
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0,
      },
      localeText: this.$ag_grid_localeText,
      staffIndicatorsData: [],
      storeDayData: {},
      subsidyData: [],
      userInfo: [],
      endTime: '',
      searchQuery: '',
    };
  },
  created() {
    this.context = this;
  },
  mounted() {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.7) + 'px';
    }
  },
  computed: {
    noTargetTamount() {
      const that = this;
      let amount = 0;
      that.staffIndicatorsData.forEach(function (item) {
        amount += that.formatAmount(item.rui_consume_target_amount);
      });
      return that.formatAmount(that.storeDayData.rsi_consume_target_amount) - that.formatAmount(amount);
    },
  },
  methods: {
    init(data) {
      if (data) {
        this.staffStatus = true;
        this.storeDayData = data;
        this.calendarDate = this.$q_date.formatDate(data.rsi_start_time * 1000, 'YYYY-MM-DD');
        this.getList();
      }
    },
    settleWageBtn(id) {
      this.addUserStatus = true;
      this.$nextTick(() => {
        this.$refs.addUserRef.getUser(id, this.storeDayData, this.noTargetTamount);
      });
    },
    viewUserDay(data) {
      this.showDetailStatus = true;
      this.$nextTick(() => {
        this.$refs.itemDataRef.init(data);
      });
    },
    getList() {
      const obj = {
        name: this.searchQuery,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        set_store_id: this.storeDayData.rsi_set_store_id,
        startTime: this.storeDayData.rsi_start_time,
      };
      this.$store
        .dispatch('rewardIndicators/getStaffLists', obj)
        .then((res) => {
          if (res.code == 200) {
            this.staffIndicatorsData = res.data ? res.data.list : [];
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
    clearButton() {
      this.searchQuery = '';
      this.getList();
    },
    hideNowPage() {
      this.staffStatus = false;
      this.dataForm = {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: '',
      };
      this.$emit('getMethods');
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width - 550;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
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
    // 格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    }, // 表格宽度自适应
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
