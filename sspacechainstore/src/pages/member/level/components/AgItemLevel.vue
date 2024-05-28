<template>
  <div>
    <q-chip v-if="LeverData.mcl_default == 1" color="primary" text-color="white"> 默认注册等级 </q-chip>
    <q-chip v-if="LeverData.mcl_default == 2" color="positive" text-color="white"> 普通等级</q-chip>
  </div>
</template>
<script>
export default {
  name: 'ItemLever',
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
