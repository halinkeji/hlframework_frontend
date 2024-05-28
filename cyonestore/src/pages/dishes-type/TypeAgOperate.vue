<template>
  <div class="row q-gutter-sm">
    <q-btn unelevated color="primary" label="编辑"  @click="showPopup" />
    <q-btn unelevated color="red" label="删除" @click="delType" />
  </div>
</template>
<script>
export default {
  name: 'TypeAgOperate',
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
      this.params.context.showAddType(this.dataId)
    },
    delType () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.gt_name}"的菜品分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('dishes/delAllType', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除菜品分类!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
    }
  }
}
</script>
