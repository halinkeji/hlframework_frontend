<template>
  <div class="q-ma-sm">
    <q-card flat class="q-pa-sm q-mb-md">
      <div class="q-pr-sm">
        <hl-card-reading
          ref="memberCardReading"
          navType="horizontal"
          @refreshDataList="getMemberInfo"
        ></hl-card-reading>
      </div>
      <div class="row q-mt-sm">
        <div class="col-12 col-md-7 q-pr-sm q-mt-sm">
          <q-input
            outlined
            bottom-slots
            v-model="rechargeAmount"
            @input="checkMoney"
            class="q-mt-md text-h4"
            :rules="[
              val => !!val || '请填写充值金额',
              val =>
                /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                  val
                ) || '请输入正确的金额'
            ]"
          >
            <template v-slot:prepend>
              <span class="text-subtitle1">充值</span>
            </template>
            <template v-slot:append>
              <div class="q-pl-none">
               {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
              </div>
            </template>
          </q-input>
          <div class="row">
            <div class="col q-pl-xs">
              <q-btn-toggle
                v-model="rechargeType"
                spread
                no-caps
                class="q-mt-md my-custom-toggle"
                unelevated
                toggle-color="primary"
                color="white"
                size="lg"
                @click="cleanButton"
                text-color="black"
                :options="[
                  { label: '合同', value: 1 },
                  { label: '员工', value: 2 }
                ]"
              />
            </div>
          </div>
          <div class="row q-mt-xs q-gutter-md">
            <div class="col">
              <q-btn
                unelevated
                color="amber-8 "
                class="full-width q-py-xs"
                label="重置"
                @click="refreshButton"
                :disable="rechargeAmount == '' && memberId == 0"
                icon="ion-refresh"
              />
            </div>
            <div class="col">
              <q-btn
                unelevated
                color="red-5"
                @click="clearButton"
                class="full-width q-py-xs"
                :disable="!rechargeAmount"
                label="清除"
                icon="las la-trash-alt"
              />
            </div>
            <div class="col">
              <q-btn
                unelevated
                color="blue-8"
                class="full-width q-py-xs"
                label="结账"
                v-if="authorityMeta('settle')"
                @click="paySuccessCallBack"
                :disable="disabled || memberId == 0"
                icon="las la-chevron-circle-down"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'tradeRecharge',
  components: {},
  data () {
    return {
      memberId: 0,
      rechargeAmount: '',
      rechargeGiveMoney: '',
      rechargeType: 1,
      disabled: true
    }
  },
  created () {},
  mounted () {},
  computed: {},
  watch: {
    rechargeAmount (val) {
      if (val > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  methods: {
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
        }
      }
    },
    // 清除
    clearButton () {
      this.rechargeAmount = ''
      this.rechargeGiveMoney = ''
    },
    // 重置
    refreshButton () {
      this.rechargeAmount = ''
      this.rechargeGiveMoney = ''
      this.memberId = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
    },
    checkMoney () {
      const re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (re.test(this.rechargeAmount)) {
        const obj = {
          rechargeAmount: this.rechargeAmount,
          rechargeType: this.rechargeType,
          memberId: this.memberId
        }
        this.$store
          .dispatch('tradeRecharge/checkMoney', obj)
          .then(res => {
            if (res.code == 400) {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                timeout: 800,
                position: 'top-right',
                color: 'red'
              })
              this.rechargeAmount = ''
            }
          })
          .catch(error => {})
      }
    },
    paySuccessCallBack () {
      if (this.rechargeAmount > 0) {
        this.$q
          .dialog({
            title: '确定',
            message: '确定进行充值吗？',
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            const params = {
              member_id: this.memberId,
              rechargeType: this.rechargeType,
              rechargeAmount: this.rechargeAmount,
              rechargeGiveMoney: this.rechargeGiveMoney
            }
            this.$store
              .dispatch('tradeRecharge/setData', params)
              .then(res => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '充值成功',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    position: 'top-right'
                  })
                  this.refreshButton()
                } else {
                  this.$q.notify({
                    message: '失败',
                    caption: '操作失败',
                    icon: 'ion-close-circle-outline',
                    position: 'top-right',
                    color: 'red'
                  })
                }
              })
              .catch(error => {})
          })
      }
    },
    cleanButton () {
      this.rechargeAmount = ''
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
