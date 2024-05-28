<template>
  <div>
    <q-btn flat rounded color="primary" class="q-mr-sm" unelevated icon="create" v-if="authorityMeta('edit')" @click="showPopup()">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>
    <q-btn flat rounded color="red" unelevated v-if="authorityMeta('del')" icon="delete_forever" @click="del">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  data () {
    return {
      dataId: ''
    }
  },
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showPopup(this.dataId)
    }, // 显示弹窗方法

    del () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.ed_name}"的仓库吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('erpdepot/delAll', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除仓库!',
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
