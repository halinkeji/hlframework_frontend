<template>
  <div>
    <q-btn color="primary" v-if="parseInt(params.data.par_status) == 1" class="q-mt-sm q-mx-sm" unelevated label="结算" @click="clickWithdraw" />
     <q-btn color="positive" v-else class="q-mt-sm q-mx-sm" unelevated label="已结算"  />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
  },
  methods: {
    clickWithdraw () {
      this.params.context.sendOrderSignalAgentPay([this.params.data.id])
    }
  }
}
</script>
