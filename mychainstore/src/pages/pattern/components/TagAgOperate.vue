<template>
  <div>
    <q-btn
      flat
      rounded
      color="primary"
      class="q-mr-sm"
      icon="create"
      @click="showPopup"

    />
    <q-btn
      flat
      rounded
      color="red"
      icon="delete_forever"
      @click="delTag"

    />
  </div>
</template>
<script>
export default {
  name: 'TagAgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    showPopup () {
      this.params.context.showAddTag(this.dataId)
    },
    delTag () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.ppt_name}"的标签吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.dataId
          }
          this.$store.dispatch('pattern/delAllTag', params).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除标签!',
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
        const new_arr = this.$route.meta.map(obj => {
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
