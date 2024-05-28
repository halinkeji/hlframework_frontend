<template>
  <div>
    <q-btn color="primary" class="q-mx-sm" unelevated icon="edit" :to="{ name: 'editMerchant', query: { sId: dataId } }">
      <q-tooltip>
        店铺管理
      </q-tooltip>
    </q-btn>

    <!-- <q-btn
      color="red"
      class=" q-mt-sm"
      unelevated
      flat
      icon="delete_outline"
      @click="confirmDeleteRecord"
    /> -->
    <q-btn @click="showPopup()" color="secondary" class="q-mr-sm" unelevated icon="lar la-edit">
      <q-tooltip>
        授信额度设置
      </q-tooltip>
    </q-btn>
    <q-btn @click="setDepot()" color="secondary" class="q-mr-sm" unelevated icon="las la-clinic-medical" v-if="params.data.lib_id != params.data.id">
      <q-tooltip>
        生成店仓
      </q-tooltip>
    </q-btn>
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
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名称为 ${this.params.data.name} 的商户吗`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteRecord();
        })
        .onCancel(() => {});
    },
    deleteRecord() {
      const obj = [this.dataId];
      this.$store
        .dispatch('merchant/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除商户成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
            this.params.context.getList();
          }
        })
        .catch((error) => {
          this.$q.notify({
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red',
          });
        });
    },
    setDepot() {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定生成店仓？',
          cancel: true,
        })
        .onOk(() => {
          this.$store
            .dispatch('clothingDepot/setStoreDepot', { store: this.params.data, StoreId: this.dataId })
            .then((res) => {
              if (res.code == 200) {
                if (res.data.code == 400) {
                  this.$q.notify({
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    message: '失败',
                    caption: res.data.message,
                    color: 'red',
                  });
                } else {
                  this.$q.notify({
                    message: '成功',
                    caption: '生成店仓成功',
                    color: 'green',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                  });
                }
                this.params.context.getList();
              } else {
                this.$q.notify({
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                });
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red',
              });
            });
        })
        .onCancel(() => {});
    },

    showPopup() {
      this.dataId = this.params.data;
      this.params.context.showStoreCredit(this.dataId);
    },
  },
};
</script>
