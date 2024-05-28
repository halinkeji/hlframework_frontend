<template>
  <div>
    <q-btn color="green" unelevated label="激活" @click="activationOperate" />
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
                  this.params.context.getMemberListData()
                }, 500)
              }
            })
            .catch((error) => {})
        })
        .onCancel(() => {})
    },
    activationOperate () {
      this.$q
        .dialog({
          title: '激活该会员卡',
          message: '确定主动输入电话号进行激活？',
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          const id = parseInt(this.params.data.id)
          const obj = {
            id: id,
            mem_memberStatus: 1,
            mem_memberMobile: data,
            mem_memberCardNum: data
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功激活！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getMemberListData()
                }, 500)
              } else {
                this.$q.notify({
                  message: '激活失败',
                  caption: '输入电话号重复！',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
                return false
              }
            })
            .catch((error) => {})
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    }
  }
}
</script>
