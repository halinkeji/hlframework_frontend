<template>
  <div>
    <q-btn
      @click="$router.push({ name: 'addReply', params: { id: dataId } })"
      color="primary"
      v-if="authorityMeta('edit')"
      class="q-mr-sm"
      >修改
    </q-btn>
    <q-btn
      color="red"
      ref="buttonRefss"
      @click="confirmDeleteRecord()"
      v-if="authorityMeta('del')"
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
  created() {
    this.dataId = this.params.data.id;
  },
  computed: {},
  methods: {
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: "确定",
          message: `删除名称为 "${this.params.data.name}"的回复规则吗？`,
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
      this.$store.dispatch("wechatRule/delData", obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: "成功删除自定回复!",
            color: "positive",
            position: "top"
          });
          this.params.context.getRuleList();
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
