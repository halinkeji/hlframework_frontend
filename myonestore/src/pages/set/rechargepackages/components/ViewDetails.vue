<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click="hideNowPage"
          />
        </q-card-section>
        <div class="row text-h6 q-px-md">
          单据详情
        </div>
        <div class="row q-my-sm q-px-md">
          <div class="col-md-3 col-12">
            消费单据号：{{ invoiceData.sc_invoiceCode }}
          </div>
          <div class="col-md-3 col-12">
            会员卡号：{{ invoiceData.sc_memberCardNum }}
          </div>
          <div class="col-md-3 col-12">
            会员姓名：{{ invoiceData.sc_memberName }}
          </div>
          <div class="col-md-3 col-12">
            应付金额：￥{{
              invoiceData.sc_handleMoneyCount
                ? invoiceData.sc_handleMoneyCount
                : 0
            }}
          </div>
        </div>
        <div class="row q-my-sm q-px-md">
          <div class="col-md-3 col-12">
            实收金额：￥{{
              invoiceData.sc_realMoneyCount ? invoiceData.sc_realMoneyCount : 0
            }}
          </div>
          <div class="col-md-3 col-12">
            扣除储值：￥{{
              invoiceData.sc_rechargePaymentCount
                ? invoiceData.sc_rechargePaymentCount
                : 0
            }}
          </div>
          <div class="col-md-3 col-12">
            获得积分：{{
              invoiceData.sc_getPoint ? invoiceData.sc_getPoint : 0
            }}
          </div>
          <div class="col-md-3 col-12">备注：{{ invoiceData.sc_note }}</div>
        </div>
        <div class="row q-my-sm q-px-md">
          <!-- <div class="col-md-3 col-12">
            时间：{{
              $q_date.formatDate(
                invoiceData.created_at * 1000,
                "YYYY-MM-DD HH:mm"
              )
            }}
          </div> -->
          <div class="col-md-3 col-12">
            操作员：
            <q-chip square color="green" text-color="white" size="12px">
              {{ invoiceData.user_id }}
            </q-chip>
          </div>
          <div class="col-md-3 col-12">
            支付状态：
            <q-chip square color="green" text-color="white" size="12px">
              {{
                invoiceData.sc_pay_status_label
                  ? invoiceData.sc_pay_status_label
                  : "未支付"
              }}
            </q-chip>
          </div>
          <div class="col-md-3 col-12">
            支付方式：
            <q-chip square color="green" text-color="white" size="12px">
              {{ invoiceData.sc_consumePayType }}
            </q-chip>
          </div>
        </div>

        <div v-if="invoiceData.pointsCountRecord.length">
          <q-separator class="q-mt-md" />
          <q-table
            title="积分详情"
            :data="invoiceData.pointsCountRecord"
            :columns="integralData"
            row-key="name"
            hide-bottom
          />
        </div>
        <div v-if="invoiceData.moneyCountRecord.length">
          <q-separator class="q-mt-md" />
          <q-table
            title="储值详情"
            :data="invoiceData.moneyCountRecord"
            :columns="storedData"
            row-key="name"
            hide-bottom
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "ViewDetails",
  data() {
    return {
      dialogWidth: "1000px",
      mailTo: "",
      invoiceData: {
        consumeInvoiceDetail: [],
        memberRechargeCountDetail: [],
        pointsCountRecord: [],
        moneyCountRecord: []
      },
      viewDetails: false,
      // 积分详情
      integralData: [
        {
          label: "变更积分",
          align: "left",
          field: "pcr_pointsCount"
        },
        {
          align: "left",
          label: "积分来源",
          field: "pcr_pointsCountSource"
        },
        {
          label: "积分状态",
          align: "left",
          field: "pcr_pointsCountStatus"
        },
        { label: "时间", align: "left", field: "carbs" },
        {
          label: "操作行为",
          align: "left",
          field: "pcr_operatingBehavior"
        },
        { label: "是否平台", align: "left", field: "sodium" }
      ],
      // 储值详情
      storedData: [
        {
          label: "变更储值",
          align: "left",
          field: "mcr_moneyCount"
        },
        {
          align: "left",
          label: "储值来源",
          field: "mcr_moneyCountSource"
        },
        {
          label: "储值状态",
          align: "left",
          field: "mcr_moneyCountStatus"
        },
        { label: "时间", align: "left", field: "carbs" },
        {
          label: "操作行为",
          align: "left",
          field: "mcr_operatingBehavior"
        },
        { label: "是否平台", align: "left", field: "sodium" }
      ]
    };
  },
  components: {},
  mounted() {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + "px";
    }
  },

  computed: {},
  methods: {
    getViewData(id) {
      this.viewDetails = true;

      if (id > 0) {
        const obj = {
          id: id
        };
        this.$store
          .dispatch("invoice/getInvoiceView", obj)
          .then(res => {
            if (res.code == 200) {
              if (res.data) {
                this.invoiceData = res.data;
              } else {
                this.invoiceData = [];
              }
            }
          })
          .catch(error => {});
      }
    },
    hideNowPage() {
      this.viewDetails = false;
    }
  }
};
</script>

<style lang="scss">
@media print {
  .invoice-page {
    * {
      visibility: hidden;
    }

    #content-area {
      margin: 0 !important;
    }

    .vs-con-table {
      .vs-con-tbody {
        overflow: hidden !important;
      }
    }

    #invoice-container,
    #invoice-container * {
      visibility: visible;
    }
    #invoice-container {
      position: absolute;
      left: 0;
      top: 0;
      box-shadow: none;
    }
  }
}

@page {
  size: auto;
}
</style>
