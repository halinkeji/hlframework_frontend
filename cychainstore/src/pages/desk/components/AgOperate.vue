<template>
  <div class="row q-gutter-sm">
    <q-btn unelevated color="primary" label="修改" @click="showPopup" />
    <q-btn unelevated color="red" label="删除" @click="delDesk" />
    <q-btn unelevated color="orange" label="小程序入口" @click="copyXcxUrl" />
  </div>
</template>
<script>
import { copyToClipboard } from 'quasar'
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
      this.params.context.showAddDesk(this.dataId)
    },
    delDesk () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.dp_name}"的餐桌吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('desk/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除餐桌!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
    },
    copyXcxUrl () {
      copyToClipboard('/pages/consume-order/index?deskId=' + this.params.data.id)
        .then(() => {
          this.$q.notify({
            message: '成功',
            caption: '复制成功!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
        .catch(() => {
          // fail
        })
    }
  }
}
</script>
