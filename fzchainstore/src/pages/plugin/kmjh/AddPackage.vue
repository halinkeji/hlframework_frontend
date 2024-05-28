<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.5 + 'px',
        'min-width': this.$q.screen.width * 0.5 + 'px',
      }"
      class="q-pa-md q-pl-lg"
    >
      <q-card-section class="row items-center q-pa-none q-mb-lg">
        <div class="text-h6">{{ packageData.id > 0 ? '查看' : '新增' }}卡密激活套餐</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-form ref="packageDataRef">
        <div class="q-pr-sm">
          <q-banner rounded class="text-white bg-red" dense>
            注意：套餐不可修改！注册套餐必须选择会员等级！开启会员权益会直接赠送会员级别相关权益！赠送卡券、次卡、计时卡、储值、积分时，不填不选则不赠送!
          </q-banner>
        </div>
        <div class="row q-mt-md">
          <div class="col-6 q-pr-md">
            <q-input outlined dense v-model="packageData.pkp_name" label="套餐名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
          </div>
          <div class="col-6 q-pr-sm">
            <q-input outlined dense v-model="packageData.pkp_selling_price" label="套餐售价" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的套餐售价']" />
          </div>
        </div>
        <div class="row q-mt-xs">
          <div class="col-6 q-pr-md">
            <q-select outlined dense v-model="packageData.pkp_type" :options="typeOptions" label="类型" class="col-12 col-md-2" option-label="label" emit-value map-options />
          </div>
          <div class="col-6 q-pr-sm">
            <q-select outlined dense v-model="packageData.pkp_status" :options="statusOptions" label="状态" class="col-12 col-md-2" option-label="label" emit-value map-options />
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-6 q-pr-md">
            <q-select
              outlined
              dense
              v-model="packageData.pkp_member_level"
              :options="levelOptions"
              label="会员等级"
              class="col-12 col-md-2"
              option-label="mcl_level_name"
              option-value="id"
              emit-value
              map-options
              :rules="[(val) => (parseInt(packageData.pkp_type) == 1 ? true : !!val || '请选择会员等级')]"
            />
          </div>
          <div class="col-6 q-pr-sm">
            <q-select outlined dense v-model="packageData.pkp_is_level_equity" :options="statusOptions" label="会员权益" class="col-12 col-md-2" option-label="label" emit-value map-options />
          </div>
        </div>
        <div class="row q-mt-xs">
          <div class="col-6 q-pr-md">
            <q-input outlined dense v-model="packageData.pkp_give_balance" label="赠送储值" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的赠送储值']" />
          </div>
          <div class="col-6 q-pr-sm">
            <q-input outlined dense v-model="packageData.pkp_give_integral" label="赠送积分" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的赠送积分']" />
          </div>
        </div>
        <div class="q-mt-xs">
          <q-chip outline square color="red" text-color="white"> 赠送储值 {{ packageData.pkp_give_balance }} 元，赠送 {{ packageData.pkp_give_integral }} 积分 </q-chip>
        </div>
        <q-card flat bordered class="q-my-xs">
          <q-card-section class="row items-center q-py-xs">
            <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送次数</span>
            <q-space />
            <q-btn label="添加次卡" unelevated @click="addGroupCountSelectGoods" color="primary" />
          </q-card-section>

          <q-separator />

          <q-card-section flat class="row" v-if="selectedCountData.length > 0">
            <div class="q-pa-xs col-4" v-for="(item, key) in selectedCountData" :key="key">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label>名称：{{ item.grp_name }}</q-item-label>
                    <q-item-label>
                      价格：
                      <span class="text-orange"> ￥ </span>
                      <span class="text-h6 text-orange text-weight-bold">{{ item.grp_packagePrice }}</span>
                    </q-item-label>
                    <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                      有效期：
                      <q-badge color="red"> 永久有效</q-badge>
                    </q-item-label>
                    <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                      有效期：
                      <q-badge color="red">
                        {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                        至
                        {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                      有效期：
                      <q-badge color="red">
                        领取后{{ item.grp_startTime }}
                        <span v-if="item.grp_endTime == 1">年 </span>
                        <span v-if="item.grp_endTime == 2">季度 </span>
                        <span v-if="item.grp_endTime == 3">月 </span>
                        <span v-if="item.grp_endTime == 4">周 </span>
                        <span v-if="item.grp_endTime == 5">天 </span>内有效
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                  <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delCount(key)" />
                </q-item>
                <q-expansion-item expand-separator icon="payment" label="详情">
                  <q-list v-if="item.rechargeDetail">
                    <q-item v-for="(i, k) in item.rechargeDetail" :key="k">
                      <q-item-section>
                        <q-item-label>
                          {{ i.grc_goodsName }}
                          {{ i.grc_speName ? '-' + i.grc_speName : '' }}
                          ({{ i.grc_count }})
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-item-label caption>
                          <span v-if="parseInt(i.grc_limitTime) == 1">无限制</span>
                          <span v-if="parseInt(i.grc_limitTime) == 2">使用限制为{{ i.grc_limitCount }}次/年</span>
                          <span v-if="parseInt(i.grc_limitTime) == 3">使用限制为{{ i.grc_limitCount }}次/季度</span>
                          <span v-if="parseInt(i.grc_limitTime) == 4">使用限制为{{ i.grc_limitCount }}次/月</span>
                          <span v-if="parseInt(i.grc_limitTime) == 5">使用限制为{{ i.grc_limitCount }}次/周</span>
                          <span v-if="parseInt(i.grc_limitTime) == 6">使用限制为{{ i.grc_limitCount }}次/天</span>

                          <q-icon name="las la-archive" color="red" />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </q-list>
            </div>
          </q-card-section>

          <q-card-section flat v-else>
            <div class="q-ml-md">
              暂无赠送
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="q-my-xs">
          <q-card-section class="row items-center q-py-xs">
            <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送计时</span>
            <q-space />
            <q-btn label="添加时卡" unelevated @click="showSelectGoods" color="primary" />
          </q-card-section>

          <q-separator />

          <q-card-section flat class="row" v-if="selectedGoodsTimingData.length > 0">
            <div class="q-px-xs col-4" v-for="(item, key) in selectedGoodsTimingData" :key="key">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label>名称：{{ item.gtg_name }}</q-item-label>
                    <q-item-label>
                      价格：
                      <span class="text-orange"> ￥ </span>
                      <span class="text-h6 text-orange text-weight-bold">{{ item.gtg_selling_price }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delTiming(key)" />
                </q-item>
                <q-expansion-item expand-separator icon="access_time" label="详情">
                  <q-list v-if="item.detail">
                    <q-item v-for="(i, k) in item.detail" :key="k">
                      <q-item-section>
                        <q-item-label>{{ i.tgd_goods_name }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-item-label caption>({{ i.tgd_time_compute_duration }}分钟) <q-icon name="star" color="yellow"/></q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-section flat class="row" v-else>
            <div class="q-ml-md">
              暂无赠送
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="q-my-xs">
          <q-card-section class="row items-center q-py-xs">
            <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送优惠券</span>
            <q-space />
            <q-btn unelevated color="primary" label="添加优惠券" @click="showCoupon" />
          </q-card-section>
          <q-separator />
          <q-card-section flat class="row" v-if="selectedCouponData.length > 0">
            <div class="q-px-xs col-4" v-for="(item, key) in selectedCouponData" :key="key">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-h6">{{ item.cou_title }}</q-item-label>
                    <q-item-label caption lines="3">
                      <q-badge outline color="red" class="q-mx-xs">
                        <!-- {{ couponTypeItem[parseInt(item.cou_type)] }} -->
                      </q-badge>
                      <q-badge outline color="primary" class="q-ma-xs">
                        <!-- {{ couponPropertyItem[parseInt(item.cou_couponProperty)] }} -->
                      </q-badge>
                      <q-badge outline color="teal" class="q-ma-xs" v-if="parseInt(item.cou_dateType) == 1">
                        {{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD') }} 至
                        {{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD') }}
                      </q-badge>
                      <q-badge outline color="teal" class="q-ma-xs" v-else-if="parseInt(item.cou_dateType) == 2">
                        领取后{{ item.cou_startDay != 0 ? item.cou_startDay : '当' }}天生效,有效期 {{ item.cou_endDay }} 天
                      </q-badge>
                    </q-item-label>
                    <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 1">
                      <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_rebate * 0.1 }} </span>
                      <span class="text-caption">折</span>
                    </q-item-label>
                    <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 2">
                      <span class="text-caption"> 满 </span>
                      <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ item.cou_fill }}</span>
                      <span class="text-caption"> 减 </span>
                      <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ item.cou_minus }} </span>
                    </q-item-label>
                    <q-item-label caption lines="3" v-if="[3, 4, 5].indexOf(parseInt(item.cou_type))">
                      {{ item.cou_extra }}
                    </q-item-label>
                    <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 6">
                      兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_integral }} </span> 积分
                    </q-item-label>
                    <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 7">
                      兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_balance }} </span> 储值
                    </q-item-label>
                  </q-item-section>
                  <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delCoupon(key)" />
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-section flat class="row" v-else>
            <div class="q-ml-md">
              暂无赠送
            </div>
          </q-card-section>
        </q-card>
        <div align="right" class="q-mt-md q-mr-sm" v-if="!packageData.id">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" color="primary" @click="setData" v-if="authorityMeta('savePackage')" />
          <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
    <select-coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
    <hl-select-time-group ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup" />
    <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"></hl-select-count-group>
  </q-dialog>
