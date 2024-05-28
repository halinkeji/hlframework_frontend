<template>
  <div>
    <q-btn color="secondary" unelevated class="q-mr-sm" label="每日指标" @click="viewDetail" />
    <q-btn color="info" unelevated class="q-mr-sm" label="员工指标" @click="viewUserDetail" />
    <q-btn color="primary" class="q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="editPotion" />
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
      this.params.context.settleWageBtn(this.dataId);
    },
    confirmDeleteRecord() {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除【${this.params.data.rsi_store_name}" 】的月指标吗`,
          cancel: true,
        })
        .onOk(() => {
          this.$store
            .dispatch('rewardIndicators/delData', [this.dataId])
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除店铺月指标成功',
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
      this.params.context.viewStoreDay(this.params.data);
    },
    viewUserDetail() {
      this.params.context.viewStaff(this.params.data);
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
