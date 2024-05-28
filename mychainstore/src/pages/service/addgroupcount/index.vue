<template>
  <q-page class="fit row no-wrap justify-between items-stretch content-stretch">
    <div class="col-shrink col-xs-5 col-sm-5 col-md-5 col-lg-5 col-xl-5">
      <q-scroll-area class="fit">
        <div class="row example-container">
          <div v-for="(item, key) in packageList" :key="key" class="col-md-6  col-12">
            <q-card bordered flat class="q-ma-sm">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ item.grp_name }}</q-item-label>
                  <q-item-label caption>
                    <span v-if="item.grp_timeType == 2">
                      指定时间内有效，有效期为
                      {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD ') }}到
                      {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD ') }}内有效
                    </span>
                    <span v-if="item.grp_timeType == 3">
                      <span v-if="item.grp_endTime == 1">相对时间内有效，有效期不限制</span>
                      <span v-if="item.grp_endTime == 2">相对时间内有效，有效期为{{ item.grp_startTime }}年内有效</span>
                      <span v-if="item.grp_endTime == 3">相对时间内有效，有效期为{{ item.grp_startTime }}季度内有效</span>
                      <span v-if="item.grp_endTime == 4">相对时间内有效，有效期为{{ item.grp_startTime }}月内有效</span>
                      <span v-if="item.grp_endTime == 5">相对时间内有效，有效期为{{ item.grp_startTime }}周内有效</span>
                      <span v-if="item.grp_endTime == 6">相对时间内有效，有效期为{{ item.grp_startTime }}天内有效</span>
                    </span>
                    <span v-if="item.grp_timeType == 1">永久有效</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side class="text-h6 text-deep-orange">
                  <q-item-label>{{ item.grp_packagePrice }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <div class="con-example-images q-pa-xs">
                <q-list style="height:200px;">
                  <q-item :key="key" v-for="(data, key) in item.rechargeDetail">
                    <q-item-section>
                      <q-item-label>
                        {{ data.grc_goodsName }}
                        {{ data.grc_speName ? '-' + data.grc_speName : '' }}
                      </q-item-label>
                      <q-item-label caption>
                        <span v-if="data.grc_limitTime == 1">无限制</span>
                        <span v-if="data.grc_limitTime == 2">使用限制为{{ data.grc_limitCount }}次/年</span>
                        <span v-if="data.grc_limitTime == 3">使用限制为{{ data.grc_limitCount }}次/季度</span>
                        <span v-if="data.grc_limitTime == 4">使用限制为{{ data.grc_limitCount }}次/月</span>
                        <span v-if="data.grc_limitTime == 5">使用限制为{{ data.grc_limitCount }}次/周</span>
                        <span v-if="data.grc_limitTime == 6">使用限制为{{ data.grc_limitCount }}次/天</span></q-item-label
                      >
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption>x {{ data.grc_count }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  label="选择套餐"
                  class="full-width bg_cinnabar text-white"
                  :disable="!memberId ? true : false"
                  @click="addShoppingCart(item.id, item)"
                  unelevated
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </div>

    <div class="col-shrink col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
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
              <q-btn  unelevated class="full-width q-my-xs bg_cinnabar" v-if="!currentMemberInfo.id" @click="openReadingDialog">
                <span class="text-subtitle1 q-my-xs text-white">会员(m)</span>
              </q-btn>
              <q-btn color="negative" unelevated class="full-width q-my-xs" v-else @click="resetMemberInfo">
                <span class="text-subtitle1 q-my-xs">重置</span>
              </q-btn>
            </q-item-section>
          </q-item>
          <hl-dialog-card-reading ref="cardReadingRef" @refreshDataList="getMemberInfo" />
        </div>
        <div class="col-shrink  bg-white q-pa-sm full-height bg-grey-2">
          <q-scroll-area class="fit full-height">
            <div v-for="(item, key) in goodsData">
              <q-card bordered flat class="q-ma-sm">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ item.package_name }}</q-item-label>
                    <q-item-label class="text-h6 text-deep-orange">{{ item.rechargePackage.grp_packagePrice }}</q-item-label>
                    <q-item-label caption>
                      <span v-if="item.rechargePackage.grp_timeType == 3">
                        指定时间内有效，有效期为
                        {{ $q_date.formatDate(item.rechargePackage.grp_startTime * 1000, 'YYYY-MM-DD ') }}到
                        {{ $q_date.formatDate(item.rechargePackage.grp_endTime * 1000, 'YYYY-MM-DD ') }}内有效
                      </span>
                      <span v-if="item.rechargePackage.grp_timeType == 2">

                        <span v-if="item.rechargePackage.grp_endTime == 1"
                          >相对时间内有效，有效期为{{ item.rechargePackage.grp_startTime }}年内有效</span
                        >
                        <span v-if="item.rechargePackage.grp_endTime == 2"
                          >相对时间内有效，有效期为{{ item.rechargePackage.grp_startTime }}季度内有效</span
                        >
                        <span v-if="item.rechargePackage.grp_endTime == 3"
                          >相对时间内有效，有效期为{{ item.rechargePackage.grp_startTime }}月内有效</span
                        >
                        <span v-if="item.rechargePackage.grp_endTime == 4"
                          >相对时间内有效，有效期为{{ item.rechargePackage.grp_startTime }}周内有效</span
                        >
                        <span v-if="item.rechargePackage.grp_endTime == 5"
                          >相对时间内有效，有效期为{{ item.rechargePackage.grp_startTime }}天内有效</span
                        >
                      </span>
                      <span v-if="item.rechargePackage.grp_timeType == 1">永久有效</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section class="text-h6 text-deep-orange">
                    <q-item-label>x{{ item.cpb_quantity }}</q-item-label>
                  </q-item-section>

                  <q-item-section side class="text-h6 text-deep-orange">
                    <q-btn type="filled" color="red" icon="ion-trash" flat round @click="deleteBut(item)"></q-btn>
                  </q-item-section>
                </q-item>
                <q-separator />
                <div class="row">
                  <div class="col-auto" v-for="(data, key) in item.rechargeCount">
                    <q-chip color="purple-3">
                      {{ data.grc_goodsName }}{{ data.grc_speName ? '-' + data.grc_speName : '' }}
                      <span class="text-caption text-red">
                        <span v-if="data.grc_limitTime == 1">无限制</span>
                        <span v-if="data.grc_limitTime == 2">使用限制为{{ data.grc_limitCount }}次/年</span>
                        <span v-if="data.grc_limitTime == 3">使用限制为{{ data.grc_limitCount }}次/季度</span>
                        <span v-if="data.grc_limitTime == 4">使用限制为{{ data.grc_limitCount }}次/月</span>
                        <span v-if="data.grc_limitTime == 5">使用限制为{{ data.grc_limitCount }}次/周</span>
                        <span v-if="data.grc_limitTime == 6">使用限制为{{ data.grc_limitCount }}次/天</span>
                      </span>
                      <span class="text-subtitle ">x {{ data.grc_count }}</span>
                    </q-chip>
                  </div>
                </div>
              </q-card>
            </div>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <q-card flat class="q-my-sm">
            <div class="row q-px-sm q-mt-sm">
              <div class="col-6 col-md-3 q-pa-xs">
                次数: <span class="text-h4 text-orange"> {{ totalCount }}</span>
              </div>
              <div class="col-6 col-md-3 q-pa-xs">
                总额: <span class="text-h4 text-orange"> {{ totalAmount }}</span>
              </div>

              <div class="col-6 col-md-3 q-pa-xs">
                <q-btn
                  unelevated
                  color="amber-8"
                  class="full-width q-py-xs"
                  @click="refreshBut()"
                  :disable="memberId == 0"
                  label="重置"
                  icon="ion-refresh"
                />
              </div>

              <div class="col-6 col-md-3 q-pa-xs">
                <q-btn
                  unelevated
                  class="full-width q-py-xs bg_cinnabar text-white"
                  label="结账"
                  @click="rewardLabel()"
                  :disable="memberId && goodsData ? false : true"
                  icon="las la-chevron-circle-down"
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <select-label v-if="labelVisible" ref="labelData" @getRewardLabel="getRewardLabel"></select-label>

    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>
  </q-page>
</template>
<script>
import SelectLabel from 'src/pages/reward/label/SelectLabel.vue'
export default {
  components: {
    SelectLabel
  },
  data () {
    return {
      goodsData: [],
      gridOptions: {},
      packageList: [],
      memberId: 0,
      checkoutPageReceive: false,
      selectCountStatus: false,
      currentMemberInfo: {},
      totalAmount: 0,
      totalCount: 0,
      labelVisible: false,
      meiyeRewardData: []
    }
  },

  mounted () {},
  created () {
    this.getCountPackageList()
  },
  computed: {},
  methods: {
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
        this.getShoppingCartData()
      })
    },
    // 获取充次套餐商品
    getCountPackageList () {
      const obj = {
        grp_property: 0
      }
      this.$store
        .dispatch('goodscount/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.packageList = res.data
            } else {
              this.packageList = []
            }
          }
        })
        .catch((error) => {})
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.currentMemberInfo = val
          this.getShoppingCartData()
        }
      }
    },
    // 获取购物车数据
    getShoppingCartData () {
      this.selectCountStatus = false
      const obj = {
        mId: this.memberId,
        page: 1,
        pSize: 100
      }
      this.$store
        .dispatch('addGroupCount/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data ? res.data.goodsData : []
            this.totalAmount = res.data ? res.data.totalAmount : 0
            this.totalCount = res.data ? res.data.totalCount : 0
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
        rechargeBufferData: this.goodsData,
        ...this.cashRegisterData,
        meiyeRewardData: this.meiyeRewardData
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addGroupCount', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false

      this.$store
        .dispatch('addGroupCount/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结算成功',
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
          }
        })
        .catch((error) => {})
    },
    // 添加至购物车
    addShoppingCart (packageId, data) {
      this.showGoodsList = false
      const that = this
      if (packageId > 0 && data.rechargeDetail.length > 0) {
        const goodsData = []
        data.rechargeDetail.forEach(function (item) {
          const goodsItem = {}
          goodsItem.recharge_type = 2

          goodsItem.member_id = that.memberId
          goodsItem.package_id = item.package_id
          goodsItem.mrc_packageName = data.grp_name
          goodsItem.goods_id = item.goods_id
          goodsItem.mrc_goodsName = item.grc_goodsName
          goodsItem.spe_id = item.spe_id
          goodsItem.mrc_speName = item.grc_speName
          goodsItem.mrc_count = item.grc_count

          goodsItem.mrc_price = item.grc_originalPrice
          goodsItem.mrc_totalPrice = item.grc_totalPrice

          goodsItem.mrc_limitTime = item.grc_limitTime
          goodsItem.mrc_limitCount = item.grc_limitCount

          goodsItem.mrc_expiryTimeType = data.grp_timeType
          goodsItem.mrc_timeRuleOne = data.grp_startTime
          goodsItem.mrc_timeRuleTwo = data.grp_endTime

          goodsData.push(goodsItem)
        })

        const obj = {
          goodsData: goodsData,
          packageId: packageId,
          member_id: that.memberId,
          quantity: 1,
          grp_name: data.grp_name
        }
        this.$store
          .dispatch('addGroupCount/addShoppingCart', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功添加至购物车',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.getShoppingCartData()
              })
            } else {
              this.$q.notify({
                message: '失败',
                caption: '操作失败',
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            }
          })
          .catch((error) => {})
      } else {
        this.$q.notify({
          message: '失败',
          caption: '操作失败,未找到套餐信息',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right'
        })
      }
    },

    maturityTimeType (p) {
      const mrc_expiryTimeType = parseInt(p.data.mrc_expiryTimeType)
      const mrc_timeRuleOne = parseInt(p.data.mrc_timeRuleOne)
      const mrc_timeRuleTwo = parseInt(p.data.mrc_timeRuleTwo)

      if (mrc_expiryTimeType == 3) {
        return parseInt(mrc_timeRuleTwo) >= 2147457847 ? '永久有效' : this.$q_date.formatDate(mrc_timeRuleTwo * 1000, 'YYYY-MM-DD HH:mm')
      }
      if (parseInt(mrc_expiryTimeType) == 2) {
        if (parseInt(mrc_timeRuleTwo) == 1) {
          return mrc_timeRuleOne + '年有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 2) {
          return mrc_timeRuleOne + '月有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 3) {
          return mrc_timeRuleOne + '月有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 4) {
          return mrc_timeRuleOne + '周有效'
        }
        if (parseInt(mrc_timeRuleTwo) == 5) {
          return mrc_timeRuleOne + '天有效'
        }
      }
      if (parseInt(mrc_expiryTimeType) == 1) {
        return '永久有效'
      }
    },

    closeCheckoutPopup () {
      this.checkoutPageReceive = false
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    // 删除单个商品
    deleteBut (data) {
      const obj = {
        mId: data.member_id,
        id: data.package_id,
        grp_name: data.mrc_packageName
      }
      this.$store
        .dispatch('addGroupCount/delList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '操作成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })

            setTimeout(() => {
              this.getShoppingCartData()
            }, 500)
          }
        })
        .catch((error) => {})
    },
    rewardLabel () {
      this.labelVisible = true
      this.$nextTick(() => {
        this.$refs.labelData.openStaffLabel(this.goodsData, 'addGroupCount')
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
