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
          <div class="text-subtitle2">新增其他收款单</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-form ref="otherRepayRef" class="q-gutter-xs">
          <q-select
            outlined
            option-value="id"
            option-label="ecp_name"
            emit-value
            map-options
            v-model="formData.client_id"
            :options="clientList"
            dense
            label="请选择客户"
            :rules="[(val) => !!val || '请选择客户']"
          />
          <q-input
            outlined
            dense
            @change="moneyChange()"
            v-model="formData.err_receivable"
            label="应收金额"
            lazy-rules
            :rules="[
              (val) => !!val || '请输入收款金额',
              (val) => /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/.test(val) || '请输入正确的金额',
            ]"
          />
          <q-input
            outlined
            @input="moneyChange()"
            v-model="formData.err_discount_rate"
            label="折扣率"
            dense
            lazy-rules
            :rules="[(val) => /^([1-9][0-9]{0,1}|100)$/.test(val) || '请输入正确的折扣率']"
          />
          <q-input outlined v-model="formData.err_discount_money" label="折扣额" disable dense :error="false" />
          <q-input outlined v-model="formData.err_money" label="实收金额" disable dense :error="false" />
          <q-input outlined rows="2" v-model="formData.err_description" label="备注" dense type="textarea" :error="false" />
        </q-form>

        <div class="row justify-center q-gutter-sm">
          <q-btn class="q-px-xl" label="提交" unelevated color="primary" @click="saveData()" />
          <q-btn class="q-px-xl" label="关闭" unelevated @click="hideNowPage()" color="grey" />
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
      clientList: [],
      formData: {
        err_receivable: '',
        err_type: '2',
        err_discount_rate: 100,
        err_discount_money: 0,
        err_description: '',
        err_money: '',
        client_id: ''
      }
    }
  },
  mounted () {},
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.3) + 'px'
    }
    this.getClientList()
  },
  computed: {},
  methods: {
    init () {
      this.isDialogStatus = true
    },
    // 获取列表,搜索
    getClientList () {
      this.$store
        .dispatch('erpCustomer/getClient')
        .then((res) => {
          if (res.code == 200) {
            this.clientList = res.data ? res.data : []
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
          if (!this.formData.client_id) {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '请先选择客户',
              color: 'red'
            })
            return false
          }
          const obj = {
            receipt: this.formData
          }
          this.$store
            .dispatch('repayment/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '收款成功',
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
                caption: '操作失败',
                color: 'red'
              })
            })
        }
      })
    },
    moneyChange () {
      const payMoney = (this.formData.err_receivable * (100 - this.formData.err_discount_rate)) / 100
      this.formData.err_discount_money = Math.round(payMoney * 100) / 100
      const money = (this.formData.err_receivable * this.formData.err_discount_rate) / 100
      this.formData.err_money = Math.round(money * 100) / 100
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
