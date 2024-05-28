<template>
  <div class="q-gutter-x-sm">
    <q-btn unelevated  color="primary" label="修改" @click="openRuleDialog(params.data.id)"  v-if="authorityMeta('edit')" />
    <q-btn unelevated color="red" label="删除" @click="delRule" v-if="authorityMeta('del')" />
  </div>
</template>
<script>
export default {
  name: 'AgOperae',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    openRuleDialog (id) {
      this.params.context.openRuleDialog(id)
    },
    delRule () {
      this.$q
        .dialog({
          title: '确定',
          message: '删除当前的红包营销规则吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('hbyx/delRuleData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除规则',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
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
