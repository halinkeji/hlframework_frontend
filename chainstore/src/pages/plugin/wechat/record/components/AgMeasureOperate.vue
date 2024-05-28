<template>
  <div>
    <q-btn
      color="red"
      ref="buttonRefss"
      @click="confirmDeleteRecord()"
      v-if="authorityMeta('bak')"
      >撤销激活</q-btn
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
  created() {
    this.dataId = this.params.data.id;
  },
  computed: {},
  methods: {
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: "确定",
          message: `撤销卡号为 "${this.params.data.mcr_card_number}"的激活状态吗？`,
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
      this.$store.dispatch("wechatCard/revokeMemberCard", obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: "成功",
            caption: "撤销激活状态成功！",
            icon: "ion-checkmark-circle-outline",
            color: "green",
            timeout: 500,
            position: "top-right"
          });
          this.params.context.getList();
        } else {
          this.$q.notify({
            message: "失败",
            caption: "撤销激活状态失败！",
            icon: "ion-close-circle-outline",
            color: "red",
            timeout: 500,
            position: "top-right"
          });
        }
      });
    },

    showPopup() {
      this.params.context.addPopup(this.dataId);
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
