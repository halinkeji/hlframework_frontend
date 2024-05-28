<template>
  <q-page class="fit row no-wrap justify-between items-stretch content-stretch">
    <div class="col-shrink col-xs-3 col-sm-4 col-md-4 col-lg-4 col-xl-4">
      <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink  bg-white q-px-xs q-pb-md">
          <q-item class="q-mb-sm">
            <q-item-section avatar>
              <q-avatar v-if="currentMemberInfo.coverImage && currentMemberInfo.coverImage.id" text-color="white">
                <img :src="$q.localStorage.getItem('myonestore_system_local').attach_url + currentMemberInfo.coverImage.path" />
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
          <q-scroll-area class="fit full-height bg-white">
            <q-list separator class="rounded-borders">
              <q-item :key="key" v-for="(item, key) in goodsData" class="cursor-pointer">
                <q-item-section top>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">
                      {{ item.rtb_goods_name }}
                    </span>
                  </q-item-label>
                  <!-- <q-item-label caption lines="2">{{ rulesUseText(item) }} </q-item-label> -->
                  <q-item-label lines="2" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                    <span>到期时间: {{ endTimeText(item) }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section>
                  <span class="q-ml-md text-caption text-red">
                    <span class="text-weight-bold  text-uppercase text-h6">
                      {{ item.rtb_duration_total }} <span class="text-caption text-dark">分</span>
                    </span>

                    ×

                    <span class="text-caption text-dark">
                      {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      <span class="text-weight-bold text-red text-uppercase text-h6">
                        {{ item.rtb_selling_price }}
                      </span>
                    </span>

                    =

                    <span class="text-caption text-dark">
                      {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      <span class="text-weight-bold text-red text-uppercase text-h6">
                        {{ item.rtb_selling_price }}
                      </span>
                    </span>
                  </span>
                </q-item-section>

                <q-item-section side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" color="red" @click="setCurrentTimeInfo(item)" flat dense round icon="las la-edit" />
                    <q-btn size="12px" @click="deleteBut(item.id)" color="red" flat dense round icon="las la-trash" />
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
                  >总时长 <span class="text-h5 text-red text-weight-bold">{{ totalCount }}</span> 次</span
                >
              </div>
              <div class="col-6 q-pa-xs">
                <span class="text-subtitle1 text-weight-bold">
                  总额 {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                  <span class="text-h5 text-red text-weight-bold">{{ totalAmount }} </span>
                </span>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1 column justify-end">
      <q-btn
        color="grey"
        class="full-width q-my-xs q-py-sm "
        padding="none"
        :disable="goodsData.length > 0 ? false : true"
        @click="clearShoppingCart"
      >
        <span class="text-subtitle1 q-my-xs text-white">清空</span>
      </q-btn>

      <q-btn color="amber-8" class="full-width q-my-xs q-py-sm text-white" @click="refreshBut()" :disable="memberId == 0" icon="ion-refresh">
        <span class="text-subtitle1 q-my-xs text-white">重置</span>
      </q-btn>

      <q-btn
        class="full-width q-my-xs q-py-sm text-white bg_cinnabar"
        @click="rewardLabel()"
        :disable="memberId && goodsData && goodsData.length > 0 ? false : true"
        icon="las la-chevron-circle-down"
      >
        <span class="text-subtitle1 q-my-xs text-white">结账</span>
      </q-btn>
    </div>

    <!-- right -->
    <div class="col-shrink col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
      <right-layout :memberId="memberId" @getShoppingCartList="getShoppingCartList" />
    </div>

    <q-dialog v-model="setInfoStatus">
      <q-card flat :style="{ width: $q.screen.width * 0.3 + 'px', 'min-width': $q.screen.width * 0.3 + 'px' }">
        <q-card-section>
          <div class="text-h6">修改时卡信息</div>
        </q-card-section>

        <q-card-section>
          <q-form ref="countInfoFormRef">
            <div class="row full-width">
              <div class="col-4 ">
                <q-select
                  class=" q-px-sm full-width"
                  v-model="currentTimeInfo.rtb_duration_type"
                  :options="[
                    { label: '自定义时长', value: '1' },
                    { label: '时效计算器', value: '2' },
                  ]"
                  option-value="value"
                  option-label="label"
                  @input="computedDuration"
                  emit-value
                  map-options
                  dense
                />
              </div>
              <div class="col-8">
                <template v-if="parseInt(currentTimeInfo.rtb_duration_type) == 2">
                  <div class="row full-width" text-align="center">
                    <div class="col-4">
                      <q-input dense class=" q-px-sm full-height" v-model="currentTimeInfo.rtb_time_compute_number" @change="computedDuration">
                      </q-input>
                    </div>
                    <div class="col-4">
                      <q-select
                        class=" q-px-sm full-height"
                        v-model="currentTimeInfo.rtb_time_compute_model"
                        :options="[
                          { label: '分', value: '7' },
                          { label: '时', value: '6' },
                          { label: '日', value: '5' },
                          { label: '周', value: '4' },
                          { label: '月', value: '3' },
                          { label: '季度', value: '2' },
                          { label: '年', value: '1' },
                        ]"
                        @input="computedDuration"
                        option-label="label"
                        option-value="value"
                        map-options
                        emit-value
                        dense
                      />
                    </div>
                    <div class="col-4">
                      <q-chip outline color="primary" text-color="white"> {{ currentTimeInfo.rtb_duration_total }}分 </q-chip>
                    </div>
                  </div>
                </template>
                <template v-if="parseInt(currentTimeInfo.rtb_duration_type) == 1">
                  <q-input
                    label="充值时长"
                    :rules="[(val) => !!val || '充值时长是必填的', (val) => /^\+?[1-9][0-9]*$/.test(val) || '请输入正整数']"
                    dense
                    class="col-12 col-xs-6 col-sm-2"
                    v-model="currentTimeInfo.rtb_duration_total"
                  >
                    <template v-slot:append>
                      <q-chip outline color="primary" text-color="white"> 分 </q-chip>
                    </template>
                  </q-input>
                </template>
              </div>
            </div>
            <div class="row full-width item-center text-center">
              <div class="col-4 ">
                <q-select
                  v-model="currentTimeInfo.rtb_expiry_time_type"
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
                  @input="changeExpiryTimeType"
                />
              </div>
              <div class="col-8">
                <div>
                  <template v-if="parseInt(currentTimeInfo.rtb_expiry_time_type) == 1">永久有效</template>
                  <template v-if="parseInt(currentTimeInfo.rtb_expiry_time_type) == 2">
                    <div class="row " text-align="center">
                      <div class="col-6">
                        <q-input
                          dense
                          label="限制时间"
                          :rules="[(val) => !!val || '限制时间是必填的', (val) => /^\+?[1-9][0-9]*$/.test(val) || '请输入正整数']"
                          v-model="currentTimeInfo.rtb_time_rule_start"
                          class=" q-px-sm full-height"
                        />
                      </div>
                      <div class="col-6">
                        <q-select
                          class=" q-px-sm full-height"
                          v-model="currentTimeInfo.rtb_time_rule_end"
                          :options="timeOptions"
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          dense
                        />
                      </div>
                    </div>
                  </template>
                  <template v-if="parseInt(currentTimeInfo.rtb_expiry_time_type) == 3">
                    <q-input v-model="currentTimeInfo.rtb_time_rule_end" label="选择到期时间" dense emit-value map-options square readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date minimal v-model="currentTimeInfo.rtb_time_rule_end" mask="YYYY-MM-DD" flat>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </template>
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn unelevated label="取消" class="q-px-md" @click="closeCountInfo" color="red" />
          <q-btn unelevated label="确定" class="q-px-md" @click="confirmCountInfo" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <select-label v-if="labelVisible" ref="labelData" @getRewardLabel="getRewardLabel"></select-label>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>
  </q-page>
</template>

<script>
import RightLayout from './RightLayout.vue'
import SelectLabel from 'src/pages/reward/label/SelectLabel.vue'
export default {
  name: 'addDuration',
  components: {
    RightLayout,
    SelectLabel
  },

  data () {
    return {
      gridOptions: {},
      goodsData: [],
      memberId: 0,

      context: null,
      localeText: this.$ag_grid_localeText,
      cashRegisterData: {},
      checkoutPageReceive: false,
      currentMemberInfo: {},
      currentTimeInfo: {},
      setInfoStatus: false,
      timeOptions: [
        {
          label: '年',
          value: '1'
        },
        {
          label: '季度',
          value: '2'
        },
        {
          label: '月',
          value: '3'
        },
        {
          label: '周',
          value: '4'
        },
        {
          label: '天',
          value: '5'
        }
      ],
      timeOptionsObject: {
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

  mounted () {
    this.context = this
  },
  created () {},
  computed: {
    totalCount () {
      let count = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          count += parseInt(item.rtb_duration_total)
        })
      }
      return count
    },
    totalAmount () {
      const that = this
      let amount = 0
      if (this.goodsData.length > 0) {
        this.goodsData.forEach(function (item) {
          amount += that.formatAmount(item.rtb_subtotal_price)
        })
      }

      return that.formatAmount(amount)
    }
  },
  methods: {
    changeExpiryTimeType () {
      if (parseInt(this.currentTimeInfo.rtb_expiry_time_type) == 3) {
        this.currentTimeInfo.rtb_time_rule_end = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD')
      }
      if (parseInt(this.currentTimeInfo.rtb_expiry_time_type) == 2) {
        this.currentTimeInfo.rtb_time_rule_end = '5'
      }
    },

    //  设置当前更改的数据
    setCurrentTimeInfo (item) {
      this.setInfoStatus = true
      this.$nextTick(() => {
        this.currentTimeInfo = JSON.parse(JSON.stringify(item))
      })
    },

    endTimeText (item) {
      if (parseInt(item.rtb_expiry_time_type) == 1) {
        return '永久有效'
      } else if (parseInt(item.rtb_expiry_time_type) == 2) {
        return '购买后' + item.rtb_time_rule_start + this.timeOptionsObject[item.rtb_time_rule_end] + '内有效'
      } else if (parseInt(item.rtb_expiry_time_type) == 3) {
        return this.$q_date.formatDate(item.rtb_time_rule_end, 'X')
      }
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

    // 获取购物车数据
    getShoppingCartList () {
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('addDuration/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    // 清空购物车
    clearShoppingCart () {
      const obj = {
        type: 2,
        mId: this.memberId
      }
      this.$store
        .dispatch('addDuration/delList', obj)
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
        .dispatch('addDuration/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '增加计时成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
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
      this.currentMemberInfo = {}
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
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('addDuration', amountsPayable, parseInt(this.memberId), return_param)
      })
    },

    closeCheckoutPopup () {
      this.checkoutPageReceive = false
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
      }
    },
    computedDuration () {
      const currentTimeInfo = this.currentTimeInfo
      switch (currentTimeInfo.rtb_time_compute_model) {
        case '7':
          currentTimeInfo.rtb_duration_total = parseInt(currentTimeInfo.rtb_time_compute_number)
          break
        case '6':
          currentTimeInfo.rtb_duration_total = 60 * parseInt(currentTimeInfo.rtb_time_compute_number)
          break
        case '5':
          currentTimeInfo.rtb_duration_total = 1440 * parseInt(currentTimeInfo.rtb_time_compute_number)
          break
        case '4':
          currentTimeInfo.rtb_duration_total = 10080 * parseInt(currentTimeInfo.rtb_time_compute_number)
          break
        case '3':
          currentTimeInfo.rtb_duration_total = 43200 * parseInt(currentTimeInfo.rtb_time_compute_number)
          break
        case '2':
          currentTimeInfo.rtb_duration_total = 129600 * currentTimeInfo.rtb_time_compute_number
          break
        case '1':
          currentTimeInfo.rtb_duration_total = 525600 * parseFloat(currentTimeInfo.rtb_time_compute_number)
          break
      }

      // this.numberError();
    },
    // 确认修改
    confirmCountInfo () {
      this.$refs.countInfoFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            shoppingCartProductInfo: this.currentTimeInfo
          }
          this.$store
            .dispatch('addDuration/putnumber', obj)
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
                this.$nextTick(() => {
                  this.getShoppingCartList()
                })
              }
            })
            .catch((error) => {})
        }
      })
    },
    closeCountInfo () {
      this.setInfoStatus = false
      this.$nextTick(() => {
        this.currentTimeInfo = {}
      })
    },
    deleteBut (id) {
      const obj = {
        type: 1,
        id
      }
      this.$store
        .dispatch('addDuration/delList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.getShoppingCartList()
            })
          }
        })
        .catch((error) => {})
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    rewardLabel () {
      this.labelVisible = true
      this.$nextTick(() => {
        this.$refs.labelData.openStaffLabel(this.goodsData, 'addDuration')
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
