<template>
  <q-page class="fit row no-wrap justify-between items-stretch content-stretch">
    <div class="col-shrink col-xs-10 col-sm-11 col-md-11 col-lg-11 col-xl-11">
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
        <div class="col-shrink  bg-white q-pa-sm full-height bg-grey-2">
          <q-scroll-area class="fit">
            <div class="row full-height">
              <div class="col-3 q-pa-sm" v-for="(item, key) in deductCountList">
                <q-card flat class="my-card">
                  <q-card-section>
                    <div class="text-h6">{{ item.mrc_goodsName }}{{ item.mrc_speName ? '-' + item.mrc_speName : '' }}</div>
                    <div class="text-subtitle2">到期时间:{{ expireDate(item) }}</div>
                    <div class="text-caption text-grey">使用规则:{{ rulesUse(item) }}</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input  input-class="color_cinnabar" @input="changeDeductCount(item)" :hint="`剩余${item.mrc_count}次`" v-model="item.mrc_deductcount" label="本次使用">
                      <template v-slot:prepend>
                        <q-btn
                          color="grey"
                          push
                          @click="item.mrc_deductcount--;totalCountData()"
                          :disable="parseInt(item.mrc_deductcount) > 0 ? false : true"
                          size="sm"
                          round
                          icon="remove"
                        />
                      </template>
                      <template v-slot:append>
                        <q-btn
                           class="bg_cinnabar"
                          @click="item.mrc_deductcount++;totalCountData()"
                          size="sm"
                          :disable="item.mrc_deductcount == item.mrc_count"
                          push
                          round
                          icon="add"
                        />
                      </template>
                    </q-input>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <q-card flat class="q-my-sm">
            <div class="row q-px-sm q-mt-sm text-center">
              <div class="col-6 q-pa-xs">
                <span class="text-subtitle1 text-weight-bold"
                  >本次扣除 <span class="text-h5 text-red text-weight-bold">{{ deductCounts }}</span> 次</span
                >
              </div>
              <div class="col-6 q-pa-xs">
                <span class="text-subtitle1 text-weight-bold"
                  >总次数 <span class="text-h5 text-red text-weight-bold">{{ totalCount }} </span> 次
                </span>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1  column justify-end">
      <q-checkbox dense v-model="printInvoiceStatus" label="打印小票" color="blue-8" />

      <q-btn  class="full-width q-my-xs q-py-sm " color="amber-8" padding="none" :disable="memberId == 0" @click="refreshBut">
        <span class="text-subtitle1 q-my-xs text-white">重置</span>
      </q-btn>
      <q-btn
        class="full-width q-my-xs q-py-sm text-white bg_cinnabar"
        @click="rewardLabel()"
        :disable="totalCount > 0 ? false : true"
        icon="las la-minus-circle"
      >
        <span class="text-subtitle1 q-my-xs text-white">扣次</span>
      </q-btn>
    </div>
     <select-label v-if="labelVisible" ref="labelData" @getRewardLabel="getRewardLabel"></select-label>

  </q-page>
