<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.7 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
      class="q-pa-md q-px-lg"
    >
      <q-card-section class="row items-center q-pa-none q-mb-lg">
        <div class="text-h6">提现详情</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="row  justify-center" v-if="parseInt(memberData.ftr_status) == 4">
        <div class="col-4 q-pl-lg">
          <div class="row">
            <q-icon name="check_circle_outline" color="primary" size="24px"></q-icon>
            <div class="q-pr-sm q-pl-xs self-center">申请中</div>
            <div class="col-9 self-center">
              <q-linear-progress color="primary" :value="progress" size="xs" />
            </div>
          </div>
          <div class="q-pl-lg">
            <span class="q-pl-xs">{{ $q_date.formatDate(memberData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
        <div class="col-4">
          <div class="row">
            <q-avatar color="primary" size="sm" text-color="white" v-if="parseInt(memberData.ftr_status) == 1">2</q-avatar>
            <q-icon name="check_circle_outline" color="primary" size="24px" v-else></q-icon>
            <div class="q-px-sm self-center">商家审核</div>
            <div class="col-9 self-center">
              <q-linear-progress color="red" :value="progress" size="xs" />
            </div>
          </div>
          <div class="q-pl-lg" v-if="parseInt(memberData.ftr_status) >= 2">
            <span class="q-pl-sm">{{ $q_date.formatDate(memberData.ftr_check_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
        <div class="q-pr-lg">
          <div class="row">
            <q-icon name="las la-times-circle" color="red" size="24px"></q-icon>
            <div class="q-px-sm">无效</div>
          </div>
          <div class="q-pl-lg">
            <span class="q-pl-sm">{{ $q_date.formatDate(memberData.ftr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
      </div>
      <div class="row  justify-center" v-else>
        <div class="col-3 q-pl-lg">
          <div class="row">
            <q-icon name="check_circle_outline" color="primary" size="24px"></q-icon>
            <div class="q-pr-sm q-pl-xs self-center">申请中</div>
            <div class="col-8 self-center">
              <q-linear-progress color="primary" :value="progress" size="xs" />
            </div>
          </div>
          <div class="q-pl-lg">
            <span class="q-pl-xs">{{ $q_date.formatDate(memberData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <q-avatar color="primary" size="sm" text-color="white" v-if="parseInt(memberData.ftr_status) == 1">2</q-avatar>
            <q-icon name="check_circle_outline" color="primary" size="24px" v-else></q-icon>
            <div class="q-px-sm self-center">商家审核</div>
            <div class="col-8 self-center">
              <q-linear-progress color="primary" :value="progress" size="xs" v-if="parseInt(memberData.ftr_status) >= 2" />
              <q-linear-progress color="primary" size="xs" v-else />
            </div>
          </div>
          <div class="q-pl-lg" v-if="parseInt(memberData.ftr_status) >= 2">
            <span class="q-pl-sm">{{ $q_date.formatDate(memberData.ftr_check_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <q-icon name="check_circle_outline" color="primary" size="24px" v-if="parseInt(memberData.ftr_status) == 3"></q-icon>
            <q-avatar color="grey" size="sm" text-color="white" v-else>3</q-avatar>
            <div class="q-px-sm self-center">商家打款</div>
            <div class="col-8 self-center">
              <q-linear-progress color="primary" size="xs" :value="progress" v-if="parseInt(memberData.ftr_status) == 3" />
              <q-linear-progress color="primary" size="xs" v-else />
            </div>
          </div>
          <div class="q-pl-lg" v-if="parseInt(memberData.ftr_status) >= 3">
            <span class="q-pl-sm">{{ $q_date.formatDate(memberData.ftr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
        <div class="q-pr-lg">
          <div class="row">
            <q-icon name="check_circle_outline" color="primary" size="24px" v-if="parseInt(memberData.ftr_status) >= 3"></q-icon>
            <q-avatar color="grey" size="sm" text-color="white" v-else>4</q-avatar>
            <div class="q-px-sm">提现完成</div>
          </div>
          <div class="q-pl-lg" v-if="parseInt(memberData.ftr_status) >= 3">
            <span class="q-pl-sm">{{ $q_date.formatDate(memberData.ftr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
      </div>
      <div class="text-subtitle1 text-weight-bold q-mt-md">提现信息</div>
      <q-card-section class="q-pa-sm q-mt-md">
        <div class="row justify-around">
          <div class="q-gutter-y-sm col-3" v-if="memberData.member">
            <div class="text-weight-bold row">
              <div class="col-6 text-right">分销商信息</div>
            </div>
            <div class="row">
              <div class="col-6 text-right">昵称</div>
              <div class="col-6">：{{ memberData.member.mem_memberName }}</div>
            </div>
            <div class="row" v-if="memberData.fxzx.level">
              <div class="col-6 text-right">分销等级</div>
              <div class="col-6">：{{ memberData.fxzx.level.pfl_name }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-right">联系电话</div>
              <div class="col-6">： {{ memberData.member.mem_memberMobile }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-right">累计佣金</div>
              <div class="col-6">： {{ memberData.fxzx.pfm_total_fxzx_amount }}</div>
            </div>
          </div>
          <div class="q-gutter-y-sm col-3">
            <div class="text-weight-bold row">
              <div class="col-7 text-right q-pr-lg">佣金信息</div>
            </div>
            <div class="row">
              <div class="col-7 text-right q-pr-sm">申请佣金：</div>
              <div class="col-5">{{ memberData.ftr_amount }}</div>
            </div>
            <div class="row">
              <div class="col-7 text-right q-pr-sm">申请时间：</div>
              <div class="col-5">{{ $q_date.formatDate(memberData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div class="row" v-if="parseInt(memberData.ftr_status) >= 2">
              <div class="col-7 text-right q-pr-sm">审核时间：</div>
              <div class="col-5">{{ $q_date.formatDate(memberData.ftr_check_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div class="row" v-if="parseInt(memberData.ftr_status) == 3">
              <div class="col-7 text-right q-pr-sm">打款时间：</div>
              <div class="col-5">{{ $q_date.formatDate(memberData.ftr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div class="row" v-if="parseInt(memberData.ftr_status) == 4">
              <div class="col-7 text-right q-pr-sm">无效时间：</div>
              <div class="col-5">{{ $q_date.formatDate(memberData.ftr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div class="row" v-if="parseInt(memberData.ftr_status) == 1">
              <div class="col-7 text-right q-pr-sm">
                <q-btn
                  unelevated
                  color="primary"
                  class="q-mr-xs q-px-xs"
                  label="通过"
                  @click="setCheckAmountData(2)"
                  v-if="authorityMeta('editTake')"
                >
                </q-btn>
              </div>
              <div class="col-5">
                <q-btn unelevated color="red" class="q-px-xs" label="拒绝" @click="setCheckAmountData(4)" v-if="authorityMeta('editTake')"> </q-btn>
              </div>
            </div>

            <div class="row" v-if="parseInt(memberData.ftr_status) == 2">
              <div class="col-7 text-right q-pr-sm">
                <q-btn
                  unelevated
                  color="primary"
                  class="q-mr-xs q-px-xs"
                  label="打款"
                  @click="setTakeAmountData(3)"
                  v-if="authorityMeta('editTake')"
                >
                </q-btn>
              </div>
              <div class="col-5">
                <q-btn unelevated color="red" label="重新审核" @click="setTakeAmountData(1)" v-if="authorityMeta('editTake')"> </q-btn>
              </div>
            </div>
          </div>
          <div class="q-gutter-y-sm col-3">
            <div class="text-weight-bold row">
              <div class="col-6 text-right">收款信息</div>
            </div>
            <div class="row">
              <div class="col-6 text-right">收款渠道</div>
              <div class="col-6" v-if="memberData.ftr_take_mode == 'balance'">：{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}</div>
              <div class="col-6" v-else-if="memberData.ftr_take_mode == 'wxpay'">：微信</div>
              <div class="col-6" v-else-if="memberData.ftr_take_mode == 'alipay'">：支付宝</div>
            </div>
            <div class="row"  v-if="memberData.ftr_take_mode == 'alipay'">
              <div class="col-6 text-right">收款人</div>
              <div class="col-6">：{{ memberData.ftr_alipay_name }}</div>
            </div>
            <div class="row" v-if="memberData.ftr_take_mode == 'alipay'">
              <div class="col-6 text-right">收款账号</div>
              <div class="col-6">：{{ memberData.ftr_alipay_account }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'MarketMemberDetail',
  components: {},
  data () {
    return {
      showDialog: true,
      progress: 1,
      takeId: '',
      memberData: {}
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.takeId = id
        this.$store
          .dispatch('fxzx/getTakeItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.memberData = res.data ? res.data : {}
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
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setCheckAmountData (takeStatus) {
      this.$q
        .dialog({
          title: '提示',
          message: takeStatus == 4 ? '确定不通过审核吗' : '确定通过审核吗',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          let checkTime = ''
          if (parseInt(takeStatus) == 2 || parseInt(takeStatus) == 4) {
            checkTime = parseInt(new Date().getTime() / 1000)
          }
          let endTime = ''
          if (parseInt(takeStatus) == 4 || parseInt(takeStatus) == 3) {
            endTime = parseInt(new Date().getTime() / 1000)
          }
          const params = {
            id: this.takeId,
            ftr_amount: this.memberData.ftr_amount,
            ftr_status: takeStatus,
            ftr_check_time: checkTime,
            ftr_end_time: endTime
          }
          this.$store.dispatch('fxzx/setTakeAmountData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.init(this.takeId)
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
    setTakeAmountData (takeStatus) {
      this.$q
        .dialog({
          title: '提示',
          message: takeStatus == 3 ? '确定打款吗' : '确定重新审核吗',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          let checkTime = this.memberData.ftr_check_time
          let endTime = ''
          if (parseInt(takeStatus) == 1) {
            checkTime = ''
          }
          if (parseInt(takeStatus) == 3) {
            endTime = parseInt(new Date().getTime() / 1000)
          }
          const params = {
            id: this.takeId,
            ftr_amount: this.memberData.ftr_amount,
            ftr_member_id: this.memberData.ftr_member_id,
            ftr_status: takeStatus,
            ftr_check_time: checkTime,
            ftr_end_time: endTime
          }
          this.$store.dispatch('fxzx/setTakeAmountData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.init(this.takeId)
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
