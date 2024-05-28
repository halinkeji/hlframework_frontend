<template>
  <q-page class="fit row no-wrap justify-between items-stretch content-stretch">
    <div class="col-shrink col-xs-3 col-sm-4 col-md-4 col-lg-4 col-xl-4">
      <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink  bg-white q-px-xs q-pb-md">
          <q-item class="q-mb-sm">
            <q-item-section avatar>
              <q-avatar v-if="currentMemberInfo.coverImage && currentMemberInfo.coverImage.id" text-color="white">
                <img :src="$q.localStorage.getItem('mychainstore_system_local').attach_url + currentMemberInfo.coverImage.path" />
              </q-avatar>
              <q-avatar color="grey" text-color="white" v-else icon="person" />
            </q-item-section>

            <q-item-section v-if="currentMemberInfo.id">
              <q-item-label>{{ currentMemberInfo.mem_memberName }}</q-item-label>
              <q-item-label caption lines="1">
                {{ currentMemberInfo.mem_memberCardNum }}({{
                  currentMemberInfo.memberLevel ? currentMemberInfo.memberLevel.mcl_level_name : '无等级'
                }})
              </q-item-label>
            </q-item-section>
            <q-item-section v-else>
              <q-item-label>请读卡</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn unelevated class="full-width q-my-xs bg_cinnabar" v-if="!currentMemberInfo.id" @click="openReadingDialog">
                <span class="text-subtitle1 q-my-xs text-white">会员(m)</span>
              </q-btn>
              <q-btn color="negative" unelevated class="full-width q-my-xs" v-else @click="resetMemberInfo">
                <span class="text-subtitle1 q-my-xs">重置</span>
              </q-btn>
            </q-item-section>
          </q-item>
          <hl-dialog-card-reading ref="cardReadingRef" @refreshDataList="getMemberInfo" />
        </div>
        <div class="col-shrink  bg-white q-mt-xs full-height bg-grey-2">
          <q-scroll-area class="fit full-height">
            <q-list separator class="rounded-borders bg-white">
              <q-item :key="key" v-for="(item, key) in goodsData" class="cursor-pointer">
                <q-item-section top>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">
                      {{ item.mrc_goodsName }}{{ item.mrc_specificationName ? '-' + item.mrc_specificationName : '' }}
                    </span>
                  </q-item-label>
                  <q-item-label caption lines="2">{{ rulesUseText(item) }} </q-item-label>
                  <q-item-label lines="2" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                    <span>到期时间: {{ endTimeText(item) }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <span class="q-ml-md text-caption text-red">
                    x
                    <span class="text-weight-bold  text-uppercase text-h6">
                      {{ item.mrc_count }}
                    </span>
                  </span>
                </q-item-section>

                <q-item-section side>
                  <span class="q-ml-md text-caption text-red">
                    ￥
                    <span class="text-weight-bold  text-uppercase text-h6">
                      {{ item.mrc_totalPrice }}
                    </span>
                  </span>
                </q-item-section>

                <q-item-section side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" color="red" @click="setCountInfo(item)" flat dense round icon="las la-edit" />
                    <q-btn size="12px" @click="deleteBut(item)" color="red" flat dense round icon="las la-trash" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <q-card flat class="q-my-sm">
            <div class="row q-px-sm q-mt-sm text-center">
              <div class="col-6 q-pa-xs">
                <span class="text-subtitle1 text-weight-bold"
                  >总次数 <span class="text-h5 text-red text-weight-bold">{{ totalCount }}</span> 次</span
                >
              </div>
              <div class="col-6 q-pa-xs">
                <span class="text-subtitle1 text-weight-bold"
                  >总额 <span class="text-h5 text-red text-weight-bold">{{ totalAmount }} </span> ￥
                </span>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1 column justify-end">
      <q-btn color="red" class="full-width q-my-xs q-py-sm " padding="none" :disable="goodsData.length > 0 ? false : true" @click="clearShoppingCart">
        <span class="text-subtitle1 q-my-xs text-white">清空</span>
      </q-btn>

      <q-btn color="amber-8" class="full-width q-my-xs q-py-sm text-white" @click="refreshBut()" :disable="memberId == 0" icon="ion-refresh">
        <span class="text-subtitle1 q-my-xs text-white">重置</span>
      </q-btn>

      <q-btn
        class="full-width q-my-xs q-py-sm text-white bg_cinnabar"
        @click="rewardLabel()"
        :disable="memberId && goodsData ? false : true"
        icon="las la-chevron-circle-down"
      >
        <span class="text-subtitle1 q-my-xs text-white">结账</span>
      </q-btn>
    </div>
    <!-- right -->
    <div class="col-shrink col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
      <right-layout :memberId="memberId" @getShoppingCartList="getShoppingCartList" />
    </div>
    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>

    <q-dialog v-model="setInfoStatus">
      <q-card flat :style="{ width: $q.screen.width * 0.3 + 'px', 'min-width': $q.screen.width * 0.3 + 'px' }">
        <q-card-section>
          <div class="text-h6">修改次卡信息</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" ref="countInfoFormRef">
            <q-input
              outlined
              v-model="currentCountInfo.mrc_count"
              label="共充次"
              lazy-rules
              dense
              :rules="[(val) => /^[1-9]\d*$/.test(val) || '请输入正确的次数']"
            />
            <q-select
              v-model="currentCountInfo.mrc_expiryTimeType"
              :options="[
                { label: '永久有效', value: '1' },
                { label: '相对时间', value: '2' },
                { label: '固定时间', value: '3' },
              ]"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              dense
              outlined
              label="到期时间类型"
              class="q-mb-md"
              :rules="[(val) => !!val || '请选择到期时间类型']"
            />

            <q-input
              dense
              outlined
              label="相对时间范围"
              v-if="parseInt(currentCountInfo.mrc_expiryTimeType) == 2"
              v-model="currentCountInfo.mrc_timeRuleOne"
              :rules="[(val) => /^[1-9]\d*$/.test(val) || '请输入正确的时间范围']"
            />
            <q-select
              outlined
              v-if="parseInt(currentCountInfo.mrc_expiryTimeType) == 2"
              label="相对时间周期"
              v-model="currentCountInfo.mrc_timeRuleTwo"
              :rules="[(val) => !!val || '请选择相对时间周期']"
              :options="[
                {
                  label: '年',
                  value: '1',
                },
                {
                  label: '季度',
                  value: '2',
                },
                {
                  label: '月',
                  value: '3',
                },
                {
                  label: '周',
                  value: '4',
                },
                {
                  label: '天',
                  value: '5',
                },
              ]"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              dense
            />

            <q-input
              v-model="currentCountInfo.mrc_timeRuleTwo"
              v-if="parseInt(currentCountInfo.mrc_expiryTimeType) == 3"
              label="选择到期时间"
              dense
              emit-value
              map-options
              square
              readonly
              outlined
              :rules="[(val) => !!val || '请选择到期时间']"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="currentCountInfo.mrc_timeRuleTwo" mask="YYYY-MM-DD" flat>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="关闭" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              v-model="currentCountInfo.mrc_limitTime"
              label="限制周期"
              :rules="[(val) => !!val || '请选择限制周期']"
              outlined
              :options="[
                {
                  label: '不限制',
                  value: '1',
                },
                {
                  label: '年',
                  value: '2',
                },
                {
                  label: '季度',
                  value: '3',
                },
                {
                  label: '月',
                  value: '4',
                },
                {
                  label: '周',
                  value: '5',
                },
                {
                  label: '天',
                  value: '6',
                },
              ]"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              dense
              @input="changeLimitTime"
            />

            <q-input
              outlined
              dense
              v-if="parseInt(currentCountInfo.mrc_limitTime) != 1"
              v-model="currentCountInfo.mrc_limitCount"
              label="限制次数"
              lazy-rules
              :rules="[(val) => /^[1-9]\d*$/.test(val) || '请输入正确的限制次数']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn unelevated label="取消" @click="closeCountInfo" color="red" />
          <q-btn unelevated label="确定" @click="confirmCountInfo" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <select-label v-if="labelVisible" ref="labelData" @getRewardLabel="getRewardLabel"></select-label>
  </q-page>
