<template>
  <div class="q-ma-sm">
    <q-card flat class=" q-pa-md">
      <q-form ref="setRef">
        <div class="text-subtitle2">
          <q-icon name="las la-square-full" class="text-primary" />易货设置
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-8 col-md-6  q-ml-md">
            <q-input
              outlined
              dense
              label="总限制金额"
              :rules="[
                val => !!val || '必填项,可为0',
                val =>
                  /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                  '总限制金额为非负两位以内小数'
              ]"
              v-model="setData.ptc_staff_limit_amount"
            >
              <template v-slot:hint>
                填写无合同会员（员工） 充值（现充值）总限制金额(当天所有)
              </template></q-input
            >
          </div>
        </div>
        <div class="row q-my-sm">
          <div class="col-8 col-md-6 q-ml-md">
            <q-input
              outlined
              dense
              label="赠送限制总金额"
              :rules="[
                val => !!val || '必填项,可为0',
                val =>
                  /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                  '赠送限制总金额为非负两位以内小数'
              ]"
              v-model="setData.ptc_contract_limit_amount"
              ><template v-slot:hint>
                填写有合同的赠送限制总金额(当天所有)
              </template></q-input
            >
          </div>
        </div>
        <div class="row q-pa-md">
          <q-btn
            class="q-px-lg q-mt-md"
            label="提交"
            v-if="authorityMeta('saveSet')"
            unelevated
            @click="saveData"
            color="primary"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>
<script>
export default {
  name: "tradeSet",
  components: {},
  data() {
    return {
      setData: {
        ptc_staff_limit_amount: "0",
        ptc_contract_limit_amount: "0"
      }
    };
  },
  created() {
    this.getItem();
  },
  mounted() {},
  computed: {},
  methods: {
    // 获取单条
    getItem() {
      this.$store.dispatch("tradeSet/getItem").then(res => {
        if (res.code == 200) {
          this.setData = res.data ? res.data : {};
        }
      });
    },
    // 提交
    saveData() {
      this.$refs.setRef.validate().then(success => {
        if (success) {
          let params = {
            ...this.setData
          };
          this.$store
            .dispatch("tradeSet/addData", params)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: "ion-checkmark-circle-outline",
                  timeout: 500,
                  position: "top-right",
                  message: "成功",
                  caption: "修改设置成功",
                  color: "green"
                });
              }
            })
            .catch(error => {
              this.$q.notify({
                message: "失败",
                caption: error.message,
                icon: "ion-close-circle-outline",
                timeout: 500,
                position: "top-right",
                color: "red"
              });
            });
        }
      });
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        let new_arr = this.$route.meta.map(obj => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
