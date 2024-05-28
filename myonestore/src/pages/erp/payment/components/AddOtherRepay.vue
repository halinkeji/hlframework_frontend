<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="isDialogStatus" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm"
      >
        <q-card-section class="q-ma-none q-pa-none row">
          <div class="text-subtitle2">
            新增其他付款单
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-form ref="otherRepayRef" class="q-gutter-xs">

          <q-select
            outlined
            option-value="id"
            option-label="gs_supplierName"
            emit-value
            map-options
            v-model="formData.supplier_id"
            :options="supplierList"
            dense
            label="请选择供货商"
            :rules="[(val) => !!val || '请选择供货商']"
          />

          <q-input
            outlined
            dense
            @change="moneyChange()"
            v-model="formData.epr_receivable"
            label="应付金额"
            lazy-rules
            :rules="[
              (val) => !!val || '请输入付款金额',
              (val) => /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/.test(val) || '请输入正确的金额',
            ]"
          />

          <q-input
            outlined
            @input="moneyChange()"
            v-model="formData.epr_discount_rate"
            label="折扣率"
            dense
            lazy-rules
            :rules="[(val) => /^([1-9][0-9]{0,1}|100)$/.test(val) || '请输入正确的折扣率']"
          />
          <q-input outlined v-model="formData.epr_discount_money" label="折扣额" disable dense :error="false" />
          <q-input outlined v-model="formData.epr_money" label="实付金额" disable dense :error="false" />
          <q-input outlined rows="2" v-model="formData.epr_description" label="备注" dense type="textarea" :error="false" />
        </q-form>

        <div class="row justify-center q-gutter-sm">
          <q-btn class="q-px-xl" label="提交" color="primary" unelevated @click="saveData()" />
          <q-btn class="q-px-xl" label="关闭" @click="hideNowPage()" unelevated color="grey" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddMoneyPoppup',
  data () {
    return {
      dialogWidth: '1000px',
      isDialogStatus: false,
      supplierList: [],
      formData: {
        epr_receivable: '',
        epr_type: '2',
        epr_discount_rate: 100,
        epr_discount_money: 0,
        epr_description: '',
        epr_money: '',
        supplier_id: ''
      }
    }
  },
  mounted () {},
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.3) + 'px'
    }
    this.getSupplierList()
  },
  computed: {},
  methods: {
    init () {
      this.isDialogStatus = true
    },
    // 获取列表,搜索
    getSupplierList () {
      this.$store
        .dispatch('payment/getSupplier')
        .then((res) => {
          if (res.code == 200) {
            this.supplierList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    saveData () {
      this.$refs.otherRepayRef.validate().then((success) => {
        if (success) {
          if (!this.formData.supplier_id) {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '请先选择供货商',
              color: 'red'
            })
            return false
          }
          const obj = {
            receipt: this.formData
          }
          this.$store
            .dispatch('payment/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '付款成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                  this.isDialogStatus = false
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },
    moneyChange () {
      const payMoney = (this.formData.epr_receivable * (100 - this.formData.epr_discount_rate)) / 100
      this.formData.epr_discount_money = Math.round(payMoney * 100) / 100
      const money = (this.formData.epr_receivable * this.formData.epr_discount_rate) / 100
      this.formData.epr_money = Math.round(money * 100) / 100
    },
    hideNowPage () {
      this.$emit('dataList')
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
