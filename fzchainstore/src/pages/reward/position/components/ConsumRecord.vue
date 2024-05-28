<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row">
      <q-select
        class="col-12 col-md-2 q-mt-sm q-mr-sm"
        outlined
        option-value="value"
        option-label="label"
        emit-value
        map-options
        :options="consumeTypeData"
        v-model="searchFrom.consumeTypeData"
        dense
        label="选择单据类型"
      />
      <div class="col-12 col-md-2 q-mr-sm q-mt-sm">
        <q-input label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
      </div>
      <div class="col-12 col-md-2 q-mt-sm q-mr-sm">
        <q-input label="请输入会员卡号|昵称" outlined v-model="searchFrom.memberText" dense />
      </div>
      <div class="col-12 col-md-2 q-mt-sm q-mr-xs">
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
      <div class="col-12 col-md-2 q-mt-sm q-mr-xs">
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
      <q-btn @click="getList()" color="primary" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
      <q-btn @click="resetButton()" color="warning" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="重置" />
      <q-btn
        color="primary"
        class="q-mt-sm col-12 col-md-1 q-mr-sm"
        unelevated
        @click="exportCsv"
        label="导出Csv文件"
        :disable="consumRecord.length == 0"
      />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="consumRecord"
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
  </div>
</template>

<script>
export default {
  props: ['reward_user_id'],
  name: 'ConsumRecord',
  components: {},
  data() {
    return {
      type: this.$store.state.invoice.consumePayType,
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      startTime: '',
      endTime: '',
      searchFrom: {
        sc_consumeType: [],
        consumePayType: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: '',
      },
      isSidebarActiveLocal: true,
      context: '',
      gridOptions: {},
      consumRecord: [],
      columnDefs: [
        {
          headerName: '#',
          width: 60,
          valueGetter: function(params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: '消费单号',
          field: 'sc_invoiceCode',
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '消费类型',
          field: 'rcr_consume_type_name',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '会员姓名',
          field: 'rcr_member_name',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '会员卡号',
          field: 'rcr_member_card_num',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '绩效金额',
          field: 'rcr_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '应付金额',
          field: 'rcr_handle_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '实付金额',
          field: 'rcr_real_amount',
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '消费时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          },
          width: this.nowpx(0.2) + 'px',
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.13) + 'px',
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0,
      },
      localeText: this.$ag_grid_localeText,
    };
  },

  created() {
    this.context = this;
    this.getList();
  },
  mounted() {},
  computed: {},
  methods: {
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
        ...this.searchFrom,
        user_id: this.reward_user_id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        startTime,
        endTime,
      };
      this.$store
        .dispatch('rewardPosition/consumRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumRecord = res.data ? res.data.list : [];
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0;
            if (res.data) {
              this.setTopTabel(this.consumRecord);
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
          sc_invoiceCode: '数据合计',
          show_status: true,
          rcr_amount: '',
          rcr_handle_amount: '',
          rcr_real_amount: '',
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
      this.page.pageSize = val;
      this.page.pageIndex = 1;
      this.getList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getList();
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width - 550;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    resetButton() {
      this.searchFrom = {
        memberText: '',
        searchSerm: '',
        consumeTypeData: '',
      };
      this.startTime = '';
      this.endTime = '';
      this.getList();
    },
    exportCsv() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss');
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-员工消费绩效记录',
      });
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    }, // 表格宽度自适应
  },
};
</script>
