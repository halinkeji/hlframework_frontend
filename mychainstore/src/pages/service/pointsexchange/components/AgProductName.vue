<template>
  <div>
    <div @click="viewBut" v-if="params.data.chud_goodsOrService == 3">
      <vx-tooltip text="点击查看套餐详情">
        <span> <span class="text-danger">[套]</span>{{ params.data.pb_goo_name }}</span>
      </vx-tooltip>
    </div>

    <span v-else>{{ params.data.pb_goo_name }} {{ params.data.pb_specificationName }} </span>
  </div>
</template>

<script>
export default {
  name: "AgProductName",
  methods: {
    viewBut() {
      this.params.context.$refs.packageDetailsRef.packageDetails(
        this.params.data.goods_id
      );
    }
  }
};
</script>
