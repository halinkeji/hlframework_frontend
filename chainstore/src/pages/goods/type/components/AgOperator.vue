<template>
  <div>
    <q-btn
      :to="{
        name: 'addGoodsType',
        query: { id: dataId },
      }"
      color="primary"
      v-if="authorityMeta('edit') && editStatus"
      class="q-mr-sm"
      unelevated
      label="修改"
    >

    </q-btn>
    <q-btn label="删除" unelevated  color="red" @click="confirmDeleteRecord" v-if="authorityMeta('del') && editStatus">

    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'Operator',
  data () {
    return {
      dataId: 0,
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
      const accountInfo = this.$q.localStorage.getItem('chainstore_account_info')
      if (accountInfo && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == this.params.data.store_id) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
  },
  methods: {

    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.gt_name}"的商品分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('goodstype/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除分类成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
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
