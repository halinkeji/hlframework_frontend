<template>
  <div>
    <q-btn color="red" label="删除" @click="delDishes(row)" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  data () {
    return { row: '' }
  },
  mounted () {},
  created () {
    this.row = this.params.rowIndex
  },
  computed: {},
  methods: {
    delDishes (index) {
      this.params.context.foodsLists.splice(index, 1)
      this.params.context.foodsTotal()
      this.$q.notify({
        message: '成功',
        caption: '成功删除菜品!',
        color: 'green',
        icon: 'ion-checkmark-circle-outline',
        timeout: 500,
        position: 'top-right'
      })
    }
  }
}
</script>
