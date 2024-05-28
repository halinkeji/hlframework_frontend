<template>
  <div>
    <q-btn
      :to="{ name: 'cardInfo', query: { id: params.data.id } }"
      color="primary"
      class=" q-mr-xs"
      unelevated
      v-if="authorityMeta('disableView')"
      label="查看"
    />
    <q-btn @click="confirmDeleteRecord()" color="red" class=" q-mr-xs" unelevated v-if="authorityMeta('disableDel')" label="删除" />
    <q-btn @click="reductionRecord()" color="positive" class=" q-mr-xs" unelevated v-if="authorityMeta('reduction')" label="还原" />
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {}
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {

    reductionRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          title: '是否确认',
          message: `确定还原标题为${this.params.data.cou_title}优惠券吗`,
          cancel: true
        })
        .onOk(() => {
          this.reductionBut()
        })
    },
    reductionBut () {
      const obj = [this.params.data.id]
      this.$store
        .dispatch('hlCoupon/setStatus', {
          ids: obj,
          status: 1
        })
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '还原成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getCouponsList()
            }, 100)
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',

          title: '是否确认',
          message: `确定删除标题为${this.params.data.cou_title}优惠券吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteBut()
        })
    },
    deleteBut () {
      const obj = [this.params.data.id]
      this.$store
        .dispatch('hlCoupon/delData', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getCouponsList()
            }, 100)
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
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
