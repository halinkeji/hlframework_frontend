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
      <div class="col-12 col-xs-6 col-sm-2">
        <q-input outlined dense v-model="serchText" label="单据号" />
      </div>
      <div class="col-12 col-xs-6 col-sm-2">
        <q-input outlined dense v-model="memberText" label="会员姓名" />
      </div>
      <div class="col-12 col-xs-6 col-sm-2">
        <q-input outlined dense v-model="goodsText" label="商品名称" />
      </div>
      <div class="col-12 col-xs-6 col-sm-2">
        <q-input outlined dense v-model="userText" label="员工姓名" />
      </div>
      <div class="col-12 col-md-2">
        <q-input outlined dense label="开始时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
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
      <div class="col-12 col-md-2">
        <q-input outlined dense label="结束时间" v-model="endTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
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

      <div class="col-12 col-xs-6 col-sm-2">
        <q-btn color="primary" class="q-ml-sm" unelevated @click="getList" label="搜索" />
        <q-btn color="warning" class="q-ml-sm" unelevated @click="clearButton" label="重置" />
      </div>
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
  </div>
</template>

<script>
export default {
  name: 'Record',
  components: {},
  data() {
    return {
      context: '',
      memberText: '',
      goodsText: '',
      serchText: '',
      userText: '',
      startTime: '',
      endTime: '',
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
          headerName: '消费单号',
          field: 'sc_invoiceCode',

          width: this.nowpx(0.14) + 'px',
        },
        {
          headerName: '消费会员',
          field: 'rpr_member_name',

          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '员工姓名',
          field: 'rpr_user_name',

          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '消费商品',
          field: 'rpr_goods_name',

          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '商品价格',
          field: 'rpr_goods_selling_price',
          width: this.nowpx(0.08) + 'px',
        },

        {
          headerName: '消费数量',
          field: 'rpr_quantity',
          width: this.nowpx(0.06) + 'px',
        },
        // {
        //   headerName: '提成方案',
        //   field: 'rpr_performance_name',
        //   width: this.nowpx(0.06) + 'px',
        // },
        // {
        //   headerName: '提成定额',
        //   field: 'rpr_single_price',
        //   width: this.nowpx(0.06) + 'px',
        // },
        // {
        //   headerName: '提成比例',
        //   field: 'rpr_proportion',
        //   width: this.nowpx(0.06) + 'px',
        // },
        {
          headerName: '小计',
          field: 'rpr_total_price',

          width: this.nowpx(0.08) + 'px',
        },
        {
          headerName: '消费时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          },
          width: this.nowpx(0.1) + 'px',
        },
        {
          headerName: '门店',

          field: 'store.name',
          width: this.nowpx(0.1) + 'px',
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
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    getList() {
      const startTime = this.$q_date.formatDate(this.startTime, 'X');
      const endTime = this.$q_date.formatDate(this.endTime, 'X');
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
        searchSerm: this.serchText,
        memberText: this.memberText,
        startTime,
        endTime,
        name: this.goodsText,
        userText: this.userText,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData,
      };
      this.$store
        .dispatch('rewardPerformance/getRecordData', obj)
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
    setTopTabel(list) {
      const newRows = this.countColumnData(list, [
        {
          rpr_member_name: '数据合计',
          show_status: true,
          rpr_total_price: '',
          rpr_quantity: '',
          rpr_goods_selling_price: '',
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
    // 格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    clearButton() {
      this.memberText = '';
      this.serchText = '';
      this.userText = '';
      this.goodsText = '';
      this.selectStoreData = [];
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
    }, // 表格宽度自适应
  },
};
</script>
