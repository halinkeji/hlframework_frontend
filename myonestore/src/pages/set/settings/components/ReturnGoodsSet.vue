<template>
  <div class="centerx labelx">
    <div class="row">
      <div class="col-md-4 col-12 q-pr-md q-mt-md">
        <q-card bordered flat>
          <q-card-section>
            <span class="text-subtitle1">顾客退货金额扣除积分</span>
            <q-toggle
              v-model="returnGoodsDataForm.consume_returnGoods_pointSwitch"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="
                handleSwitchChange(
                  returnGoodsDataForm.consume_returnGoods_pointSwitch,
                  'consume_returnGoods_pointSwitch'
                )
              "
            />
          </q-card-section>
          <q-separator />
          <p class="q-ma-md">
            设置顾客退货扣除积分比例。 如：输入“1” [退货 10 元 * 1 = 10 积分]
          </p>
          <q-input
            outlined
            bottom-slots
            v-model="returnGoodsDataForm.consume_returnGoods_pointRatio"
            dense
            class="q-px-md"
            @change="
              inputChange(
                returnGoodsDataForm.consume_returnGoods_pointRatio,
                'consume_returnGoods_pointRatio'
              )
            "
          >
          </q-input>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReturnGoodsSet",
  data() {
    return {
      returnGoodsDataForm: {
        consume_returnGoods_pointSwitch: 0, //赠送积分开关
        consume_returnGoods_pointRatio: "" //赠送积分比率
      }
    };
  },
  mounted() {
    this.getConsumeSet();
  },
  created() {},
  computed: {},
  methods: {
    getConsumeSet() {
      var obj = {
        name: "returnGoods"
      };
      this.$store
        .dispatch("settings/getConsumeSet", obj)
        .then(res => {
          if (res.code == 200) {
            this.returnGoodsDataForm = res.data;
          }
        })
        .catch(error => {});
    },
    handleSwitchChange(val, keyName) {
      var vald = val ? 1 : 0;
      var obj = {};
      obj[keyName] = vald;
      this.$store
        .dispatch("settings/addSet", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "添加成功",
              icon: "ion-checkmark-circle-outline",
              color: "green",
              position: "top-right"
            });
            this.getConsumeSet();
          }
        })
        .catch(error => {});
    },
    inputChange(val, keyName) {
      var obj = {};
      obj[keyName] = val;
      this.$store
        .dispatch("settings/addSet", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "添加成功",
              icon: "ion-checkmark-circle-outline",
              color: "green",
              position: "top-right"
            });
            this.getConsumeSet();
          }
        })
        .catch(error => {});
    }
  }
};
</script>

<style></style>
