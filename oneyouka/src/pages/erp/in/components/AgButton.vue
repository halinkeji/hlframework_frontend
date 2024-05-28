<template>
  <div>
    <hl-local-printer ref="localPrinterRef" :landscape="true" :dpi="'horizontal'" :margin="'10px 0'" />
    <q-btn
      color="red"
      unelevated
      v-if="params.data.bid > 0 && authorityMeta('return')"
      :to="{ name: 'returnGoodsItem', query: { id: params.data.bid } }"
      icon="las la-sign-out-alt"
      round
      size="sm"
    >
      <q-tooltip> 退货 </q-tooltip>
    </q-btn>

    <q-btn color="warning" size="sm"  round icon="las la-print"  class="q-ml-sm" unelevated v-if="params.data.bid > 0 && processMode === 'electron'" @click="printInvoice">
      <q-tooltip> 打印 </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgButton',
  data () {
    return {
      lowData: '',
      processMode: process.env.MODE
    }
  },
  created () {
    this.lowData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {
    printInvoice () {
      this.$store
        .dispatch('cloudprinter/printErp', {
          invoiceId: this.params.data.bid,
          erpType: 'inGoods'
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data) {
              this.$refs.localPrinterRef.startPrinter(res.data)
            }
            return false
          }
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
