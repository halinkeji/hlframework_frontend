<template>
  <div>
    <q-card square flat class="q-pa-sm q-mb-md">
      <div class="row">
        <q-select
          class="col-12 col-md-3 q-mt-sm q-mr-sm"
          outlined
          option-value="value"
          option-label="label"
          emit-value
          clearable
          map-options
          :options="consumeTypeData"
          multiple
          v-model="searchFrom.sc_consumeType"
          dense
          label="请选择消费方式"
        />
        <q-select
          class="col-12 col-md-2 q-mt-sm q-mr-sm"
          outlined
          option-value="value"
          option-label="text"
          emit-value
          map-options
          :options="type"
          v-model="searchFrom.consumePayType"
          dense
          label="选择支付方式"
        />
        <div class="col-12 col-md-3 q-mr-sm q-mt-sm">
          <q-input
            label="请输入单据号"
            outlined
            v-model="searchFrom.searchSerm"
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-mt-sm q-mr-sm">
          <q-input
            label="请输入会员卡号|昵称"
            outlined
            v-model="searchFrom.memberText"
            dense
          />
        </div>
        <q-btn
          @click="getSummaryList()"
          color="primary"
          class="q-mt-sm col-12 col-md-1 q-mr-sm"
          unelevated
          label="搜索"
        />
        <q-btn
          @click="resetBut()"
          color="warning"
          class="q-mt-sm col-12 col-md-1 q-mr-sm"
          unelevated
          label="重置"
        />
      </div>
    </q-card>
    <div class="q-mt-sm" :style="`height:${gridOptions.rowHeight * 10}px`">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        :rowData="consumeData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="50"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
        :localeText="localeText"
        :context="context"
      ></ag-grid-vue>
    </div>
    <div class="row q-mt-sm ">
      <div class="col-6 	">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
        ></hl-pagination>
      </div>
      <div class="col-6 q-gutter-xs row justify-end">
        <q-input
          class="col-6"
          outlined
          dense
          v-model="dayknotForm.psi_fixed_costs"
          label="固定成本"
        />
        <div class="col-3">
          <q-btn
            color="primary"
            @click="saveSettlementRecord"
            unelevated
            label="今日结算"
            :disable="lastRecordStatus"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AgInvoiceOperating from "pages/set/invoice/components/AgInvoiceOperating.vue";

