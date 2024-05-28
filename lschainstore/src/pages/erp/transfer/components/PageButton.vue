<template>
    <q-btn
      color="red"
      size="md"
      unelevated
      label="删除"
      @click="delBufferData"
      v-if="params.data.epd_archives_id > 0 && params.context.turnData.cep_status == 1"
    />
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

  },
  mounted () {},
  methods: {
    delBufferData () {
      this.$store.dispatch('erpTransfer/delData', this.params.data.id)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功删除!',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.params.context.getItem()
          }
        })
    }
  }
}
</script>
