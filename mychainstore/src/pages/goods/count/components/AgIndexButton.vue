<template>
  <div>
    <q-btn color="primary" :to="{ name: 'addGoodsCount', params: { id: id } }"
      >修改</q-btn
    >
    <q-btn @click="deleteRecord" color="red" class="q-ml-sm">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  data () {
    return {
      lowDataId: '',
      id: 0
    }
  },
  computed: {},
  created () {
    this.id = this.params.data.id
  },
  mounted () {},
  text: '',
  methods: {
    deleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除套餐名称为 ${this.params.data.grp_name} 的充次套餐吗`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id]
          this.$store
            .dispatch('goodscount/delAll', obj)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除充次套餐成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              }
            })
            .catch(error => {})
        })
        .onCancel(() => {})
    }
  }
}
</script>
