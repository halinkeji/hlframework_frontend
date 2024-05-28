<template>
  <div class="row q-gutter-sm">
    <q-btn unelevated color="primary" label="编辑" v-if="editStatus" @click="showPopup" />
    <q-btn unelevated color="red" label="删除" v-if="editStatus" @click="delType" />
  </div>
</template>
<script>
export default {
  name: 'TypeAgOperate',
  components: {},
  data () {
    return {
      dataId: '',
      editStatus: false
    }
  },
  created () {
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('cychainstore_account_info')
      if (accountInfo && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == this.params.data.store_id) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showAddType(this.dataId)
    },
    delType () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.gt_name}"的菜品分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('dishes/delAllType', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除菜品分类!',
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
