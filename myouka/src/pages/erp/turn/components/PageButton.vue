<template>
  <div>
    <q-btn
      color="red"
      size="md"
      unelevated
      label="删除"
      @click="delBufferData"
      v-if="params.data.goods_id > 0"
    />
  </div>
</template>
<script>
export default {
  name: 'PageButton',
  data () {
    return {
      dataId: 0
    }
  },
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  methods: {
    delBufferData () {
      const obj = [this.dataId]
      this.$store.dispatch('erpin/delData', obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.params.context.getBufferList()
        }
      })
    }
  }
}
</script>