export default {
  name: "ConsumDetail",
  components: {
    AgInvoiceOperating
  },
  data() {
    return {
      components: {
        AgInvoiceOperating
      },
      type: this.$store.state.invoice.consumePayType,
      consumeTypeData: this.$store.state.invoice.consumeTypeData,
      couponsType: "",
      searchFrom: {
        sc_consumeType: [],
        consumePayType: "",
        userId: "",
        searchSerm: "",
        payStatus: "",
        member_id: 0,
        created_at: "",
        updated_at: ""
      },
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0
      },
      gridOptions: {},
      consumeData: [],
      dataListSelections: [],
      columnDefs: [
        //表格列数据
        {
          headerName: "消费单据号", //列标题
          field: "sc_invoiceCode", //列与数据源对应的字段
          filter: false,
          width: this.nowpx(0.13) + "px"
        },
        {
          headerName: "会员卡号",
          field: "sc_memberCardNum",
          filter: false,
          width: this.nowpx(0.13) + "px"
        },
        {
          headerName: "消费场景",
          field: "sc_consumeTypeName",
          filter: false,
          width: this.nowpx(0.1) + "px"
        },
        {
          headerName: "规则优惠",
          filter: false,
          field: "sc_rulePaymentCount",
          width: this.nowpx(0.08) + "px"
        },

        {
          headerName: "储值支付",
          filter: false,
          field: "sc_rechargePaymentCount",
          valueGetter: p => {
            return p.data.sc_rechargePaymentCount > 0
              ? p.data.sc_rechargePaymentCount
              : 0;
          },
          width: this.nowpx(0.08) + "px"
        },

        {
          headerName: "积分支付",
          filter: false,
          field: "sc_pointPaymentCount",
          valueGetter: p => {
            return p.data.sc_pointPaymentCount > 0
              ? p.data.sc_pointPaymentCount
              : 0;
          },
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "优惠券抵现",
          filter: false,
          field: "sc_couponPaymentCount",
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "实收金额",
          filter: false,
          field: "sc_realMoneyCount",
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "支付状态",
          filter: false,
          field: "sc_pay_status_label",
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "支付方式",
          filter: false,
          field: "sc_consumePayType",
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "银行卡支付",
          filter: false,
          field: "sc_blankPaymentCount",
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "(刷卡)微信支付",
          filter: false,
          field: "sc_wechatPaymentCount",
          valueGetter: p => {
            return p.data.sc_wechatPaymentCount > 0
              ? p.data.sc_wechatPaymentCount
              : 0;
          },
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "(刷卡)支付宝支付",
          filter: false,
          field: "sc_alipayPaymentCount",
          width: this.nowpx(0.08) + "px",
          valueGetter: p => {
            return p.data.sc_alipayPaymentCount > 0
              ? p.data.sc_alipayPaymentCount
              : 0;
          }
        },
        {
          headerName: "个人微信支付",
          field: "sc_wechatPersonalPaymentCount",
          filter: false,
          width: this.nowpx(0.08) + "px",
          valueGetter: p => {
            return p.data.sc_wechatPersonalPaymentCount > 0
              ? p.data.sc_wechatPersonalPaymentCount
              : 0;
          }
        },
        {
          headerName: "个人支付宝支付",
          field: "sc_alipayPersonalPaymentCount",
          filter: false,
          width: this.nowpx(0.08) + "px",
          valueGetter: p => {
            return p.data.sc_alipayPersonalPaymentCount > 0
              ? p.data.sc_alipayPersonalPaymentCount
              : 0;
          }
        },

        {
          headerName: "现金支付",
          field: "sc_cashPaymentCount",
          filter: false,
          width: this.nowpx(0.08) + "px",
          valueGetter: p => {
            return p.data.sc_cashPaymentCount > 0
              ? p.data.sc_cashPaymentCount
              : 0;
          }
        },

        {
          headerName: "其他支付",
          field: "sc_otherPaymentCount",
          filter: false,
          width: this.nowpx(0.1) + "px",
          valueGetter: p => {
            return p.data.sc_otherPaymentCount > 0
              ? p.data.sc_otherPaymentCount
              : 0;
          }
        },

        {
          headerName: "操作员",
          field: "user.username",
          filter: false,
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "备注",
          field: "sc_note",
          filter: false,
          width: this.nowpx(0.1) + "px"
        },
        {
          headerName: "添加时间",
          field: "created_at",
          valueGetter: p => {
            return this.$q_date.formatDate(
              p.data.created_at * 1000,
              "YYYY-MM-DD HH:mm"
            );
          },
          width: this.nowpx(0.08) + "px"
        },
        {
          headerName: "操作",
          field: "goo_price",
          filter: false,
          pinned: "right",
          cellRendererFramework: "AgInvoiceOperating",
          width: 150
        }
      ],
      localeText: this.$ag_grid_localeText,
      dayknotForm: {
        psi_fixed_costs: ""
      },
      lastRecordStatus: false
    };
  },
  created() {
    this.getSummaryList();
    this.getLastRecordStatus();
  },
  computed: {},
  mounted() {},
  methods: {
    // 获取汇总数据
    getSummaryList() {
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        created_at: this.todayTime().startTime,
        updated_at: this.todayTime().endTime
      };
      this.$store
        .dispatch("shift/getConsumList", obj)
        .then(res => {
          if (res.code == 200) {
            this.consumeData = res.data.list;
            this.page.totalCount = res.data ? res.data.page.totalCount : 0;
          }
        })
        .catch(error => {
          this.$q.notify({
            message: "失败",
            icon: "ion-close-circle-outline",
            timeout: 500,
            position: "top-right",
            caption: error.message,
            color: "red"
          });
        });
    },
    //每页数
    sizeChangeHandle(val) {
      this.page.pSize = val;
      this.page.pageIndex = 1;
      this.getSummaryList();
    },
    //当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getSummaryList();
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    onFirstDataRendered(params) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
    resetBut() {
      this.searchFrom = {
        consumePayType: "",
        userId: "",
        searchSerm: "",
        payStatus: "",
        member_id: 0,
        created_at: "",
        updated_at: "",
        memberText: ""
      };
      this.startTime = "";
      this.getSummaryList();
    },
    //格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == "" || value == undefined) {
        return 0.0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },

    todayTime(time = null) {
      time = time ? time : new Date();
      return {
        startTime: parseInt(
          new Date(time.setHours(0, 0, 0, 0)).getTime() / 1000
        ),
        endTime: parseInt(new Date(time.setHours(23, 59, 59, 999)) / 1000)
      };
    },

    saveSettlementRecord() {
      const obj = {
        ...this.dayknotForm
      };

      this.$store
        .dispatch("shift/saveDayknotRecord", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "生成日结记录成功",
              icon: "ion-checkmark-circle-outline",
              timeout: 500,
              position: "top-right",
              color: "green"
            });
            this.$router.push({ name: "dayknotRecord" });
          } else {
            this.$q.notify({
              message: "失败",
              icon: "ion-close-circle-outline",
              timeout: 500,
              position: "top-right",
              caption: res.message,
              color: "red"
            });
          }
        })
        .catch(error => {
          this.$q.notify({
            message: "失败",
            icon: "ion-close-circle-outline",
            timeout: 500,
            position: "top-right",
            caption: error.message,
            color: "red"
          });
        });
    },

    getLastRecordStatus() {
      this.$store
        .dispatch("shift/getLastStatus")
        .then(res => {
          if (res.code == 200) {
            this.lastRecordStatus = res.data;
          }
        })
        .catch(error => {
          this.$q.notify({
            message: "失败",
            icon: "ion-close-circle-outline",
            timeout: 500,
            position: "top-right",
            caption: error.message,
            color: "red"
          });
        });
    }
  }
};
</script>
