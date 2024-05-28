<template>
  <div>
    <q-btn color="secondary" unelevated class="q-mr-sm" label="查看补贴" @click="viewDetail" />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data() {
    return {
      dataId: 0,
    };
  },
  created() {
    this.dataId = this.params.data.id;
  },
  mounted() {},
  computed: {},
  methods: {
    editPotion() {
      this.dataId = this.params.data.id;
      this.params.context.addData(this.dataId);
    },
    confirmDeleteRecord() {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除姓名为 "${this.params.data.pru_name}" 的员工吗`,
          cancel: true,
        })
        .onOk(() => {
          this.$store
            .dispatch('rewardPosition/delUserData', [this.dataId])
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除员工成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green',
                });
                this.params.context.getList();
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red',
              });
            });
        })
        .onCancel(() => {});
    },
    viewDetail() {
      this.params.context.viewRecord(this.params.data);
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id;
        });
        if (newArr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
