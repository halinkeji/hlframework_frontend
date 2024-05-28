<template>
  <div v-if="authorityMeta('timeRemove')">
    <q-btn class="q-ma-xs" color="red" flat round size="sm" v-if="params.data.rtd_order_status == 1" @click="revokeOrderBut()">
      <span class="text-subtitle1">撤</span>
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">撤单</q-tooltip>
      </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgTimeOperating',
  components: {},
  data () {
    return {}
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    revokeOrderBut () {
      const obj = {
        ...this.params.data
      }
      this.$store
        .dispatch('returnGoods/setRevokeOrderTime', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '撤单成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {
              setTimeout(() => {
                this.params.context.getDatalist()
              }, 200)
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
            this.$nextTick(() => {
              setTimeout(() => {
                this.params.context.getDatalist()
              }, 200)
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
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
