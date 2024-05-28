<template>
  <div class="q-gutter-sm">
    <q-btn color="primary" v-if="authorityMeta('edit')" unelevated label="修改" @click="updateAddressInfo()" />
    <q-btn color="negative" unelevated label="删除" @click="deteleAddressInfo()" />
  </div>
</template>
<script>
export default {
  name: 'AgSeeAddress',
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
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
    },
    updateAddressInfo () {
      this.params.context.editMemberAddress(this.params.context.memberId, this.params.data.id)
    },
    deteleAddressInfo () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将该地址删除吗？',
          cancel: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store
            .dispatch('memberAddress/deteleAddress', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.params.context.getList()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        })
        .onCancel(() => {})
    }
  }
}
</script>
