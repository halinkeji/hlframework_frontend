<template>
  <div>
    <q-btn @click="showPopup()" color="primary" class="q-mr-sm">修改 </q-btn>
    <q-btn color="red" ref="buttonRefss" @click="confirmDeleteRecord()"
      >删除</q-btn
    >
  </div>
</template>

<script>
export default {
  name: "AgMeasureOperate",
  data() {
    return {
      params: [],
      dataId: "",
      delectPrompt: false
    };
  },

  mounted() {},
  created() {},
  computed: {},
  methods: {
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: "确定",
          message: `删除名称为 "${this.params.data.gu_name}"的计量单位吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord();
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },

    deleteRecord() {
      const obj = {
        id: this.params.data.id
      };
      this.$store.dispatch("goodsunit/delData", obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: "成功删除计量单位!",
            color: "positive",
            position: "top"
          });
          this.params.context.getGoodsUnitList();
        }
      });
    },

    showPopup() {
      this.dataId = this.params.data.id;
      this.params.context.addPopup(this.dataId);
    }
  }
};
</script>
