<template>
  <div>
    <q-btn
      color="primary"
      class="q-mx-sm"
      unelevated
      label="修改"
      v-if="authorityMeta('editLevel')"
      :to="{ name: 'partnerAddLevel', query: { id: this.params.data.id } }"
    />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('delLevel')" @click="delLevel()" />
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
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showAddLevel(this.dataId)
    },
    delLevel () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为"${this.params.data.ppl_name}"的等级吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('partner/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除合伙人等级',
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
