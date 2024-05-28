<template>
  <div class="centerx labelx">
    <div class="row">
      <div class="col-md-4 col-12 q-pr-md q-mt-md">
        <q-card bordered flat>
          <q-card-section>
            <span class="text-subtitle1">计次消费赠积分</span>
            <q-toggle
              v-model="deductCountDataForm.consume_deductCount_pointSwitch"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="
                handleSwitchChange(
                  deductCountDataForm.consume_deductCount_pointSwitch,
                  'consume_deductCount_pointSwitch'
                )
              "
            />
          </q-card-section>
          <q-separator />
          <p class="q-ma-md">
            设置会员计次消费赠积分比例。 如：输入“1” [ 5
            次（计次消费本次扣除的次数） * 1 = 5 积分]
          </p>
          <q-input
            outlined
            bottom-slots
            v-model="deductCountDataForm.consume_deductCount_pointRatio"
            dense
            :rules="[
              val => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的数值'
            ]"
            class="q-px-md"
            @change="
              inputChange(
                deductCountDataForm.consume_deductCount_pointRatio,
                'consume_deductCount_pointRatio'
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
  name: "DeductCountSet",
  data() {
    return {
      pointText: "积分",
      moneyText: "储值",
      deductCountDataForm: {
        consume_deductCount_pointSwitch: "0", //赠送积分开关
        consume_deductCount_pointRatio: "" //赠送积分比率
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
        name: "deductCount"
      };
      this.$store
        .dispatch("settings/getConsumeSet", obj)
        .then(res => {
          if (res.code == 200) {
            this.deductCountDataForm = res.data;
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
      var regu = /^[0-9]+([.]\d{1,2})?$/;
      if (!regu.test(val)) {
        this.$q.notify({
          message: "错误",
          icon: "ion-close-circle-outline",
          timeout: 500,
          position: "top-right",
          caption: "请输入正确的数值",
          color: "red"
        });
        return false;
      }
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
