<template>
  <div>
    <q-btn flat rounded color="red" icon="delete_forever" @click="del" />
  </div>
</template>
<script>
export default {
  name: "RecordAgOperate",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {
    del() {
      this.$q
        .dialog({
          title: "确定",
          message: `删除名称为 "${this.params.data.pkr_item_name}"的开支项吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          };
          this.$store.dispatch("kzls/delRecordAll", obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: "成功",
                caption: "成功删除开支项!",
                color: "green",
                icon: "ion-checkmark-circle-outline",
                timeout: 500,
                position: "top-right"
              });
              this.params.context.getList();
            }
          });
        });
    }
  }
};
</script>
