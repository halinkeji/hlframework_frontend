<template>
  <div class="q-gutter-sm">
    <q-btn unelevated  color="primary" label="修改" @click="showPopup" v-if="authorityMeta('editProject')" />
    <q-btn unelevated color="warning" label="详情" @click="showDetail" v-if="authorityMeta('paihaoDetail')" />
    <q-btn unelevated color="red" label="删除" @click="delProject" v-if="authorityMeta('delProject')" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showAddProject(this.dataId)
    },
    showDetail () {
      this.dataId = this.params.data.id
      this.params.context.showDetail(this.params.data)
    },
    delProject () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.pp_title}"的项目吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('paihao/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除项目!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