</template>
<script>
import SelectCoupon from '../hlcoupon/components/SelectCoupon.vue'
import SelectGoods from './SelectGoods'
export default {
  name: 'KmjhAddPackage',
  components: {
    SelectCoupon,
    SelectGoods
  },
  data () {
    return {
      showDialog: true,
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      addButtonDisabled: false,
      packageData: {
        pkp_name: '',
        pkp_selling_price: '',
        pkp_type: 1,
        pkp_status: 1,
        pkp_member_level: '',
        pkp_is_level_equity: -1,
        pkp_give_balance: 0,
        pkp_give_integral: 0
      },
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponIdData: [],
      levelOptions: [],
      statusOptions: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: -1
        }
      ],
      typeOptions: [
        {
          label: '激活套餐',
          value: 1
        },
        {
          label: '注册套餐',
          value: 2
        }
      ]
    }
  },
  created () {
    this.getMemberLevelList()
  },
  mounted () {},
  computed: {},
  methods: {
    getMemberLevelList () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.levelOptions = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    showCoupon () {
      this.couponPoppupStatus = true
    },
    showSelectGoods () {
      this.selectGoodsPoppupStatus = true
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsTimeRef.info()
      })
    },
    hideCouponPoppup (couponValue) {
      if (couponValue) {
        const couponIndex = _.findIndex(this.selectedCouponData, function (o) { return parseInt(o.id) == parseInt(couponValue.id) })
        if (couponIndex < 0) {
          this.selectedCouponData.push(couponValue)
        }
      }

      this.couponPoppupStatus = false
    },
    hideSelectGoodsPoppup (item) {
      this.selectedGoodsTimingData.push(item)
      this.$q.notify({
        message: '成功',
        caption: '添加计时卡成功！',
        icon: 'ion-checkmark-circle-outline',
        color: 'green',
        timeout: 500,
        position: 'top-right'
      })
      this.selectGoodsPoppupStatus = false
    },
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('kmjh/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.packageData = res.data.package ? res.data.package : {}
              this.packageData.pkp_type = res.data.package.pkp_type ? parseInt(res.data.package.pkp_type) : ''
              this.packageData.pkp_status = res.data.package.pkp_status ? parseInt(res.data.package.pkp_status) : ''
              this.packageData.pkp_is_level_equity = res.data.package.pkp_is_level_equity ? parseInt(res.data.package.pkp_is_level_equity) : ''
              this.selectedCouponData = res.data.coupon ? res.data.coupon : []
              this.selectedCountData = res.data.count ? res.data.count : []
              this.selectedGoodsTimingData = res.data.timing ? res.data.timing : []
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
    setData () {
      this.$refs.packageDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.packageData,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            TimingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('kmjh/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.packageData.id > 0 ? '修改' : '新增'}` + '卡密激活套餐成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    setCount (packageId, item) {
      this.selectedCountData.push(item)
      this.$q.notify({
        message: '成功',
        caption: '添加次卡成功！',
        icon: 'ion-checkmark-circle-outline',
        color: 'green',
        timeout: 500,
        position: 'top-right'
      })
    },
    delCoupon (key) {
      this.selectedCouponData.splice(key, 1)
    },
    delCount (key) {
      this.selectedCountData.splice(key, 1)
    },
    delTiming (key) {
      this.selectedGoodsTimingData.splice(key, 1)
    },
    addGroupCountSelectGoods () {
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsRef.info()
      })
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
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
