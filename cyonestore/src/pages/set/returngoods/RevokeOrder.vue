<template>
  <q-dialog @hide="hideNowPage" v-model="revokeOrderDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-sm "
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">撤单</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="revokeOrderDialog = false" />
      </q-card-section>

      <q-form ref="revokeOrderRef" class="q-gutter-md">
        <div class="q-my-lg">
          <q-input outlined dense class="q-pa-none q-mx-lg q-mb-lg" label="单号" disable v-model="consumeData.sc_invoiceCode" />
          <q-select
            dense
            outlined
            stack-label
            class="q-pa-none q-mx-lg q-mb-lg"
            v-model="returnMode"
            :options="returnStatusData"
            option-value="value"
            option-label="text"
            :option-disable="consumeData.sc_consumeType"
            label="退款方式"
            :rules="[(val) => !!val || '必填项']"
            emit-value
            map-options
          />
        </div>
      </q-form>
      <q-card-actions align="right" class="text-primary">
        <q-btn color="primary" text-color="white" label="撤单" class="q-px-sm q-ml-sm" @click="setRevokeData" unelevated />
        <q-btn color="grey" text-color="white" label="关闭" class="q-px-sm" @click="hideNowPage" v-close-popup unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'RevokeOrder',
  data () {
    return {
      revokeOrderDialog: false,
      consumeData: {},
      returnTime: this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      returnMode: 1,
      saveStopData: false,
      returnStatusData: this.$store.state.invoice.returnStatusData
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (data) {
      this.revokeOrderDialog = true
      this.returnMode = 1
      this.consumeData = data
    },
    setRevokeData () {
      this.$refs.revokeOrderRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '确定',
              message: '确定进行撤单吗？',
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              if (this.returnMode == 2) {
                if (parseInt(this.consumeData.member_id) < 1) {
                  this.$q.notify({
                    message: '撤单失败',
                    caption: '原因：非会员不能退款到' + this.$q.localStorage.getItem('_store_local').storeBaseConfig.consume_base_balanceUnit,
                    color: 'red',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                  return false
                }
              }
              this.saveStopData = true
              const obj = {
                ...this.consumeData,
                returnMode: this.returnMode
              }

              this.$store
                .dispatch('returnGoods/setRevokeOrder', obj)
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
                      this.hideNowPage()
                    })
                  } else {
                    this.$q.notify({
                      message: '撤单失败',
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
                    message: '操作失败',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    caption: error.message,
                    color: 'red'
                  })
                  this.saveStopData = false
                })
            })
        }
      })
    },

    hideNowPage () {
      this.revokeOrderDialog = false
      this.$emit('getMethods')
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
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
