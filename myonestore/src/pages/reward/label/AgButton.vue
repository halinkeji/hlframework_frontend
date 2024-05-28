<template>
  <div class="q-gutter-xs">
    <q-btn color="primary" @click="addLabelData(params.data.id)" unelevated label="修改" />
    <q-btn color="red" unelevated label="删除" @click="delLabelData" />
  </div>
</template>
<script>
export default {
  name: 'AgButton',
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
    delLabelData () {
      this.$q
        .dialog({
          title: '确定',
          message: '删除吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('rewardLabel/delData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getLabelList()
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
    },
    addLabelData (labelId) {
      this.$nextTick(() => {
        this.params.context.addLabelData(labelId)
      })
    }
  }
}
</script>
