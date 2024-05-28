<template>
  <div class="q-gutter-xs">
    <q-btn color="primary" unelevated @click="viewDetail" label="绩效详情" />
  </div>
</template>
<script>
export default {
  name: 'AgLabelRecordButton',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    viewDetail () {
      this.params.context.viewRecord(this.params.data.id)
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
