<template>
  <q-page class="fit row">

    <div class="col-5 full-height">
      <select-goods ref="selectGoodsRef" :memberId="currentMemberInfo.id" @refreshDataList="addShoppingCart"> </select-goods>
    </div>
    <div class="col-7">
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
        <div class="col-shrink  bg-white q-pa-sm full-height bg-grey-2">
          <div class="row">
            <div class=" col-4 q-pa-xs" v-for="item in goodsData" :key="item.id">
              <q-card bordered flat class="q-ma-sm">
                <q-card-section class="q-pa-xs">
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ item.package_name }}</q-item-label>
                      <q-item-label caption>
                        <span v-if="item.rechargePackage.gtg_time_type == 3">
                          指定时间内有效，有效期为
                          {{ $q_date.formatDate(item.gtg_time_start * 1000, 'YYYY-MM-DD ') }}到
                          {{ $q_date.formatDate(item.gtg_time_end * 1000, 'YYYY-MM-DD ') }}内有效
                        </span>
                        <span v-if="item.rechargePackage.gtg_time_type == 2">
                          <span v-if="item.rechargePackage.gtg_time_end == 1"
                            >相对时间内有效，有效期为{{ item.rechargePackage.gtg_time_start }}年内有效</span
                          >
                          <span v-if="item.rechargePackage.gtg_time_end == 2"
                            >相对时间内有效，有效期为{{ item.rechargePackage.gtg_time_start }}季度内有效</span
                          >
                          <span v-if="item.rechargePackage.gtg_time_end == 3"
                            >相对时间内有效，有效期为{{ item.rechargePackage.gtg_time_start }}月内有效</span
                          >
                          <span v-if="item.rechargePackage.gtg_time_end == 4"
                            >相对时间内有效，有效期为{{ item.rechargePackage.gtg_time_start }}周内有效</span
                          >
                          <span v-if="item.rechargePackage.gtg_time_end == 5"
                            >相对时间内有效，有效期为{{ item.rechargePackage.gtg_time_start }}天内有效</span
                          >
                        </span>
                        <span v-if="item.rechargePackage.gtg_time_type == 1">永久有效</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side class="text-h6 text-deep-orange">
                      <q-item-label>{{ item.gtg_selling_price }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-separator />
                <div style="height:150px" class="con-example-images q-pa-xs">
                  <q-list>
                    <q-item :key="key" v-for="(data, key) in item.rechargeCount">
                      <q-item-section>
                        <q-item-label>
                          {{ data.tgd_goods_name }}
                          {{ data.tgd_spe_name ? '-' + data.tgd_spe_name : '' }}
                        </q-item-label>
                        <q-item-label caption> </q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption> {{ data.tgd_time_compute_duration }}分钟</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <q-separator />
                <q-card-actions align="center">
                  <q-btn label="删除" @click="deleteBut(item.id)" class="full-width" color="red" unelevated />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <q-card flat class="q-my-sm">
            <div class="row q-px-sm q-mt-sm">
              <div class="col-6 col-md-3 q-pa-xs">
                时长: <span class="text-h4 text-orange"> {{ totalTimeCount }}</span>
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
                  @click="rewardLabel"
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
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutTimeerPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>
  </q-page>
</template>
<script>
import SelectGoods from './components/SelectGoods.vue'
import SelectLabel from 'src/pages/reward/label/SelectLabel.vue'
export default {
  components: {
    SelectGoods,
    SelectLabel
  },
  data () {
    return {
      goodsData: [],
      gridOptions: {},

      memberId: 0,
      context: null,
      localeText: this.$ag_grid_localeText,
      checkoutPageReceive: false,
      totalAmount: 0,
      totalTimeCount: 0,
      currentMemberInfo: {},
      labelVisible: false,
      meiyeRewardData: []
    }
  },

  mounted () {
    this.context = this
  },
  created () {},
  computed: {},
  methods: {
    // 打开读卡界面
    openReadingDialog () {
      this.$nextTick(() => {
        this.$refs.cardReadingRef.openReaderDialog()
      })
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
    // 重置会员卡
    resetMemberInfo () {
      this.$nextTick(() => {
        this.currentMemberInfo = {}
        this.goodsData = []
        this.getShoppingCartData()
      })
    },
    // 获取购物车数据
    getShoppingCartData () {
      this.selectTimeStatus = false
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('addGroupDuration/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data ? res.data.goodsData : []
            this.totalAmount = this.formatAmount(res.data.totalAmount)

            this.totalTimeCount = this.formatAmount(res.data.totalTimeCount)
          }
        })
        .catch((error) => {})
    },

    // 重置
    refreshBut () {
      this.memberId = 0
      // this.$refs.memberCardReading.emptyMemberCardInfo()
      this.currentMemberInfo = {}
      this.totalAmount = 0
      this.totalTimeCount = 0
      this.goodsData = []
    },
    // 选择套餐
    addGroupTimeSelectGoods () {
      const that = this
      this.selectTimeStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.selectGoodsRef.info()
        }, 500)
      })
    },

    openCheckoutTimeerPage () {
      const amountsPayable = this.totalAmount
      this.checkoutPageReceive = true

      const rechargeBufferData = this.goodsData.map(item => {
        return item.id
      })
      const return_param = {
        rechargeBufferData,
        ...this.cashRegisterData,
        meiyeRewardData: this.meiyeRewardData
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutTimeerPage.checkoutPageReceive('addGroupDuration', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false

      this.$store
        .dispatch('addGroupDuration/addinvoice', v)
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
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
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
      const that = this
      if (packageId > 0) {
        const obj = {
          packageId,
          gtg_name: data.gtg_name,
          member_id: that.memberId,
          quantity: 1
        }
        this.$store
          .dispatch('addGroupDuration/addShoppingCart', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功添加至购物车',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.getShoppingCartData()
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
      const rtb_expiry_time_type = parseInt(p.data.rtb_expiry_time_type)
      const rtb_time_rule_start = parseInt(p.data.rtb_time_rule_start)
      const rtb_time_rule_end = parseInt(p.data.rtb_time_rule_end)

      if (rtb_expiry_time_type == 3) {
        return parseInt(rtb_time_rule_end) >= 2147457847 ? '永久有效' : this.$q_date.formatDate(rtb_time_rule_end * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
      if (parseInt(rtb_expiry_time_type) == 2) {
        if (parseInt(rtb_time_rule_end) == 1) {
          return rtb_time_rule_start + '年有效'
        }
        if (parseInt(rtb_time_rule_end) == 2) {
          return rtb_time_rule_start + '月有效'
        }
        if (parseInt(rtb_time_rule_end) == 3) {
          return rtb_time_rule_start + '月有效'
        }
        if (parseInt(rtb_time_rule_end) == 4) {
          return rtb_time_rule_start + '周有效'
        }
        if (parseInt(rtb_time_rule_end) == 5) {
          return rtb_time_rule_start + '天有效'
        }
      }
      if (parseInt(rtb_expiry_time_type) == 1) {
        return '永久有效'
      }
    },

    rowSpan (params) {
      const fields = ['rtb_package_name', 'shoppingCarId']

      const data = this.goodsData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    // 列表自适应
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
        // params.api.autoSizeAllColumns()
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

    deleteBut (shoppingCarId) {
      const obj = {
        shoppingCarId
      }
      this.$store
        .dispatch('addGroupDuration/delList', obj)
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
        this.$refs.labelData.openStaffLabel(this.goodsData, 'addGroupDuration')
      })
    },
    getRewardLabel (val) {
      this.labelVisible = false
      this.meiyeRewardData = val
      setTimeout(() => {
        this.openCheckoutTimeerPage()
      }, 500)
    }
  }
}
</script>
