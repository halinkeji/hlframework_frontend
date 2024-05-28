<template>
  <div>
    <q-btn class="q-ml-sm" @click="deleteDetail(params.rowIndex)" color="red">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AddButton',
  data () {
    return {

    }
  },
  computed: {},
  created () {

  },
  mounted () {},
  methods: {
    deleteDetail (rowIndex) {
      this.params.context.timingGoodsData.splice(rowIndex, 1)

      const obj = {
        id: this.params.data.id
      }
      this.$store.dispatch('goodsTiming/deleteDetail', obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
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
    }
  }
}
</script>
