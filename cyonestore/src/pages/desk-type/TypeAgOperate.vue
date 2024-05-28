<template>
  <div class="row q-gutter-sm">
    <q-btn unelevated color="primary" label="修改" @click="showPopup" />
    <q-btn unelevated color="red" label="删除"  @click="delType" />
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
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    showPopup () {
      this.params.context.showAddType(this.dataId)
    },
    delType () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.dt_name}"的餐区吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.dataId
          }
          this.$store.dispatch('desk/delAllType', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除餐区!',
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
