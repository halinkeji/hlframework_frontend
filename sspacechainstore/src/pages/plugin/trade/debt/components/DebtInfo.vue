<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px'
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">执行还账</div>
          <q-space />
          <q-btn
            icon="close"
            @click="hideNowPage()"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <q-form ref="dataForm">
            <div>
              <h5 class="q-ma-sm q-ml-lg">总还账:{{ totalDebtMoney }}</h5>
            </div>
            <q-input
              outlined
              v-model="dataForm.tsd_goods_return_amount"
              dense
              label="货物还款"
              class="q-pa-sm q-my-sm"
              @blur="changeAmount('tsd_goods_return_amount')"
              :rules="[
                val => !!val || '请输入正确的货物还款',
                val =>
                  /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                  '货物还款金额为非负两位以内小数'
              ]"
            />

            <q-input
              outlined
              v-model="dataForm.tsd_return_amount"
              dense
              label="转账还款"
              lazy-rules
              class="q-pa-sm q-my-sm"
              @blur="changeAmount('tsd_return_amount')"
              :rules="[
                val => !!val || '请填写转账还款',
                val =>
                  /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                  '转账还款金额为非负两位以内小数'
              ]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn
            label="确定"
            unelevated
            @click="goodsUnitSumbit()"
            color="primary"
            :disable="submitDisabled"
            class="text-right"
          />
          <q-btn
            label="取消"
            color="grey"
            unelevated
            @click="hideNowPage()"
            class="text-right"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "DebtInfo",
  data() {
    return {
      dataId: 0,
      popupActive: false,
      dataForm: {
        tsd_goods_return_amount: "",
        tsd_return_amount: "",
        tsd_status: 3
      },
      selectedDebtData: [],
      totalDebtMoney: 0,
      submitDisabled: false
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    showData(data) {
      this.popupActive = true;
      this.selectedDebtData = data;
      var totalDebtMoney = 0;
      data.forEach(item => {
        if (item.tsd_lend_money_count) {
          totalDebtMoney += this.formatAmount(item.tsd_lend_money_count);
        }
      });
      this.totalDebtMoney = totalDebtMoney;
    },
    goodsUnitSumbit() {
      this.$refs.dataForm.validate().then(success => {
        if (success) {
          var totalAmount =
            this.formatAmount(this.dataForm.tsd_goods_return_amount) +
            this.formatAmount(this.dataForm.tsd_return_amount);
          if (totalAmount < this.totalDebtMoney) {
            this.$q.notify({
              message: "失败",
              caption: "还款金额小于需还金额",
              icon: "ion-close-circle-outline",
              timeout: 800,
              position: "top-right",
              color: "red"
            });
            return false;
          }
          this.submitDisabled = true;
          const obj = {
            dataForm: this.dataForm,
            selectedDebtData: this.selectedDebtData
          };
          this.$store.dispatch("tradeDebt/setData", obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: "成功",
                caption: "还款成功！",
                color: "green",
                icon: "ion-checkmark-circle-outline",
                timeout: 500,
                position: "top-right"
              });
              this.$nextTick(() => {
                this.hideNowPage();
              });
            }
          });
        }
      });
    },
    hideNowPage() {
      this.popupActive = false;
      this.submitDisabled = false;
      this.dataForm.tsd_goods_return_amount = 0;
      this.dataForm.tsd_return_amount = 0;

      this.$emit("getMethods");
    },
    //转格式
    formatAmount(value) {
      if (isNaN(value) || value == "" || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    changeAmount(data) {
      var totalAmount =
        this.formatAmount(this.dataForm.tsd_goods_return_amount) +
        this.formatAmount(this.dataForm.tsd_return_amount);
      if (totalAmount > this.totalDebtMoney) {
        this.$q.notify({
          message: "失败",
          caption: "还款金额大于需还金额",
          icon: "ion-close-circle-outline",
          timeout: 500,
          position: "top-right",
          color: "red"
        });
        this.dataForm[data] = 0;
        return false;
      }
    },
  }
};
</script>
