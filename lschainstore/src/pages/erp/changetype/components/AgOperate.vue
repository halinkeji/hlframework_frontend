<template>
  <div>
    <q-btn color="primary" label="修改" class="q-mr-sm" unelevated  v-if="authorityMeta('edit')" @click="showPopup()">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>
    <q-btn  color="red" label="删除" unelevated v-if="authorityMeta('del')"  @click="delBuyer">
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

    delBuyer () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.ect_name}"的调整状态吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('erpChangeType/delAll', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除调整状态!',
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
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
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
