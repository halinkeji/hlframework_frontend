<template>
  <div>
    <q-btn unelevated color="primary" label="已选" v-if="selsectParentMarketId == params.data.id"> </q-btn>
    <q-btn unelevated color="grey" label="选择" @click="setParentMarketId(params.data)" v-if="selsectParentMarketId != params.data.id"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'MarketListsAgOperate',
  components: {},
  data () {
    return {
      selsectParentMarketId: ''
    }
  },
  created () {
    this.selsectParentMarketId = this.params.context.parentMarketId
  },
  mounted () {},
  computed: {},
  methods: {
    setParentMarketId (data) {
      this.selsectParentMarketId = data.id
      this.params.context.selectedParentMarketData = data
      this.params.context.getList(this.params.context.marketId, this.selsectParentMarketId)
    }
  }
}
</script>
