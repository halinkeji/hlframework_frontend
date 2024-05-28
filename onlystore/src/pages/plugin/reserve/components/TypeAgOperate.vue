<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      class="q-mr-sm"
      label="编辑"
      v-if="authorityMeta('editType')"
      @click="showAddType"
    />
    <q-btn
      unelevated
      color="red"
      label="删除"
      @click="del"
      v-if="authorityMeta('delType')"
    />
  </div>
</template>
<script>
export default {
  name: "TypeAgOperate",
  data() {
    return {
      dataId: ""
    };
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {
    showAddType() {
      this.dataId = this.params.data.id;
      this.params.context.showAddType(this.dataId);
    },
    del() {
      this.$q
        .dialog({
          title: "确定",
          message: `删除名称为 "${this.params.data.prt_name}"的预约分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          };
          this.$store.dispatch("reserve/delReserveType", obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: "成功",
                caption: "成功删除预约分类!",
                color: "green",
                icon: "ion-checkmark-circle-outline",
                timeout: 500,
                position: "top-right"
              });
              this.params.context.getList();
            }
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
