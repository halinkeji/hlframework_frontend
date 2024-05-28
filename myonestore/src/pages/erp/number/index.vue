<template>
  <q-page class="fit">
    <goods-number></goods-number>
  </q-page>
</template>
<script>
import CostPice from './CostPice'
import GoodsNumber from './GoodsNumber'
export default {
  name: 'normal',
  components: {
    CostPice,
    GoodsNumber
  },
  data () {
    return {
      activeName: '0'
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
