<template>
  <div>
    <q-btn color="primary" @click="openDetail" icon="ion-eye" unelevated flat />
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
    openDetail () {
      this.params.context.openShiftDetail(this.params.data.id)
    }
  }
}
</script>
