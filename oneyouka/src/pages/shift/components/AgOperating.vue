<template>
  <div>
    <q-btn
      color="primary"
      icon="ion-eye"
      unelevated
      flat
      @click="openShiftDialog"

    >
    <q-tooltip>详情</q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    openShiftDialog () {
      this.params.context.openShiftDialog(this.params.data.id)
    }
  }
}
</script>
