<template>
  <div>
    <q-chip v-if="LeverData.mcl_type == 'pay'" color="warning" text-color="white"> 付费 </q-chip>
    <q-chip v-if="LeverData.mcl_type == 'default'" color="secondary" text-color="white"> 默认</q-chip>

  </div>
</template>
<script>
export default {
  name: 'AgDefaultView',
  data () {
    return {
      LeverData: {}
    }
  },
  created () {
    this.LeverData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
<style scoped></style>
