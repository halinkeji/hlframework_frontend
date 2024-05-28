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
      <q-input outlined dense class="col-12 col-xs-6 col-sm-2" v-model="memberText" label="员工姓名" />

      <div class="col-12 col-md-2 q-mr-xs">
        <q-input outlined v-model="startTime" label="开始时间" dense square readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy @before-show="startTime" transition-show="scale" transition-hide="scale">
                <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy @before-show="startTime" transition-show="scale" transition-hide="scale">
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2 q-mr-xs">
        <q-input outlined v-model="endTime" label="结束时间" dense square readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy @before-show="endTime" transition-show="scale" transition-hide="scale">
                <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy @before-show="endTime" transition-show="scale" transition-hide="scale">
                <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <q-btn color="primary" class="col-6 col-xs-3 col-sm-1" unelevated @click="getList" label="搜索" />
      <q-btn color="warning" @click="clearButton" class="col-6 col-xs-3 col-sm-1" unelevated label="重置" />
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
        :defaultColDef="defaultColDef"
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
    <record-detail ref="recordDetailRef" v-if="recordDetailStatus"></record-detail>
  </div>
</template>

<script>
import AgRecordOperator from './AgRecordOperator';
import RecordDetail from './RecordDetail';
export default {
  name: 'Record',
  components: { AgRecordOperator, RecordDetail },
  data() {
    return {
      context: '',
      recordDetailStatus: false,
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
          headerName: '日期',
          field: 'prr_end_time',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.prr_start_time * 1000, 'YYYY-MM ');
          },
        },
        {
          headerName: '员工姓名',
          field: 'prr_reward_user_name',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '员工职位',
          field: 'position.prp_name',
          width: this.nowpx(0.1) + 'px',
        },

        {
          headerName: '开卡数量',
          field: 'prr_open_card_number',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b,
        },
        {
          headerName: '开卡绩效',
          field: 'prr_open_card_reward_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b,
        },
        {
          headerName: '消费实付',
          field: 'prr_consume_total_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b,
        },
        {
          headerName: '充值实付',
          field: 'prr_recharge_total_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b,
        },

        {
          headerName: '消费绩效',
          field: 'prr_consume_reward_amount',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b,
        },

        {
          headerName: '结算周期',
          field: 'prr_start_time',
          valueGetter: (p) => {
            if (!p.data.show_status) {
              return (
                this.$q_date.formatDate(p.data.prr_start_time * 1000, 'YYYY-MM-DD ') +
                '-' +
                this.$q_date.formatDate(p.data.prr_end_time * 1000, 'YYYY-MM-DD')
              );
            }
          },
          width: this.nowpx(0.2) + 'px',
        },

        {
          headerName: '结算时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          },
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.13) + 'px',
        },
        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'AgRecordOperator',
          width: this.nowpx(0.08) + 'px',
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0,
      },
      startTime: '',
      endTime: '',
      defaultColDef: {
        sortable: true,
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
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    getList() {
      let startTime = 0;
      let endTime = 0;
      startTime = this.$q_date.formatDate(this.startTime, 'X');
      endTime = this.$q_date.formatDate(this.endTime, 'X');

      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }
      const obj = {
        memberText: this.memberText,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData,
        startTime,
        endTime,
      };
      this.$store
        .dispatch('rewardPosition/getRecordList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.openCardRecord = res.data ? res.data.list : [];
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0;

            if (this.openCardRecord.length > 0) {
              setTimeout(() => {
                this.setTopTabel(res.data.list);
              }, 200);
            }
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
    setTopTabel(list) {
      const newRows = this.countColumnData(list, [
        {
          prr_reward_user_name: '数据合计',
          show_status: true,
          prr_open_card_number: '',
          prr_open_card_reward_amount: '',
          prr_consume_total_amount: '',
          prr_recharge_total_amount: '',
          prr_consume_reward_amount: '',
        },
      ]);
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows); // 底部汇总
      }, 200);
    },

    countColumnData(data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = [];
        condition.forEach((i, k) => {
          const oneRowData = {};
          for (var j in i) {
            oneRowData[j] = 0;
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j]);
                oneRowData[j] = this.formatAmount(oneRowData[j]);
              });
            } else {
              oneRowData[j] = i[j];
            }
          }

          rowData.push(oneRowData);
        });
        return rowData;
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
      this.startTime = '';
      this.endTime = '';
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
  },
};
</script>
