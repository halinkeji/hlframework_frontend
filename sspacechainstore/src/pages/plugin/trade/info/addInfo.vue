<template>
  <q-page class="q-pa-md">
    <q-card flat class=" q-pa-md ">
      <q-form ref="dataRef">
        <div>
          <hl-card-reading
            ref="memberCardReading"
            navType="horizontal"
            v-if="!dataFrom.id"
            @refreshDataList="getMemberInfo"
          ></hl-card-reading>
        </div>

        <div class="row  q-my-lg">
          <div class="col-12 col-md-5 ">
            <q-select
              dense
              outlined
              :disable="dataFrom.id > 0"
              v-model="dataFrom.ptc_contract_id"
              :options="contractOptions"
              option-value="id"
              @input="changeContractInfo()"
              option-label="ptc_contract_number"
              label="选择合同"
              emit-value
              map-options
              lazy-rules
            />
          </div>
        </div>

        <div class="row  q-my-lg">
          <div class="col-12 col-md-4 ">
            信息费:
            <span class="text-h6">
              {{ formatAmount(contractInfo.ptc_info_cost) }}</span
            >
          </div>
          <div class="col-12 col-md-4 ">
            本合同已缴纳信息费:<span class="text-h6">
              {{ formatAmount(contractInfo.thawMessageCount) }}</span
            >
          </div>
          <div class="col-12 col-md-4 ">
            本合同剩余缴纳信息费:<span class="text-h6">
              {{
                formatAmount(
                  formatAmount(contractInfo.ptc_info_cost) -
                    formatAmount(contractInfo.thawMessageCount)
                )
              }}</span
            >
          </div>
        </div>

        <div class="row q-my-lg">
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            v-model="dataFrom.ptc_info_cost"
            @blur="inputChangeMoney"
            lazy-rules
            :rules="[val => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入金额']"
            label="信息费"
          />
        </div>
        <div class="row  q-my-lg">
          <div class="col-12 col-md-4 ">
            合同货物金额:<span class="text-h6">
              {{ formatAmount(contractInfo.ptc_contract_amount) }}</span
            >
          </div>
          <div class="col-12 col-md-4 ">
            本合同已入货物金额 :<span class="text-h6">
              {{ formatAmount(contractInfo.thawCount) }}</span
            >
          </div>
          <div class="col-12 col-md-4 ">
            本合同剩余货物金额:<span class="text-h6">
              {{
                formatAmount(
                  formatAmount(contractInfo.ptc_contract_amount) -
                    formatAmount(contractInfo.thawCount)
                )
              }}</span
            >
          </div>
        </div>
        <div class="row  q-my-lg">
          <q-input
            class="col-12 col-md-5 "
            outlined
            dense
            @change="inputChangeMessageMoney"
            v-model="dataFrom.ptc_contract_amount"
            lazy-rules
            :rules="[val => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入金额']"
            label="货物金额"
          />
        </div>

        <div class="row">
          <q-input
            :rows="2"
            dense
            outlined
            class="q-mb-md col-12 col-md-6"
            label="备注"
            v-model="dataFrom.ptc_remarks"
            type="textarea"
          />
        </div>

        <div align="right" class="q-mt-xl">
          <q-btn
            unelevated
            label="确认"
            color="primary"
            :disable="dataFrom.ptc_member_id < 1 || addButtonDisabled"
            v-if="!dataFrom.id"
            @click="setData"
          />
          <q-btn
            unelevated
            label="关闭"
            class="q-ml-sm"
            color="grey"
            :to="{ name: 'trade' }"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>
