<template>
  <div v-if="!params.data.show_status">
    <div>
      <q-btn class=" q-ma-xs" color="primary" icon="ion-eye" flat round size="sm" @click="viewBut()" v-if="authorityMeta('view')">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">查看明细</q-tooltip>
      </q-btn>
      <q-btn class="q-ma-xs" icon="ion-print" color="warning" flat round size="sm" @click="printBut()" v-if="authorityMeta('print')">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">补打小票</q-tooltip>
      </q-btn>
      <span v-if="(parseInt(params.data.sc_pay_status) == 1 || parseInt(params.data.sc_pay_status) == 4) && authorityMeta('consumeRemove')">
        <q-btn class="q-ma-xs" icon="las la-sign-in-alt" color="red" flat round size="sm" v-if="params.data.sc_consumeType == 'consume'" @click="returnBut()">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">整单退货</q-tooltip>
        </q-btn>

        <q-btn class="q-ma-xs" color="red" flat round size="sm" v-else @click="revokeOrderBut()">
          <span class="text-subtitle1">撤</span>
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">撤单</q-tooltip>
        </q-btn>
      </span>
    </div>
    <hl-local-printer ref="localPrinterRef" />

    <view-details ref="viewDetails"></view-details>
  </div>
</template>

<script>
import ViewDetails from './ViewDetails'
export default {
  name: 'AgInvoiceOperating',
  components: {
    ViewDetails
  },
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    // 查看详情
    viewBut () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.viewDetails.getViewData(this.params.data.id)
        }, 200)
      })
    },
    printBut () {
      const obj = {
        id: this.params.data.id
      }
      this.$store
        .dispatch('invoice/getInvoicePrint', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '补打成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
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
        .catch((error) => {})
    },
    returnBut () {
      this.params.context.returnBut(this.params.data.id)
    },
    revokeOrderBut () {
      this.params.context.revokeOrderBut(this.params.data)
    },
    getList () {
      this.params.context.getDatalist()
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
