<template>
  <div class="flex flex-center">
    <q-chip size="12px" class="text-white" color="orange" v-if="parseInt(params.data.ja_position) == 1">
      首页轮播广告
    </q-chip>
    <q-chip size="12px" class="text-white" color="deep-orange" v-if="parseInt(params.data.ja_position) == 2">
      首页展示广告
    </q-chip>
    <q-chip size="12px" class="text-white" color="amber-9" v-if="parseInt(params.data.ja_position) == 3">
      商品详情广告
    </q-chip>
    <q-chip size="12px" class="text-white" color="green" v-if="parseInt(params.data.ja_position) == 4">
      全部商品广告
    </q-chip>
    <q-chip size="12px" class="text-white" color="teal" v-if="parseInt(params.data.ja_position) == 5">
      我的页面广告
    </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgChip',
  components: {},
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
