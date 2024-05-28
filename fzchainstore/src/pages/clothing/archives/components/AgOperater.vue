<template>
  <div>
    <q-btn
      class="q-ma-xs"
      :to="{ name: 'addClothingArchives', query: { id: this.params.data.bid } }"
      color="primary"
      v-if="authorityMeta('edit')"
      icon="create"
      flat
      round
      size="sm"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">修改</q-tooltip>
    </q-btn>
    <q-btn class="q-ma-xs" @click="confirmDeleteRecord()" color="red" v-if="authorityMeta('del')" icon="delete_forever" flat round size="sm">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">删除</q-tooltip>
    </q-btn>
    <q-btn class="q-ma-xs" @click="printerBut(params.data.bid)" color="info"  icon="print" flat round size="sm">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">打印</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgMeasureOperate',
  data() {
    return {
      params: [],
      dataId: '',
      delectPrompt: false,
    };
  },

  mounted() {},
  created() {},
  computed: {},
  methods: {
    confirmDeleteRecord() {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.goo_name}"的商品档案吗？`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.deleteRecord();
        });
    },

    deleteRecord() {
      const obj = {
        id: this.params.data.bid,
      };
      this.$store.dispatch('clothingArchives/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除商品档案!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
          });
          this.params.context.getList();
        }
      });
    },

    showPopup() {
      this.dataId = this.params.data.id;
      this.params.context.addPopup(this.dataId);
    },
    printerBut(id) {
      this.$q
        .dialog({
          title: '批量打印',
          message: '打印类型:',
          options: {
            type: 'radio',
            model: 'label',
            inline: true,
            isValid: (val) => !!val,
            items: [
              { label: '标签', value: 'label', color: 'secondary' },
              { label: '吊牌', value: 'hangTag' },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          const obj = {
            goodsData: [id],
            model: data,
          };
          this.params.context.printerGoods(obj);
        })
        .onCancel(() => {});
    },
    authorityMeta(key) {
      return true
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
  },
};
</script>
