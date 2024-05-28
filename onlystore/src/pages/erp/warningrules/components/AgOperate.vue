<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      @click="editData"
      v-if="authorityMeta('edit')"
      >修改</q-btn
    >
    <q-btn
      unelevated
      @click="confirmDeleteRecord"
      v-if="authorityMeta('del')"
      color="red"
      class="q-ml-sm"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: "AgOperate",
  components: {},
  data() {
    return {
      dataId: ""
    };
  },
  methods: {
    editData() {
      this.dataId = this.params.data.id;
      this.$nextTick(() => {
        this.params.context.editData(this.dataId);
      });
    },
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: "是否确认",
          message: `删除名称为 "${this.params.data.wr_title}"的预警规则吗？`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id];
          this.$store.dispatch("warningRules/delData", obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: "成功",
                caption: "成功删除预警规则！",
                icon: "ion-checkmark-circle-outline",
                color: "green",
                timeout: 500,
                position: "top-right"
              });
              this.params.context.getRuleList();
            }
          });
        })
        .onCancel(() => {});
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
