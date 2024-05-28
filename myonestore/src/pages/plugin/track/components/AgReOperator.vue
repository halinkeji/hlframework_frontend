<template>
  <div>
    <q-btn color="primary" ref="buttonRefss" class="q-mr-sm" @click="editRecord" v-if="authorityMeta('edit') || params.context.currentMemberId">修改</q-btn>
    <q-btn color="red" ref="buttonRefss" @click="confirmDeleteRecord(params.data.id)" v-if="authorityMeta('del') || params.context.currentMemberId">删除</q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgReOperator',
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
    editRecord () {
      this.dataId = this.params.data.id
      this.params.context.setTrackData(this.params.data.ptr_member_id, this.dataId)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除标题为 "${this.params.data.ptr_title}"的记录吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },

    deleteRecord () {
      const obj = {
        id: this.params.data.id
      }
      this.$store
        .dispatch('track/delTrack', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功删除记录!',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.params.context.getListData()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
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
