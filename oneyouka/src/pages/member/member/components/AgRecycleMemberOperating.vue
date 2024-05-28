<template>
  <div>
    <q-btn color="green" unelevated label="恢复" @click="batchRecovery" />
    <q-btn unelevated @click="delBut" color="red" class="q-ml-sm">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgRecycleMemberOperating',
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
      this.$router.push({ name: 'addMember', query: { memberId: this.params.data.id } })
    },
    delBut () {
      this.$q
        .dialog({
          title: '是否确认将会员彻底删除?',
          message: '确认将会员的所有数据记录彻底删除吗？操作不可逆，有风险！',
          cancel: true,
          ok: {
            color: 'red'
          }
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
          const obj = [this.params.data.id]
          this.$store
            .dispatch('member/delData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getReclMemberListData()
                }, 500)
              }
            })
            .catch((error) => {})
        })
        .onCancel(() => {})
    },
    batchRecovery () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员恢复吗',
          cancel: true
        })
        .onOk(() => {
          const id = parseInt(this.params.data.id)
          const obj = {
            id: id,
            mem_memberStatus: 1,
            no_update_end_time: 2
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功恢复！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getReclMemberListData()
                }, 500)
              }
            })
            .catch((error) => {})
        })
        .onCancel(() => {})
    }
  }
}
</script>
