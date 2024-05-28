<template>
  <q-dialog v-model="qrcodeDialog" persistent>
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <q-form ref="consumeSetFormRef">
        <q-item>
          <q-item-section>
            <q-item-label> 提现 </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" @click="closeDialog"> </q-btn>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-section >
          <q-input outlined dense v-model="withdrawForm.pdw_amount" label="提现金额" disable />
        </q-card-section>

        <q-card-section >
          <q-input outlined dense v-model="withdrawForm.pdw_service_fee" label="提现手续费" disable />
        </q-card-section>

        <q-card-section>
          <q-input outlined dense v-model="withdrawForm.pdw_arrival_amount" label="到账金额" disable />
        </q-card-section>

         <q-card-section >
          <q-input outlined dense v-model="withdrawPeriodStart" label="结算周期开始时间" disable />
        </q-card-section>

        <q-card-section >
          <q-input outlined dense v-model="withdrawPeriodEnd" label="结算周期结束时间" disable />
        </q-card-section>

         <q-card-section >
          <q-input outlined dense v-model="minWithdrawAmount" label="最低提现金额" disable />
        </q-card-section>

          <q-card-section >
          <q-input outlined dense v-model="withdrawCount" label="结算单据数" disable />
        </q-card-section>

      </q-form>
      <q-card-actions align="center">
        <q-btn @click="saveWithdrawData" :disable="withdrawForm.pdw_arrival_amount > minWithdrawAmount ? false : true" color="primary" class="q-px-xl" unelevated>提现</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'WithdrawDialog',
  data () {
    return {
      qrcodeDialog: false,
      currentLibId: 0,
      withdrawForm: {
        pdw_amount: 0,
        pdw_transfer_method: 0,
        pdw_status: 1,
        pdw_withdraw_lib_id: 0,
        pdw_withdraw_lib_name: '',
        pdw_service_fee: 0,
        pdw_arrival_amount: 0
      },
      minWithdrawAmount: 0,
      withdrawCount: 0,
      withdrawPeriodStart: '',
      withdrawPeriodEnd: ''
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (libId, name) {
      this.qrcodeDialog = true
      this.currentLibId = libId
      this.withdrawForm.pdw_withdraw_lib_id = libId
      this.withdrawForm.pdw_withdraw_lib_name = name

      this.$nextTick(() => {
        this.getWithdrawCount()
      })
    },
    getWithdrawCount () {
      const obj = {
        relation_lib_id: this.currentLibId
      }
      this.$store
        .dispatch('financeManage/getMechantWithdrawCount', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            const resultData = res.data
            this.withdrawForm.pdw_amount = resultData.accountUseAmount
            this.withdrawForm.pdw_service_fee = resultData.withdrawServiceFee
            this.withdrawForm.pdw_arrival_amount = resultData.arrivalAmount
            this.withdrawPeriodStart = resultData.withdrawPeriodStart
            this.withdrawPeriodEnd = resultData.withdrawPeriodEnd
            this.minWithdrawAmount = resultData.minWithdrawAmount
            this.withdrawCount = resultData.withdrawCount
          }
        })
        .catch((error) => {})
    },
    saveWithdrawData () {
      this.withdrawForm.pdw_withdraw_start_time = this.$q_date.formatDate(this.withdrawPeriodStart, 'X')
      this.withdrawForm.pdw_withdraw_end_time = this.$q_date.formatDate(this.withdrawPeriodEnd, 'X')
      const obj = {
        ...this.withdrawForm
      }
      this.$store
        .dispatch('financeManage/setMechantWithdrawData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '申请成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.closeDialog()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },
    closeDialog () {
      this.qrcodeDialog = false
      this.$emit('closeDialog')
    }
  }
}
</script>

<style></style>
