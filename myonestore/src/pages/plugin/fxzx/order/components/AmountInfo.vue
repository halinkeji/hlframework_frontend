<template>
  <div :style="{ width: params.column.actualWidth - 30 + 'px' }" >
   <div class="row justify-between" v-if="parseFloat(fxzxData.oneFxzxMemberAmount)>0">
     <div>
       一级分销商：{{fxzxData.oneFxzxMemberName}}
     </div>
     <div>
       佣金：{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{fxzxData.oneFxzxMemberAmount}}
     </div>
   </div>
   <div class="row justify-between" v-if="parseFloat(fxzxData.twoFxzxMemberAmount)>0">
     <div >
      二级分销商：{{fxzxData.twoFxzxMemberName}}
     </div>
     <div >
       佣金：{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{fxzxData.twoFxzxMemberAmount}}
     </div>
   </div>
   <div class="row justify-between" v-if="parseFloat(fxzxData.threeFxzxMemberAmount)>0">
     <div>
      三级分销商：{{fxzxData.threeFxzxMemberName}}

     </div>
     <div>
       佣金：{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{fxzxData.threeFxzxMemberAmount}}
     </div>
   </div>
   <div class="row justify-end" v-if="parseFloat(fxzxData.totalFxzxAmount)>0">
       合计佣金：{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{fxzxData.totalFxzxAmount}}
   </div>
  </div>
</template>
<script>
export default {
  name: 'AmountInfo',
  components: {},
  data () {
    return {
      fxzxData: {}
    }
  },
  created () {},
  mounted () {
    this.fxzxData = this.params.data.record
  },
  computed: {},
  methods: {
    showMemberDetail () {
      this.params.context.showMemberDetail(this.params.data.pfm_member_id, this.params.data)
    },
    setMemberData () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定取消分销商资格吗（取消后该分销商下级数变为0）',
          cancel: { push: true },
          persistent: true,
          ok: {
            push: true,
            color: 'negative'
          }
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id,
            pfm_level_id: -3,
            pfm_weights: -3
          }
          this.$store.dispatch('fxzx/setMemberData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '取消分销商资格',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
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
