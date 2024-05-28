<template>
  <div class="q-gutter-sm">
    <q-btn unelevated color="primary" label="接" v-if="params.data.prd_status == 1" @click="setData(2)" />
    <q-btn unelevated color="deep-orange" label="完" @click="setData(3)" v-else-if="params.data.prd_status == 2" />
    <q-btn unelevated color="red" label="撤" @click="setData(4)" v-if="params.data.prd_status == 1 || params.data.prd_status == 2" />
    <q-btn unelevated color="green" label="已完" v-else-if="params.data.prd_status == 3" />
    <q-btn unelevated color="grey" label="已撤" v-else-if="params.data.prd_status == 4" />
  </div>
</template>
<script>
export default {
  name: 'DetailAgOperate',
  data () {
    return {
      detailData: {
        prd_status: ''
      }
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    setData (status) {
      const messageOne = status == 2 ? '进行接单？' : '已完成预约?'
      const message = status == 4 ? '撤回预约？' : messageOne
      this.$q
        .dialog({
          title: '提示',
          message: `确定${message}`,
          cancel: true
        })
        .onOk(() => {
          this.detailData = this.params.data
          this.detailData.prd_status = status
          const data = {
            ...this.detailData
          }
          this.$store
            .dispatch('reserve/setDetailData', data)
            .then((res) => {
              if (res.code == 200) {
                const captionOne = this.detailData.prd_status == 3 ? '已完成预约' : '接单成功'
                const caption = this.detailData.prd_status == 4 ? '已撤销预约' : captionOne
                this.$q.notify({
                  message: '提示',
                  caption: `${caption}`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.getList(this.params.context.id)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList(this.params.context.id)
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
