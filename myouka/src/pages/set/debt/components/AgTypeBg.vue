<template>
  <div>
    <q-chip size="sm" color="red" text-color="white" v-if="params.data.odr_debt_type == 1">欠款</q-chip>
    <q-chip size="sm" color="green" text-color="white" v-if="params.data.odr_debt_type == 2">还款</q-chip>
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
