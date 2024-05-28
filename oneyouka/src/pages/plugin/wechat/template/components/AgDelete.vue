<template>
  <div>
    <q-btn unelevated color="red" label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgDelete',
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.title}"的模板消息吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.template_id
          }

          this.$store.dispatch('wechatTemplate/delData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功删除模板消息!',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.params.context.getList()
            } else {
              this.$q.notify({
                message: '删除失败',
                caption: res.data.errmsg.errmsg,
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            }
          })
        })
        .onCancel(() => {})
        .onDismiss(() => {})
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

<style></style>
