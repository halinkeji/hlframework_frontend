<template>
  <div class="fit ">
    <div v-if="discountType == '1'" class="fit">
      <level-price :goods_id="goods" @getMethods="getType"></level-price>
    </div>
    <div v-if="discountType == '2'" class="fit">
      <level-spec-price :goods_id="goods" @getMethods="getType"></level-spec-price>
    </div>
  </div>
</template>

<script>
import LevelPrice from './LevelPrice.vue'
import LevelSpecPrice from './LevelSpecPrice.vue'

export default {
  name: 'GoodsDiscount',
  props: ['goods', 'discountType'],
  components: {
    LevelPrice,
    LevelSpecPrice
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {
  },
  methods: {
    getType (data) {
      this.$emit('getDiscount', data)
    }
  }
}
</script>

<style></style>
