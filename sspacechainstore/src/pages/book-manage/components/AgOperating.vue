<template>
  <div class="q-gutter-sm">
    <q-btn unelevated color="primary" class="" label="编辑" @click="showAddProject" />
    <q-btn unelevated color="red" label="删除" @click="del" />
    <q-btn unelevated color="warning" class="" label="预订明细" @click="showReserveLog" />
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      dataId: ''
    }
  },
  mounted () {},
  created () {},
  computed: {},
  // 显示修改方法
  methods: {
    showAddProject () {
      this.dataId = this.params.data.id
      this.params.context.showAddProject(this.dataId)
    },
    showReserveLog () {
      this.dataId = this.params.data.id
      this.params.context.showReserveLog(this.dataId)
    },
    del () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.prp_name}"的预订项目吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store
            .dispatch('reserve/delAll', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除预订项目!',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
        .onCancel(() => {})
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
