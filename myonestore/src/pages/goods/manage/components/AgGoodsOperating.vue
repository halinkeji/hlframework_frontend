<template>
  <div>
    <q-btn
      :to="{ name: 'addGoods', query: { id: this.params.data.id } }"
      color="primary"
      v-if="authorityMeta('edit') || authorityMeta('editRecy')"
      class="q-mr-sm"
      >修改
    </q-btn>
    <q-btn color="red" ref="buttonRefss" @click="statusBut(params.data.id)" v-if="params.data.goo_status == 1 && authorityMeta('del')">删除</q-btn>
    <q-btn color="red" ref="buttonRefss" v-if="params.data.goo_status == 2 && authorityMeta('deleRecy')" @click="deleteBut(params.data.id)"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: 'AgGoodsOperating',
  data () {
    return {
      params: [],
      dataId: ''
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {

    // 修改状态
    statusBut () {
      const obj = {
        id: this.params.data.id,
        goo_status: 2
      }
      this.$store
        .dispatch('goods/addData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '回收成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getGoodsNormalList()
            }, 100)
          }
        })
        .catch((error) => {})
    },
    // 删除 批量删除
    deleteBut () {
      const obj = [this.params.data.id]
      this.$store
        .dispatch('goods/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getGoodsRecycleBin()
            }, 100)
          }
        })
        .catch((error) => {})
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
