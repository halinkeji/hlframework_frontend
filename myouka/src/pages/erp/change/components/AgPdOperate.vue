<template>
  <q-btn
    color="primary"
    unelevated
    v-if="authorityMeta('view')"
    :to="{ name: 'changeViewDetail', query: { id: params.data.id } }"
    >查看详情</q-btn
  >
</template>
<script>
export default {
  name: 'AgPdOperate',
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
