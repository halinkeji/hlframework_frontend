<template>
  <div>
    <q-btn-dropdown color="primary" label="操作">
      <q-list style="width:180px">

        <q-item clickable v-close-popup v-if="parseInt(params.data.cou_couponProperty) == 8 && (params.data && params.data.pmerchantMarket && [1].indexOf(parseInt(params.data.pmerchantMarket.pc_market_status)) > -1)">
          <q-item-section>
            <q-btn @click="submitPmerchantCheck(parseInt(params.data.pmerchantMarket.id))" color="red" class="full-width" unelevated label="提交审核"  />
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="parseInt(params.data.cou_couponProperty) == 8 && (params.data && params.data.pmerchantMarket && [5].indexOf(parseInt(params.data.pmerchantMarket.pc_market_status)) > -1)">
          <q-item-section>
            <q-btn @click="openPayMarketDialog(params.data)" color="red" class="full-width" unelevated label="支付服务费"  />
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="authorityMeta('send') && parseInt(params.data.cou_couponProperty) == 7">
          <q-item-section>
            <q-btn @click="groupBut()" color="red" class="full-width" unelevated label="发送卡券"  />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.cou_couponProperty) != 8">
          <q-item-section>
            <q-btn :to="{ name: 'cardInfo', query: { id: id } }" color="primary" class="full-width" unelevated label="查看" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.cou_couponProperty) == 8 && (params.data && params.data.pmerchantMarket && [3,4].indexOf(parseInt(params.data.pmerchantMarket.pc_market_status)) > -1)">
          <q-item-section>
            <q-btn @click="openPmerchantCardInfo(id)"  color="primary" class="full-width" unelevated label="平台卡券推广记录" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="authorityMeta('edit')">
          <q-item-section>
            <q-btn :to="{ name: 'addCouponsIndex', query: { id: id, type: 'copy' } }" color="primary" class="full-width" unelevated label="复制" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="authorityMeta('edit') && !(parseInt(params.data.cou_couponProperty) == 8 && (params.data && params.data.pmerchantMarket && [2,3,4,5].indexOf(parseInt(params.data.pmerchantMarket.pc_market_status)) > -1))">
          <q-item-section>
            <q-btn :to="{ name: 'addCouponsIndex', query: { id: id, type: 'edit' } }" color="positive" class="full-width" unelevated label="编辑" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if=" !(parseInt(params.data.cou_couponProperty) == 8 && (params.data && params.data.pmerchantMarket && [2,3,4,5].indexOf(parseInt(params.data.pmerchantMarket.pc_market_status)) > -1))">
          <q-item-section>
            <q-btn @click="confirmDeleteRecord()" color="red" class="full-width" unelevated v-if="authorityMeta('del')" label="删除" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      id: '',
      buySmsDialogStatus: false,
      currentCouponItem: {},

      buySmsPackageUrl: '',
      buyInvoiceId: 0
    }
  },

  created () {
    this.id = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    openPmerchantCardInfo (id) {
      this.params.context.openPmerchantCardInfo(id)
    },

    submitPmerchantCheck (couponMarketId) {
      this.$q
        .dialog({
          type: 'confirm',
          title: '是否确认',
          message: `确定将名称为${this.params.data.cou_title}的卡券提交至共享平台进行审核吗？`,
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('hlCoupon/submitPmerchantCheck', {
              couponMarketId
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '提交审核成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.params.context.getCouponsList()
                })
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
        })
    },

    // 删除 批量删除
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
        .dispatch('hlCoupon/setStatus', {
          ids: obj,
          status: -1
        })
        .then((res) => {
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
    // 发送卡券
    groupBut () {
      const data = [this.params.data]
      this.params.context.groupBut(data)
    },

    openPayMarketDialog () {
      this.$nextTick(() => {
        this.params.context.openPayMarketDialog(this.params.data)
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
