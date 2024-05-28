<template>
  <div class="row q-gutter-sm">
    <q-btn
      color="primary"
      unelevated
      label="回复"
      @click="openReplyMsg"
    />
    <q-btn color="red" v-if="parseInt(params.data.gc_status) == 1" unelevated label="隐藏"  @click="saveCommentData({ id: dataId , gc_status : 2 })" />
    <q-btn color="positive" v-if="parseInt(params.data.gc_status) == 2" unelevated label="显示"  @click="saveCommentData({ id: dataId , gc_status : 1 })" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
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
    openReplyMsg () {
      this.$q.dialog({
        title: '商家回复',
        message: '请输入您的回复',
        prompt: {
          model: this.params.data.gc_store_reply,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.saveCommentData({
          gc_store_reply: data,
          gc_status: 2,
          id: this.dataId
        })
        // console.log('>>>> OK, received', data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    saveCommentData (obj) {
      this.$store
        .dispatch('wxMallComment/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
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
            message: 'Error',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
          this.stop = false
        })
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
