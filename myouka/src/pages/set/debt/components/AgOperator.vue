<template>
  <div>
    <q-btn unelevated color="primary" dense label="还账" v-if="params.data.odr_debt_type == 1" class="q-px-md" @click="editRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0,
      returnParam: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.data = this.params.data
  },
  methods: {
    editRecord () {
      const data = this.data
      this.params.context.checkoutWindow(data.odr_consume_type, data.odr_debt_amount, data.odr_member_id, this.returnParam, data.odr_invoice_id)
    }
  }
}
</script>
