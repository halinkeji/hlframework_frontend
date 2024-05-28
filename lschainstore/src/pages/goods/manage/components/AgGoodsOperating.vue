<template>
  <div>
    <q-btn @click="setStoreGoodsParams" color="warning" unelevated v-if="sonEditStatus" class="q-mr-sm">修改 </q-btn>
    <q-btn
      unelevated
      :to="{ name: 'addGoods', query: { id: this.params.data.id } }"
      color="primary"
      v-if="(authorityMeta('edit') || authorityMeta('editRecy')) && editStatus"
      class="q-mr-sm"
      >修改
    </q-btn>
    <q-btn color="red" unelevated @click="statusBut(params.data.id)" v-if="params.data.goo_status == 1 && authorityMeta('del') && editStatus"
      >删除</q-btn
    >
    <q-btn color="red" unelevated v-if="params.data.goo_status == 2 && authorityMeta('deleRecy') && editStatus" @click="deleteBut(params.data.id)"
      >删除</q-btn
    >
    <q-btn color="info" class="q-ml-sm" unelevated @click="printerBut(params.data.id)">打印</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgGoodsOperating',
  data () {
    return {
      dataId: 0,
      sonEditStatus: false,
      editStatus: false
    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.dataId = this.params.data.id
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
      const systemLocal = this.$q.localStorage.getItem('lschainstore_store_local')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.lib_id) == parseInt(this.params.data.store_id)) {
          if (systemLocal && systemLocal.supermodel) {
            if (parseInt(systemLocal.supermodel.psc_set_son_goods) == 1) {
              this.sonEditStatus = true
            }
          }
        }
        if (parseInt(accountInfo.store_id) == parseInt(this.params.data.store_id)) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
  },
  methods: {
    setStoreGoodsParams () {
      let paramsId = 0
      if (this.params.data.goodsStore && this.params.data.goodsStore.id) {
        paramsId = this.params.data.goodsStore.id
      }

      this.params.context.setStoreGoodsParams(this.params.data.id, paramsId, this.params.data.goo_size)
    },
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
    printerBut (id) {
      const obj = {
        goodsData: [id]
      }
      this.params.context.printerGoods(obj)
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
