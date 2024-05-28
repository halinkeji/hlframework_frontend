<template>
  <div>
    <q-btn
      @click="setData(2)"
      v-if="params.data.pmerchantRelation && params.data.pmerchantRelation.pr_status && parseInt(params.data.pmerchantRelation.pr_status) == 1"
      color="red"
      unelevated
      label="取消推广"
    />
    <q-btn @click="setData(1)" v-else color="primary" unelevated label="我要推广" />
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      id: '',
      nature: ''
    }
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    setData (val) {
      this.$q
        .dialog({
          type: 'confirm',
          title: '同意推广',
          message: `确定将标题为${this.params.data.cou_title}的卡券添加到营销活动列表里吗？`,
          cancel: true
        })
        .onOk(() => {
          this.changeCouponStatus(val)
        })
    },
    changeCouponStatus (val) {
      this.$store
        .dispatch('hlCoupon/setCouponRelation', {
          pr_coupon_id: this.params.data.coupon_id,
          pr_status: val
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.params.context.getCouponsList()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {
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
