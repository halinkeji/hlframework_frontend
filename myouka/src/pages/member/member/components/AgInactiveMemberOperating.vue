<template>
  <div>
    <q-btn
      @click="editRecord"
      color="primary"
      class="q-ml-sm"
      v-if="authorityMeta('edit')"
      >激活</q-btn
    >
    <q-btn
      @click="delBut"
      color="red"
      class="q-ml-sm"
      v-if="authorityMeta('del')"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: 'AgInactiveMemberOperating',
  components: {},
  data () {
    return {
      memberId: ''
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    editRecord () {
      this.$router.push({
        name: 'addMember',
        params: { memberData: this.params.data }
      })
    },
    delBut () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员删除吗',
          cancel: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '删除会员失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          this.$store
            .dispatch('member/delList', this.params.data.id)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getMemberListData()
              }
            })
            .catch(error => {})
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
