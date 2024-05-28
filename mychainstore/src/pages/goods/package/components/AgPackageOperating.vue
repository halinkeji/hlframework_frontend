<template>
  <div>
     <q-btn
      @click="setStoreGoodsParams"
      color="warning"
      unelevated
      v-if="sonEditStatus"
      class="q-mr-sm"
      >修改
    </q-btn>
    <q-btn
      color="primary"
      class="q-mr-sm"
      unelevated
      label="修改"
      v-if="authorityMeta('edit') && editStatus"
      :to="{ name: 'AddPackage', query: { id: this.id } }"
    />
    <q-btn
      color="red"
      unelevated
      label="删除"
      v-if="authorityMeta('del') && editStatus"
      @click="confirmDeleteRecord()"
    />
  </div>
</template>

<script>
export default {
  name: 'AgPackageOperating',
  components: {},
  data () {
    return {
      id: '',
      sonEditStatus: false,
      editStatus: false
    }
  },
  mounted () {},
  created () {
    this.id = this.params.data.id
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('mychainstore_account_info')
      const storeLocal = this.$q.localStorage.getItem('mychainstore_store_local')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.lib_id) == parseInt(this.params.data.store_id)) {
          if (storeLocal && storeLocal.supermodel) {
            if (parseInt(storeLocal.supermodel.psc_set_son_goods_package) == 1) {
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
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
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

    addEditBut () {
      this.$router.push({
        name: 'addPackage',
        query: { id: this.params.data.id }
      })
    },

    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',

          title: '是否确认',
          message: `删除名称为 "${this.params.data.goo_name}"的套餐吗？`,
          cancel: true
        })
        .onOk(() => {
          this.deleteBut()
        })
        .onCancel(() => {})
    },

    // 删除 批量删除
    deleteBut () {
      const obj = [this.params.data.id]
      this.$store
        .dispatch('goodspackage/delData', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功删除',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            setTimeout(() => {
              this.params.context.getGoodsPackageList()
            }, 100)
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
        })
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
