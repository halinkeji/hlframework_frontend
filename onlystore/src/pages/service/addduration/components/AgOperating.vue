<template>
  <div>
    <q-btn
      type="filled"
      color="red"
      flat
      size="sm"
      round
      @click="deleteBut()"
      icon="ion-trash"
    >
    <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  components: {},
  data () {
    return {}
  },
  watch: {},
  limitedTime: '',
  computed: {},
  created () {

  },
  mounted () {},
  methods: {
    // 删除单个商品
    deleteBut (val) {
      const obj = {
        type: 1,
        id: this.params.data.id
      }
      this.$store
        .dispatch('addDuration/delList', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })

            setTimeout(() => {
              this.params.context.getShoppingCartList()
            }, 500)
          }
        })
        .catch(error => {})
    }
  }
}
</script>
