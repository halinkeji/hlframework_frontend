<template>
  <div>
    <div @click="viewBut" v-if="params.data.chud_goodsOrService == 3">
      <span>
        <span class="text-red">[套]</span>{{ params.data.chud_goo_name }}</span
      >
    </div>

    <span v-else>
      {{ params.data.chud_goo_name }} {{ params.data.chud_specificationName }}
      <q-tooltip content-style="font-size: 16px">
        {{ params.data.chud_goo_name }} {{ params.data.chud_specificationName }}
      </q-tooltip>
    </span>
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
