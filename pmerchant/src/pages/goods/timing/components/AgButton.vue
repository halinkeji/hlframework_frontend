<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      class="q-mr-sm"
      label="修改"
      :to="{ name: 'addTiming', query: { id: params.data.id } }"
    />
    <q-btn unelevated color="red" label="删除" @click="deleteData" />
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  data () {
    return {}
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},

  computed: {},
  methods: {
    deleteData () {
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
          this.$store.dispatch('goodsTiming/deleteAll', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getTimingList()
            } else {
              this.$q.notify({
                message: '注意',
                caption: '失败！',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            }
          })
        })
    }
  }
}
</script>
