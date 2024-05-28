<template>
  <div>
    <q-toggle
      v-model="switchStore"
      :true-value="1"
      :false-value="0"
      v-if="authorityMeta('edit')"
      @input="updated"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: "AgMode",
  data() {
    return {
      ModeData: {},
      switchStore: true
    };
  },

  mounted() {},
  computed: {},
  created() {
    this.ModeData = this.params.data;
    if (this.params.data.status == 1) {
      this.switchStore = 1;
    } else {
      this.switchStore = 0;
    }
  },
  methods: {
    updated() {
      let status;
      if (this.switchStore == true) {
        status = this.switchStore + 0;
      } else {
        status = this.switchStore + 2;
      }
      const obj = {
        status: status,
        id: this.params.data.id
      };
      this.$store
        .dispatch("wechatTemplate/setData", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "修改状态成功",
              color: "green",
              icon: "ion-checkmark-circle-outline",
              timeout: 500,
              position: "top-right"
            });
          }
        })
        .catch(error => {
          this.$q.notify({
            message: error.message,
            icon: "ion-close-circle-outline",
            timeout: 500,
            position: "top-right",
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

<style scoped></style>
