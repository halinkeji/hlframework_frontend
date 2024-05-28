<template>
  <div class="q-gutter-xs">
    <q-btn
      color="red"
      size="md"
      unelevated
      label="删除"
      @click="deleteInfo()"
    />
    <q-btn
      color="blue"
      size="md"
      unelevated
      label="查看"
      :to="{ name: 'addContract', query: { id: params.data.id } }"
    />
  </div>
</template>
<script>
export default {
  name: "AgButton",
  components: {},
  data() {
    return {
      dataId: ""
    };
  },
  created() {
    this.dataId = this.params.data.id;
  },
  mounted() {},
  computed: {},
  methods: {
    deleteInfo() {
      this.$q
        .dialog({
          title: "确定",
          message: `删除编号为 "${this.params.data.ptc_contract_number}"的合同吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          let params = {
            id: this.params.data.id
          };
          this.$store.dispatch("tradeContract/delData", params).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: "成功",
                caption: "成功删除合同!",
                color: "green",
                icon: "ion-checkmark-circle-outline",
                timeout: 500,
                position: "top-right"
              });
              this.params.context.getContractList();
            }
          });
        });
    }
  }
};
</script>
