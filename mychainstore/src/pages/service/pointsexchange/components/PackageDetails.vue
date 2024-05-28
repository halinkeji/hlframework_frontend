<template>
  <div class="flex flex-wrap">
    <q-dialog v-model="packageDetailsStatus">
      <q-card style="width: 800px; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title class="text-center"> 挂单详情</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <div class="q-ma-sm">
          <q-table
            :data="packageDetailsList"
            :columns="packageDetailsColumns"
            row-key="name"
            hide-bottom
          />
        </div>

        <!-- <q-card-actions align="right" class="q-pb-md">
          <q-btn
            label="解挂"
            @click="solutionsHanging()"
            color="primary"
            class="text-right"
            size="sm"
          />
          <q-btn
            label="取消"
            @click="hangDetails = false"
            class="text-right"
            size="sm"
          />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "xfsy",
  components: {},
  data() {
    return {
      packageDetailsStatus: false,
      packageDetailsList: [],
      consumehangup_id: 0,
      member_id: 0,
      packageDetailsColumns: [
        {
          label: "商品名称",
          align: "left",
          field: "gpd_goodsName"
        },
        {
          align: "left",
          label: "编码",
          field: "gpd_goodsBarcode"
        },
        {
          label: "规格",
          align: "left",
          field: "specificationName"
        },
        { label: "数量", align: "left", field: "gpd_goodsNumber" }
      ]
    };
  },

  mounted() {},
  created() {},
  computed: {},
  methods: {
    //套餐商品详情
    packageDetails(val) {
      const obj = {
        goods_id: val
      };
      this.$store
        .dispatch("consume/getPackage", obj)
        .then(res => {
          if (res.data) {
            this.packageDetailsList = res.data;
            this.packageDetailsStatus = true;
          } else {
            this.packageDetailsList = [];
          }
        })
        .catch(error => {});
    }
  }
};
</script>
<style lang="scss">
.bodayClass .vs-popup {
  width: 40%;
}
</style>
