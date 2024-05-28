<template>
  <div class="q-gutter-sm">
    <q-btn color="positive" unelevated label="推广列表" @click="showDetailView()" />
    <q-btn color="warning" unelevated label="财富列表" @click="showRewardView()" />

    <q-btn color="primary" unelevated label="修改" @click="getGoodsNormalList()" />
    <q-btn color="red" unelevated label="删除" @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    showDetailView () {
      this.dataId = this.params.data.id
      this.params.context.showDetailView(this.dataId)
    },

    showRewardView () {
      this.dataId = this.params.data.id
      this.params.context.showRewardView(this.dataId)
    },
    getGoodsNormalList () {
      this.dataId = this.params.data.id
      this.params.context.editTypeData(this.dataId)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除卡号为 "${this.params.data.pmu_pmerchant_card_number}" 的用户吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('marketingManage/delUserData', {
          user_id: this.dataId
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除类型成功',
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
            message: '错误',
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
