<template>
  <div>

    <q-chip color="primary" text-color="white" size="sm" v-if="parseInt(goodsType.gt_goods_type) == 1">
      实物商品
    </q-chip>
    <q-chip color="green" text-color="white" size="sm" v-if="parseInt(goodsType.gt_goods_type) == 2">
      服务商品
    </q-chip>
    <q-chip color="red" size="sm" text-color="white" v-if="parseInt(goodsType.gt_goods_type) == 3">
      套餐商品
    </q-chip>
  </div>
</template>

<script>
export default {
  name: 'TypeChip',
  data () {
    return {
      goodsType: {}
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.goodsType = this.params.data
  },
  methods: {}
}
</script>

<style scoped></style>
