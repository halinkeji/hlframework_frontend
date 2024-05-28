<template>
  <div class="row q-gutter-sm">
    <q-btn unelevated color="primary" label="编辑"  v-if="authorityMeta('edit')" @click="showPopup" />
    <q-btn unelevated color="red" label="删除" v-if="authorityMeta('del')"  @click="delMaterial" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: '',
      editStatus: false
    }
  },
  created () {

  },
  mounted () {},
  computed: {

  },
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showAddType(this.dataId)
    },
    delMaterial () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.cm_name}"的原料信息吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$store.dispatch('materialManage/batchMaterialDelete', [this.params.data.id]).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除原料信息!',
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
