<template>
  <div>
    <q-btn color="primary" :to="{ name: 'addVip', query: { id: dataId } }" v-if="authorityMeta('edit')">修改</q-btn>
    <q-btn @click="deleteRecord" color="red" class="q-ml-sm" v-if="authorityMeta('del')">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    deleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除会员级别为${this.params.data.mcl_level_name}的会员级别吗`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.dataId]
          this.$store
            .dispatch('level/delData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除会员级别成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
              } else {
                this.$q.notify({
                  message: '删除失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 1000,
                  position: 'top-right'
                })
              }
              this.params.context.getList()
            })
            .catch((error) => {})
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
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
