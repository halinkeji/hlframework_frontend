<template>
  <div>
    <q-input outlined @input="changeNumber" dense v-model="params.data.tpb_quantity" />
  </div>
</template>
<script>
export default {
  name: 'AgInput',
  components: {},
  data () {
    return {}
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    // 排序并加限制
    changeNumber () {
      const regu = /^\+?[0-9][0-9]*$/

      if (!regu.test(this.params.data.tpb_quantity)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.params.context.getShoppingCartData()
      } else {
        const obj = {
          gtg_name: this.params.data.package_name,
          packageId: this.params.data.package_id,
          quantity: this.params.data.tpb_quantity,
          member_id: this.params.data.member_id
        }
        this.$store
          .dispatch('addGroupDuration/addShoppingCart', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '更改数量成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })

              this.params.context.getShoppingCartData()
            } else {
              this.$q.notify({
                message: '失败',
                caption: '操作失败',
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            }
          })
          .catch((error) => {})
      }
    }
  }
}
</script>
