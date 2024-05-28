<template>
  <div class="row q-gutter-sm">
    <q-btn label="修改" unelevated color="primary"  :to="{ name: 'addDishes', query: { id: dishesId } }" />
    <q-btn label="删除" unelevated color="red"  @click="delDishes" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  data () {
    return {
      dishesId: ''
    }
  },
  mounted () {},
  created () {
    this.dishesId = this.params.data.id
  },
  computed: {},
  methods: {
    delDishes () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.goo_name}"的菜品吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('dishes/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除菜品!',
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
