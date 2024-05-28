<template>
  <div class="q-gutter-xs">
    <q-btn
      color="blue"
      size="md"
      @click="showPopup"
      unelevated
      label="明细"
    />
  </div>
</template>
<script>
import ItemOil from './ItemOil.vue'
export default {
  name: 'AgButton',
  components: {
    ItemOil
  },

  components: {},
  data () {
    return {}
  },
  created () {},
  methods: {
    showPopup () {
      this.dataId = this.params.data.oid_invoiceId
      this.params.context.showPopup(this.dataId)
    },
    getDataList () {
      this.addPoppupStatus = false
    }
  }
}
</script>