<script>
export default {
  name: "addTradeInfo",
  components: {},
  data() {
    return {
      addButtonDisabled: false,
      contractOptions: [],
      contractInfo: {},
      dataFrom: {
        ptc_type: 2,
        ptc_contract_amount: "",
        ptc_contract_number: "",
        ptc_pay_type: "",
        ptc_info_cost: "",
        ptc_contract_id: "",
        ptc_contract_number: "",
        ptc_remarks: "",
        ptc_member_id: 0
      }
    };
  },
  created() {
    if (this.$route.query.id > 0) {
      this.dataFrom.id = this.$route.query.id;
      this.init(this.$route.query.id);
    }
  },
  mounted() {},
  computed: {},
  methods: {
    //读卡
    getMemberInfo(val) {
      if (val) {
        if (val.id) {
          this.dataFrom = {
            ptc_type: 2,
            ptc_contract_amount: "",
            ptc_contract_number: "",
            ptc_pay_type: "",
            ptc_info_cost: "",
            ptc_contract_id: "",
            ptc_contract_number: "",
            ptc_remarks: ""
          };
          this.contractInfo = {};
          this.dataFrom.ptc_member_id = val.id;
          this.getList(val.id);
        }
      }
    },
    getList(ptc_member_id) {
      let params = {
        ptc_member_id: ptc_member_id
      };
      this.$store
        .dispatch("tradeInfo/getListData", params)
        .then(res => {
          if (res.code == 200) {
            this.contractOptions = res.data ? res.data : [];
            this.changeContractInfo();
          }
        })
        .catch(res => {
          this.$q.notify({
            message: "失败",
            caption: res.message,
            icon: "ion-close-circle-outline",
            timeout: 500,
            position: "top-right",
            color: "red"
          });
        });
    },
    //转格式
    formatAmount(value) {
      if (isNaN(value) || value == "" || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    init(id) {
      this.dataFrom.id = id;
      if (id > 0) {
        this.$store.dispatch("tradeContract/getItemData", id).then(res => {
          if (res.code == 200) {
            this.dataFrom = res.data;
            this.$nextTick(() => {
              this.getList(this.dataFrom.contract.ptc_member_id);
            });
          } else {
            this.$q.notify({
              message: "失败",
              caption: "操作失败",
              icon: "ion-close-circle-outline",
              timeout: 500,
              position: "top-right",
              color: "red"
            });
          }
        });
      }
    },
    setData() {
      this.$refs.dataRef.validate().then(success => {
        if (success) {
          if (
            this.dataFrom.ptc_info_cost == 0 &&
            this.dataFrom.ptc_contract_amount == 0
          ) {
            this.$q.notify({
              message: "提交失败",
              caption: "信息费及货物金额为空，不可提交！",
              icon: "ion-close-circle-outline",
              timeout: 500,
              position: "top-right",
              color: "red"
            });
            return false;
          }

          this.addButtonDisabled = true; //禁用提交按钮
          let data = {
            ...this.dataFrom
          };
          this.$store.dispatch("tradeContract/setData", data).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: "成功",
                caption: "新增成功",
                icon: "ion-checkmark-circle-outline",
                timeout: 500,
                position: "top-right",
                color: "green"
              });
              this.$router.push({ name: "trade" });
            } else {
              this.addButtonDisabled = false;
              this.$q.notify({
                message: "失败",
                caption: res.message,
                color: "red",
                icon: "ion-close-circle-outline",
                timeout: 500,
                position: "top-right"
              });
            }
          });
        }
      });
    },
    changeContractInfo() {
      this.dataFrom.ptc_info_cost = "";
      this.dataFrom.ptc_contract_amount = "";
      if (this.contractOptions) {
        this.contractOptions.forEach(item => {
          if (parseInt(this.dataFrom.ptc_contract_id) == parseInt(item.id)) {
            this.contractInfo = item;
            this.dataFrom.ptc_contract_number = this.contractInfo.ptc_contract_number;
          }
        });
      }
    },
    inputChangeMoney() {
      var lastMoneyCount =
        this.formatAmount(this.contractInfo.ptc_info_cost) -
        this.formatAmount(this.contractInfo.thawMessageCount);
      if (
        this.formatAmount(this.dataFrom.ptc_info_cost) >
        this.formatAmount(lastMoneyCount)
      ) {
        this.dataFrom.ptc_info_cost = "";
      }
    },
    inputChangeMessageMoney() {
      var lastMoneyCount =
        this.formatAmount(this.contractInfo.ptc_contract_amount) -
        this.formatAmount(this.contractInfo.thawCount);

      if (
        this.formatAmount(this.dataFrom.ptc_contract_amount) >
        this.formatAmount(lastMoneyCount)
      ) {
        this.dataFrom.ptc_contract_amount = "";
      }
    }
  }
};
</script>
