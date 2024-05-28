<template>
  <div>
    <q-btn color="red" v-if="!params.data.showEdit" unelevated label="删除" @click.stop="deleteBut(row)" />
  </div>
</template>
<script>
export default {
  name: "AgGoodsDel",
  components: {},
  data() {
    return {
      row: ""
    };
  },
  computed: {},
  created() {
    this.row = this.params.rowIndex;
  },
  mounted() {},
  methods: {
    //删除单个商品
    deleteBut(index) {
      this.params.context.goodsPackageData.splice(index, 1);
      this.params.context.calculation();
    }
  }
};
</script>
