<template>
  <div class="q-gutter-x-sm">
    <q-btn unelevated  color="primary" label="修改"  :to="{ name: 'hyryxAddRule', query: { ruleId: this.params.data.id } }" v-if="authorityMeta('editRule')" />
    <q-btn unelevated color="red" label="删除" @click="delRule" v-if="authorityMeta('delRule')" />
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
    delRule () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.phr_name}"的营销规则吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('hyryx/delRuleAll', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除营销规则',
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
