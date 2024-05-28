<template>
  <div>
    <q-btn
      unelevated
      class="q-mr-sm"
      color="primary"
      label="完成排号"
      @click="setData"
      v-if="parseInt(params.data.ppl_status) == 1 && authorityMeta('endPaihao')"
    />
    <!-- <q-btn unelevated color="warning" label="打印小票" @click="printer" v-if="parseInt(params.data.ppl_status) == 1 && authorityMeta('printer')" /> -->
  </div>
</template>
<script>
export default {
  name: 'DetailAgOperate',
  components: {},
  data () {
    return {
      listsData: {}
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    setData () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定将状态修改为完成吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const data = {
            listId: this.params.data.id,
            ppl_status: 2
          }
          this.$store
            .dispatch('paihao/updateListsData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '更改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
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
              this.params.context.getList(this.params.context.projectId)
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    },
    // 排号小票
    printer () {
      const data = {
        ...this.params.data
      }
      this.$store
        .dispatch('paihao/setPrinterPaihao', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '打印成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
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
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
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
