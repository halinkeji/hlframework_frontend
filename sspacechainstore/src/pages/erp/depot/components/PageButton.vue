<template>
  <div>
    <q-btn color="red" unelevated flat icon="lar la-trash-alt" @click="delBufferData" v-if="params.data.goods_id > 0">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
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
      this.$store.dispatch('erpdepot/delBuffer', { id: this.dataId }).then((res) => {
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
