<template>
  <div>
    <q-chip color="primary" text-color="white" size="sm" v-if="params.data.gu_goodsOrService == 1">实物属性</q-chip>
    <q-chip size="sm" color="green" text-color="white" v-if="params.data.gu_goodsOrService == 2">服务属性</q-chip>
    <q-chip size="sm" color="red" text-color="white" v-if="params.data.gu_goodsOrService == 3">套餐属性</q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgTypeBg',
  data () {
    return {
      params: []
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
