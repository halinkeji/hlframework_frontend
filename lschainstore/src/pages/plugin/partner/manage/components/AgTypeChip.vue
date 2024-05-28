<template>
  <div>
    <q-chip color="primary" text-color="white" size="sm" v-if="dataInfo.ppi_status == 1"> 现有股东 </q-chip>
    <q-chip color="red" size="sm" text-color="white" v-if="dataInfo.ppi_status == -1"> 历史股东 </q-chip>
  </div>
</template>

<script>
export default {
  name: 'TypeChip',
  data () {
    return {
      goodsType: {}
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataInfo = this.params.data
  },
  methods: {}
}
</script>
