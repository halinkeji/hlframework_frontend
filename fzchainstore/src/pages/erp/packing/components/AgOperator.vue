<template>
  <div class="row q-gutter-sm">
    <q-btn  color="info" unelevated icon="las la-eye" round size="sm" @click="showLog">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">装箱详情</q-tooltip>
    </q-btn>
    <q-btn  color="negative" unelevated icon="inbox" v-if="params.data.orderInData && params.data.orderInData.id && params.data.orderInData.cep_status == 1" round size="sm" @click="splitBox">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">拆包</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    showLog () {
      this.params.context.showDetail(this.params.data.id)
    },
    splitBox () {
      this.params.context.splitBox(this.params.data.id)
    }
  }
}
</script>
