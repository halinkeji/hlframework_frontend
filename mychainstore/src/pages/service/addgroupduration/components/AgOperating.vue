<template>
  <div>
    <template>
      <q-btn type="filled" color="red" icon="ion-trash" flat round @click="deleteBut">
        <q-tooltip>
        删除
      </q-tooltip>
      </q-btn>
    </template>
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
  computed: {},
  created () {},
  mounted () {},
  methods: {
    // 删除单个商品
    deleteBut () {
      const obj = {
        shoppingCarId: this.params.data.shoppingCarId
      }
      this.$store
        .dispatch('addGroupDuration/delList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '操作成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })

            setTimeout(() => {
              this.params.context.getShoppingCartData()
            }, 500)
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
