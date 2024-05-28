<template>
  <div>
    <q-chip color="negative" dense text-color="white" v-if="parseInt(params.data.qrt_status) == 0"> 关闭 </q-chip>
    <q-chip color="primary" dense text-color="white" v-if="parseInt(params.data.qrt_status) == 1"> 空闲中 </q-chip>
    <q-chip color="positive" dense text-color="white" v-if="parseInt(params.data.qrt_status) == 2"> 使用中 </q-chip>
    <q-chip color="warning" dense text-color="white" v-if="parseInt(params.data.qrt_status) == 3"> 清洁中 </q-chip>
    <q-chip color="brown" dense text-color="white" v-if="parseInt(params.data.qrt_status) == 4"> 暂停中 </q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
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

<style scoped></style>
