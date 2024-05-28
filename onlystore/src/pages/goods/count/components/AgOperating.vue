<template>
  <div>
    <q-btn
      color="primary"
      v-if="authorityMeta('edit')"
      :to="{ name: 'addGoodsCount', query: { id: id } }"
      >修改</q-btn
    >
    <q-btn
      @click="deleteRecord"
      color="red"
      class="q-ml-sm"
      v-if="authorityMeta('del')"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      id: 0
    }
  },
  computed: {},
  created () {
    this.id = this.params.data.id
  },
  mounted () {},
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
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
