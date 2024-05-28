<template>
  <div>
    <q-btn unelevated  color="primary" class="q-px-sm" label="选择" @click="getGoodsData" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    getGoodsData () {
      this.params.context.goodsStatus = false
      this.params.context.selectedGoodsData = this.params.data
    }
  }
}
</script>
