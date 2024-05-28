<template>
  <div>
    <q-btn unelevated color="primary" class="q-mr-sm" label="修改" @click="showAddType" v-if="authorityMeta('editType')" />
    <q-btn unelevated color="red"  @click="delType" label="删除" v-if="authorityMeta('delType')" />
  </div>
</template>
<script>
export default {
  name: 'TypeAgOperate',
  components: {},
  data () {
    return { }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showAddType () {
      this.params.context.showAddType(this.params.data.id)
    },
    delType () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.pht_name}"的寄存分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('hyjc/delTypeAll', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除寄存分类!',
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
      return true
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
