<template>
  <div>
    <q-btn @click="buttonShow()" color="secondary" v-if="params.data.pr_status == 0" class="q-mr-sm" label="开票" unelevated> </q-btn>
    <q-btn @click="showPopup()" color="primary" label="查看" unelevated> </q-btn>

    <q-dialog v-model="dialogShow" persistent @hide="closeDialog">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.4) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">开具发票</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
        </q-card-section>
        <q-card-section>
          <q-form ref="itemDataRef" class="q-gutter-md">
            <div class="row items-center">
              <div class="col-3 col-md-2 q-mt-sm text-center">发票抬头：</div>
              <div class="col-8 col-md-6 q-ml-md ">
                <div class="col-12 col-md-6 q-mt-sm q-px-sm text-h6">
                  {{ itemData.pr_title_name }}
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3 col-md-2 q-mt-sm text-center">开票金额：</div>
              <div class="col-8 col-md-6 q-ml-md ">
                <div class="col-12 col-md-6 q-mt-sm q-px-sm text-h6">{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ itemData.pr_total_amount }}</div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3 col-md-2 text-center">发票代码：</div>
              <div class="col-8 q-pt-sm col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  class=" col-12 col-md-6 q-px-sm"
                  v-model="itemData.pr_invoice_code_info"
                  lazy-rules
                  :rules="[(val) => (val > 0 && val <= 999999999999) || '请输入正确的发票代码,发票号码一般是10位或12位']"
                >
                </q-input>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3 col-md-2 text-center">发票号码：</div>
              <div class="col-8 q-pt-sm col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  class=" col-12 col-md-6 q-px-sm"
                  v-model="itemData.pr_invoice_number"
                  :error="false"
                  lazy-rules
                  :rules="[(val) => (val > 0 && val <= 99999999) || '请输入正确的发票号码，发票号码一般是8位']"
                >
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="开票" @click="addUpdateReward()" color="primary" class="text-right q-px-md" unelevated />
          <q-btn label="取消" @click="clearFields()" class="text-right q-px-md" color="grey" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: '',
      dialogShow: false,
      itemData: {}
    }
  },

  mounted () {},
  created () {
    this.itemData = this.params.data
  },
  computed: {},
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showPopup(this.dataId)
    },
    buttonShow () {
      this.dialogShow = true
    },
    clearFields () {
      this.dialogShow = false
    },
    addUpdateReward () {
      this.$refs.itemDataRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '确定',
              message: '确定开具发票？',
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              const obj = {
                ...this.itemData,
                pr_status: 1
              }
              this.$store
                .dispatch('receipt/setRecordInfo', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      message: '成功',
                      caption: '开票成功',
                      color: 'green'
                    })
                    this.params.context.getDatalist()
                  }
                })
                .catch((error) => {
                  this.$q.notify({
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    message: '失败',
                    caption: error.message,
                    color: 'red'
                  })
                })
            })
        }
      })
    },
    closeDialog () {
      this.$refs.integralDataRef.resetValidation()
    }
  }
}
</script>
