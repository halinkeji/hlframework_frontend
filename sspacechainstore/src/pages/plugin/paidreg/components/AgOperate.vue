<template>
  <div>
    <q-btn label="修改" color="primary" class="q-mr-sm" @click="showPopup" v-if="authorityMeta('editPackage')" />
    <q-btn label="删除" color="red"  @click="delPackage" v-if="authorityMeta('delPackage')" />
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
      this.params.context.showAddPackage(this.dataId)
    },
    delPackage () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.pp_name}"的套餐吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('paidreg/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除套餐',
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
