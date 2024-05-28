<template>
  <div>
    <q-toggle
      v-model="switchStore"
      :true-value="1"
      :false-value="2"
      @input="statusBut()"
      v-if="authorityMeta('edit')"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: "AgOperating",
  data() {
    return {
      switchStore: 2
    };
  },

  mounted() {},
  created() {
    this.switchStore = this.params.data.cou_status == "1" ? 1 : 2;
  },
  computed: {},
  methods: {
    //修改状态
    statusBut() {
      const obj = {
        id: this.params.data.id,
        cou_status: this.switchStore
      };
      this.$store
        .dispatch("hlCoupon/addData", obj)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: "green",
              message: "成功",
              caption: "状态修改成功",
              icon: "ion-checkmark-circle-outline",
              timeout: 500,
              position: "top-right"
            });
            setTimeout(() => {
              this.params.context.getCouponsList();
            }, 100);
          }
        })
        .catch(error => {
          this.$q.notify({
            message: "失败",
            icon: "ion-close-circle-outline",
            timeout: 500,
            position: "top-right",
            caption: "操作失败",
            color: "red"
          });
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