</template>
<script>
import SelectLabel from 'src/pages/reward/label/SelectLabel.vue'
export default {
  name: 'deductCount',
  components: {
    SelectLabel
  },
  data () {
    return {
      printInvoiceStatus: true,
      deductCountList: [],
      memberId: 0,

      deductCounts: 0,
      totalCount: 0,
      currentMemberInfo: {},
      labelVisible: false,
      meiyeRewardData: []
    }
  },

  mounted () {},
  created () {},
  watch: {},
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
      })
    },
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.currentMemberInfo = val
          this.getListData()
        }
      }
    },
    // 获取次卡列表
    getListData () {
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('deductCount/getListData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductCountList = res.data.map((item) => {
              return {
                id: item.id,
                goods_id: item.goods_id,
                spe_id: item.spe_id,
                mrc_goodsName: item.mrc_goodsName,
                mrc_speName: item.mrc_speName,
                mrc_deductcount: 0,
                mrc_count: item.mrc_count,
                mrc_endTime: item.mrc_endTime,
                mrc_limitTime: item.mrc_limitTime,
                mrc_limitCount: item.mrc_limitCount,
                mrc_expiryTimeType: item.mrc_expiryTimeType,
                mrc_startTime: item.mrc_expiryTimeType,
                mrc_timeRuleOne: item.mrc_timeRuleOne,
                mrc_timeRuleTwo: item.mrc_timeRuleTwo,
                mrc_totalPrice: item.mrc_totalPrice,
                package_id: item.package_id,
                recharge_type: item.recharge_type,
                mrc_order_status: item.mrc_order_status,
                mrc_packageName: item.mrc_packageName,
                mrc_price: item.mrc_price
              }
            })
            // this.deductCountList = res.data

            this.$nextTick(() => {
              this.totalCountData()
            })
          }
        })
        .catch((error) => {})
    },
    // 扣次
    deductionBut () {
      const obj = {
        mId: this.memberId,
        meiyeRewardData: this.meiyeRewardData,
        printInvoiceStatus: this.printInvoiceStatus,
        deductCountList: this.deductCountList
      }
      this.$store
        .dispatch('deductCount/addinvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data.errorArray.length > 0) {
              res.data.errorArray.forEach((i, k) => {
                this.$q.notify({
                  progress: true,
                  position: 'top',
                  color: 'white',
                  textColor: 'primary',
                  message: i,
                  multiLine: true,
                  timeout: 3500
                })
              })
            } else {
              this.$q.notify({
                message: '成功',
                caption: '计次消费成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
            }
            this.$nextTick(() => {
              this.totalCountData()
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '计次消费失败，请重新操作！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }

          this.refreshBut()
        })
        .catch((error) => {})
    },

    totalCountData () {
      let totalCount = 0
      let deductCounts = 0
      this.deductCountList.forEach(function (item) {
        totalCount += parseInt(item.mrc_count)
        deductCounts += parseInt(item.mrc_deductcount) > 0 ? parseInt(item.mrc_deductcount) : 0
      })
      this.deductCounts = deductCounts
      this.totalCount = totalCount
    },

    expireDate (data) {
      if (parseInt(data.mrc_endTime) >= 2147457847) {
        return '永久有效'
      } else {
        return this.$q_date.formatDate(data.mrc_endTime * 1000, 'YYYY-MM-DD HH:mm')
      }
    },
    changeDeductCount (data) {
      const itemsToUpdate = []

      const re = /^[0-9]*[0-9][0-9]*$/
      if (re.test(data.mrc_deductcount)) {
        if (parseInt(data.mrc_deductcount) >= parseInt(data.mrc_count)) {
          data.mrc_deductcount = data.mrc_count
        }
      } else {
        data.mrc_deductcount = 0
      }

      this.$nextTick(() => {
        this.totalCountData()
      })
    },
    // 使用规则
    rulesUse (data) {
      if (parseInt(data.mrc_limitTime) == 1) {
        return '不限制规定时间使用次数'
      } else if (parseInt(data.mrc_limitTime) == 2) {
        return '使用限制为每年可使用' + data.mrc_limitCount + '次'
      } else if (parseInt(data.mrc_limitTime) == 3) {
        return '使用限制为每季度可使用' + data.mrc_limitCount + '次'
      } else if (parseInt(data.mrc_limitTime) == 4) {
        return '使用限制为每月可使用' + data.mrc_limitCount + '次'
      } else if (parseInt(data.mrc_limitTime) == 5) {
        return '使用限制为每周可使用' + data.mrc_limitCount + '次'
      } else {
        return '使用限制为每天可使用' + data.mrc_limitCount + '次'
      }
    },

    // 重置
    refreshBut () {
      this.memberId = 0
      this.resetMemberInfo()
      this.deductCountList = []
    },
    rewardLabel () {
      this.labelVisible = true
      this.$nextTick(() => {
        this.$refs.labelData.openStaffLabel(this.deductCountList, 'deductCount')
      })
    },
    getRewardLabel (val) {
      this.labelVisible = false
      this.meiyeRewardData = val
      setTimeout(() => {
        this.deductionBut()
      }, 500)
    }
  }
}
</script>

<style lang="scss"></style>
