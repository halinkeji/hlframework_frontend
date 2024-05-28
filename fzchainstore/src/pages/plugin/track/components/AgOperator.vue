<template>
  <div>
    <q-btn color="primary" ref="buttonRefss" @click="editRecord" v-if="authorityMeta('add')">添加日志</q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    editRecord () {
      this.dataId = this.params.data.id
      this.params.context.setTrackData(this.dataId)
    },
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
