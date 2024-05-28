<template>
  <div class="q-gutter-x-xs row ">
    <q-input
      class="col-12 col-md-3 q-mt-sm "
      label="次卡核销码"
      outlined
      v-model="check"
      @keyup.enter.native="timeCardCheck"
      dense
    />
    <q-btn
      color="primary"
      class=" q-mt-sm"
      unelevated
      v-if="authorityMeta('check')"
      label="次卡核销"
      @click="timeCardCheck"
    />
  </div>
</template>
<script>
export default {
  name: "TimeCardCheck",
  data() {
    return { check: "" };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    timeCardCheck() {
      const obj = {
        mark_code: this.check
      };
      this.$store
        .dispatch("deductCount/timecardcheck", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              color: "green",
              message: "成功",
              caption: "核销成功",
              icon: "ion-checkmark-circle-outline",
              timeout: 500,
              position: "top-right"
            });
            this.check = "";
            this.$emit("updataList");
          } else {
            this.check = "";
            this.$q.notify({
              message: "失败",
              caption: res.message,
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
          }
        })
        .catch(error => {});
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
