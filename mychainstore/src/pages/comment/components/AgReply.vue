<template>
  <div>

       <q-btn color="primary" label="回复" unelevated @click="openReplyDialog" />
  </div>
</template>

<script>
export default {
  name: 'AgReply',
  data () {
    return {
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    openReplyDialog () {
      this.$q.dialog({
        title: '回复评论',
        message: '请输入回复内容',
        prompt: {
          model: this.params.data.mrc_comment_reply,
          type: 'textarea', // optional
          outlined: true
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.updatedComment(data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    updatedComment (data) {
      const obj = {
        mrc_comment_reply: data,
        id: this.params.data.id
      }
      this.$store
        .dispatch('comment/updateComment', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改状态成功',
              color: 'green'
            })

            this.$nextTick(() => {
              this.params.context.getList()
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
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

<style scoped></style>
