<template>
  <div>
    <q-btn
      color="red"
      unelevated
      :to="{ name: 'returnGoodsItem', params: { data: lowData } }"
      >退货
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'ReturnGoods',
  data () {
    return {
      lowData: ''
    }
  },
  created () {
    this.lowData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
