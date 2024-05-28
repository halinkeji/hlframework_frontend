<template>
  <div class="full-width" v-if="params.data.myoukaBalance && params.data.myoukaBalance.length > 0">
    <q-item class="full-width text-center">
      <q-item-section v-for="(item, key) in params.data.myoukaBalance" :key="key + '-balance'">
        <q-item-label class="text-subtitle2 text-negative text-weight-bold">{{ item.ymb_balance_value }}</q-item-label>
        <q-item-label caption lines="2">{{ $store.state.components.balanceGroupObject[item.ymb_source_group] }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
  <div v-else>储值卡为空</div>
</template>
<script>
export default {
  name: 'AgMemberBalance',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
