<template>
  <div>
    <q-btn
      color="primary"
      class="q-mt-sm q-mx-sm"
      unelevated
      label="修改"
      v-if="authorityMeta('edit')"
      :to="{ name: 'AddPackage', query: { id: this.id } }"
    />
    <q-btn
      color="red"
      class="q-mt-sm"
      unelevated
      label="删除"
      v-if="authorityMeta('del')"
      @click="confirmDeleteRecord()"
    />
  </div>
</template>

<script>
export default {
  name: "AgPackageOperating",
  components: {},
  data() {
    return {
      id: ""
    };
  },
  mounted() {},
  created() {
    this.id = this.params.data.id;
  },
  computed: {},
  methods: {
    //新增复制
    addEditBut() {
      this.$router.push({
        name: "addPackage",
        query: { id: this.params.data.id }
      });
    },

    confirmDeleteRecord() {
      this.$q
        .dialog({
          type: "confirm",

          title: "是否确认",
          message: `删除名称为 "${this.params.data.goo_name}"的套餐吗？`,
          cancel: true
        })
        .onOk(() => {
          this.deleteBut();
        })
        .onCancel(() => {});
    },

    //删除 批量删除
    deleteBut() {
      const obj = [this.params.data.id];
      this.$store
        .dispatch("goodspackage/delData", obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "成功删除",
              color: "green",
              icon: "ion-checkmark-circle-outline",
              timeout: 500,
              position: "top-right"
            });

            setTimeout(() => {
              this.params.context.getGoodsPackageList();
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
