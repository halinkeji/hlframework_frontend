<template>
  <div class="q-gutter-sm">
    <q-btn color="primary"  unelevated label="修改" v-if="authorityMeta('edit')" @click="editChannel()" />
    <q-btn color="red"  unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord()" />
  </div>
</template>
<script>
export default {
  name: 'AgSeeAddress',
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
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
    },
    editChannel () {
      this.$nextTick(() => {
        this.params.context.addChannel(this.params.data.id)
      })
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定删除当前渠道吗？',
          cancel: true
        })
        .onOk(() => {
          this.params.context.deleteChannel(this.params.data.id)
        })
        .onCancel(() => {})
    }

  }
}
</script>
