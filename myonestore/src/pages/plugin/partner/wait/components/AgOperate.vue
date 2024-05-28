<template>
  <div>
    <q-btn unelevated color="primary" class="q-mr-sm" label="通过" @click="setMemberData(0)" v-if="authorityMeta('editMember')"> </q-btn>
    <q-btn unelevated color="red" label="拒绝" @click="setMemberData(-2)" v-if="authorityMeta('editMember') && parseInt(params.data.ppi_status) > -2">
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    setMemberData (level) {
      this.$q
        .dialog({
          title: '提示',
          message: level == -2 ? '确定拒绝申请吗?' : '确定通过申请吗',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const text = level == -2 ? '已拒绝申请' : '已通过申请'
          const params = {
            id: this.params.data.id,
            ppi_status: level == -2 ? '-2' : '1'
          }
          this.$store.dispatch('partner/setMemberData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: text,
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
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
