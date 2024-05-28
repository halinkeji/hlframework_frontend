<template>
  <div>
    <q-btn unelevated color="primary" class="q-mr-sm" label="全部下级" @click="showFxzxSonLists" v-if="authorityMeta('sonMember')"></q-btn>
    <q-btn unelevated color="warning" class="q-mr-sm" label="详情" @click="showMemberDetail" v-if="authorityMeta('detailMember')"></q-btn>
    <q-btn unelevated color="red" label="取消分销商" @click="setMemberData" v-if="authorityMeta('editMember')"></q-btn>
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
    showMemberDetail () {
      this.params.context.showMemberDetail(this.params.data.pfm_member_id, this.params.data)
    },
    showFxzxSonLists () {
      this.params.context.showFxzxSonLists(this.params.data.pfm_member_id)
    },
    setMemberData () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定取消分销商资格吗（取消后该分销商下级数变为0）',
          cancel: { push: true },
          persistent: true,
          ok: {
            push: true,
            color: 'negative'
          }
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id,
            pfm_level_id: -3,
            pfm_weights: -3
          }
          this.$store.dispatch('fxzx/setMemberData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '取消分销商资格',
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