</template>

<script>
import RightLayout from './RightLayout.vue'
import SelectLabel from 'src/pages/reward/label/SelectLabel.vue'

export default {
  name: 'addCount',
  components: {
    RightLayout,
    SelectLabel
  },

  data () {
    return {
      gridOptions: {},
      goodsData: [],
      memberId: 0,
      cashRegisterData: {},
      checkoutPageReceive: false,
      currentMemberInfo: {},
      setInfoStatus: false,
      currentCountInfo: {},
      timeOptions: {
        1: '年',
        2: '季度',
        3: '月',
        4: '周',
        5: '天'
      },
      labelVisible: false,
      meiyeRewardData: []
    }
  },

  mounted () {},
  created () {},
  computed: {
    totalCount () {
      let count = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          count += parseInt(item.mrc_count)
        })
      }
      return count
    },
    totalAmount () {
      const that = this
      let amount = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          amount += that.formatAmount(item.mrc_totalPrice)
        })
      }

      return that.formatAmount(amount)
    }
  },
  methods: {
    endTimeText (item) {
      if (parseInt(item.mrc_expiryTimeType) == 1) {
        return '永久有效'
      } else if (parseInt(item.mrc_expiryTimeType) == 2) {
        return '购买后' + item.mrc_timeRuleOne + this.timeOptions[item.mrc_timeRuleTwo] + '内有效'

        // return item.mrc_timeRuleOne + '--' + item.mrc_timeRuleTwo
      } else if (parseInt(item.mrc_expiryTimeType) == 3) {
        return this.$q_date.formatDate(item.mrc_timeRuleTwo, 'X')
      }
    },

    rulesUseText (item) {
      if (parseInt(item.mrc_limitTime) == 1) {
        return '不限制'
      } else {
        return '使用限制为每' + this.timeOptions[parseInt(item.mrc_limitTime) + 1] + '内可使用' + item.mrc_limitCount + '次'
      }
    },

    // 打开读卡界面
    openReadingDialog () {
      this.$nextTick(() => {
        this.$refs.cardReadingRef.openReaderDialog()
      })
    },

    // 重置会员卡
    resetMemberInfo () {
      this.$nextTick(() => {
        this.currentMemberInfo = {}
        this.goodsData = []
      })
    },

    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.cashRegisterData.member_id = this.memberId
          this.currentMemberInfo = val
          this.getShoppingCartList()
        }
      }
    },

    // 获取购物车数据
    getShoppingCartList () {
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('addCount/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    // 选择商品
    selectGoodsBut () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1)
        }, 500)
      })
    },

    // 清空购物车
    clearShoppingCart () {
      const obj = {
        type: 2,
        mId: this.memberId
      }
      this.$store
        .dispatch('addCount/delList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = []
            this.$q.notify({
              message: '成功',
              caption: '清空成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false
      // const obj = {
      //   goodsData: this.goodsData,
      //   ...this.cashRegisterData
      // };
      this.$store
        .dispatch('addCount/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '增加计次成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.refreshBut()
          } else {
            this.$q.notify({
              message: '失败',
              caption: '操作失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })

            this.disabled = false
          }
        })
        .catch((error) => {})
    },

    // 重置
    refreshBut () {
      this.memberId = 0
      this.resetMemberInfo()
      this.goodsData = []
    },

    openCheckoutCounterPage () {
      const amountsPayable = this.totalAmount
      this.checkoutPageReceive = true
      const return_param = {
        goodsData: this.goodsData,
        ...this.cashRegisterData,
        meiyeRewardData: this.meiyeRewardData
      }
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addCount', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    closeCheckoutPopup () {
      this.checkoutPageReceive = false
    },

    // 删除购物车单条数据
    deleteBut (val) {
      const obj = {
        type: 1,
        id: val.id
      }
      this.$store
        .dispatch('addCount/delList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })

            setTimeout(() => {
              this.getShoppingCartList()
            }, 500)
          }
        })
        .catch((error) => {})
    },
    //  设置当前更改的数据
    setCountInfo (item) {
      this.setInfoStatus = true
      this.$nextTick(() => {
        this.currentCountInfo = JSON.parse(JSON.stringify(item))
      })
    },

    // 确认修改
    confirmCountInfo () {
      this.$refs.countInfoFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            shoppingCartProductInfo: this.currentCountInfo
          }
          this.$store
            .dispatch('addCount/putnumber', obj)
            .then((res) => {
              if (res.code == 200 && res.data) {
                this.setInfoStatus = false
                this.getShoppingCartList()
              } else {
                this.$q.notify({
                  message: '操作失败',
                  caption: '添加购物车失败,请联系管理员',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.getShoppingCartList()
                }, 500)
              }
            })
            .catch((error) => {})
        }
      })
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    closeCountInfo () {
      this.setInfoStatus = false
      this.$nextTick(() => {
        this.currentCountInfo = {}
      })
    },
    // 更改限制周期
    changeLimitTime () {
      if (parseInt(this.currentCountInfo.mrc_limitTime) == 1) {
        this.currentCountInfo.mrc_limitCount = 0
      }
    },
    rewardLabel () {
      this.labelVisible = true
      this.$nextTick(() => {
        this.$refs.labelData.openStaffLabel(this.goodsData, 'addCount')
      })
    },
    getRewardLabel (val) {
      this.labelVisible = false
      this.meiyeRewardData = val
      setTimeout(() => {
        this.openCheckoutCounterPage()
      }, 500)
    }
  }
}
</script>
