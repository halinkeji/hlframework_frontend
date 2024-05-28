<template>
  <div>
    <q-select
      :style="{
        width: params.colDef.width + 'px'
      }"
      option-value="value"
      option-label="name"
      emit-value
      map-options
      outlined
      v-if="authorityMeta('edit')"
      dense
      @input="changeType"
      v-model="template_number"
      :options="roleOptions"
    />
  </div>
</template>

<script>
export default {
  name: "AgSelect",
  data() {
    return {
      roleOptions: [],
      template_number: ""
    };
  },
  mounted() {},
  created() {
    this.roleOptions = this.params.context.roleOptions;
    this.template_number = this.params.data.template_number;
  },
  computed: {},
  methods: {
    changeType() {
      const obj = {
        template_number: this.template_number,
        id: this.params.data.id
      };
      this.$store
        .dispatch("wechatTemplate/setData", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "修改绑定成功",
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

<style></style>
