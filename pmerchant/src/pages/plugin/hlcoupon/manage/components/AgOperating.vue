<template>
  <div>
    <q-btn @click="groupBut()" color="red" class="q-mr-xs" unelevated label="发送卡券" v-if="authorityMeta('send')" :disable="nature != '7'" />
    <q-btn :to="{ name: 'cardInfo', query: { id: id } }" color="primary" class=" q-mr-xs" unelevated v-if="authorityMeta('view')" label="查看" />
    <q-btn
      :to="{ name: 'addCouponsIndex', query: { id: id, type: 'copy' } }"
      color="primary"
      class=" q-mr-xs"
      unelevated
      v-if="authorityMeta('edit')"
      label="复制"
    />
    <q-btn
      :to="{ name: 'addCouponsIndex', query: { id: id, type: 'edit' } }"
      color="positive"
      class=" q-mr-xs"
      unelevated
      v-if="authorityMeta('edit')"
      label="编辑"
    />
    <q-btn @click="confirmDeleteRecord()" color="red" class=" q-mr-xs" unelevated v-if="authorityMeta('del')" label="删除" />
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data() {
    return {
      id: '',
      nature: '',
    }
  },

  created() {
    this.id = this.params.data.id
    this.nature = this.params.data.cou_couponProperty
  },
  mounted() {},
  computed: {},
  methods: {
    // 删除 批量删除
    confirmDeleteRecord() {
      this.$q
        .dialog({
          type: 'confirm',

          title: '是否确认',
          message: `确定删除标题为${this.params.data.cou_title}优惠券吗`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteBut()
        })
    },
    deleteBut() {
      const obj = [this.params.data.id]
      this.$store
        .dispatch('hlCoupon/setStatus', {
          ids: obj,
          status: -1,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
            })
            setTimeout(() => {
              this.params.context.getCouponsList()
            }, 100)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
    // 发送卡券
    groupBut() {
      const data = [this.params.data]
      this.params.context.groupBut(data)
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
  },
}
</script>
