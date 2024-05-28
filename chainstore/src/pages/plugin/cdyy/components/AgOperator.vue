<template>
  <div>
    <q-btn color="primary" class="q-mt-sm q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="editSiteInfo()" />
    <q-btn color="red" class="q-mt-sm" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false

    }
  },
  mounted () {},
  computed: {},
  created () {

  },
  methods: {
    editSiteInfo () {
      this.params.context.addSiteData(this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除标题为 "${this.params.data.cs_name}" 的场地信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
          // console.log("到啦");
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('cdyy/delSiteData', [this.params.data.id])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除场地信息成功',
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
