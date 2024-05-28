<template>
  <div>
    <q-btn color="positive" class="q-mr-sm" unelevated v-if="authorityMeta('view')" label="查看" @click="viewUserInfo" />
    <q-btn color="primary" class="q-mr-sm" unelevated v-if="authorityMeta('edit')" label="修改" @click="addUserInfo" />
    <q-btn color="red" unelevated v-if="authorityMeta('del')" label="删除" @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      editStatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    viewUserInfo () {
      this.params.context.viewUserInfo(this.params.data.id)
    },
    addUserInfo () {
      this.params.context.addUserInfo(this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除编号为 "${this.params.data.piu_number}" 的用户信息吗？`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('infoqr/delteleUserInfo', [this.params.data.id])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除信息成功',
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
