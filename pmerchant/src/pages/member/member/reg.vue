<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-mb-xs q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        会员登记
      </div>
      <div class="col-shrink full-height bg-white">
        <q-scroll-area class="fit full-height">
          <div class="row">
            <div class="col-8">
              <q-card flat class="q-pa-sm">
                <q-form ref="memberDataRef" class="q-gutter-md q-mt-md">
                  <div class="row justify-center">

                    <div class="col-7">
                      <!-- (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || val.length == 0 || '电话号不正确', -->

                      <q-input
                        label="手机号"
                        outlined
                        v-model="memberItem.phone_number"
                        dense
                        lazy-rules
                         @input="changeMemberMobile"
                        :rules="[(val) => !!val || '手机号是必填的',(val) => val.length == 11 || '请输入11位手机号']"
                      />
                    </div>
                    <div class="col-7">
                      <q-input
                        label="卡号"
                        outlined
                        v-model="memberItem.card_number"
                        dense
                        lazy-rules
                        readonly
                        :rules="[(val) => !!val || '卡号是必填的']"
                      >
                        <template v-slot:after>
                         <q-btn
                          color="warning"
                          v-if="!(storeMemberConfig && parseInt(storeMemberConfig.member_level_defaultMobile) == 1)"
                          class="full-width"
                          unelevated
                          label="一键生成卡号"
                          @click="generateNewCardNumber"
                        />
                        </template>
                      </q-input>
                    </div>

                    <div class="col-7">
                      <q-input
                        label="昵称"
                        outlined
                        v-model="memberItem.nick_name"
                        class="q-mt-xs"
                        dense
                        lazy-rules
                        :rules="[(val) => !!val || '昵称是必填的']"
                      />
                    </div>
                    <div class="col-7">
                      <q-select
                        class="q-mt-xs"
                        outlined
                        emit-value
                        map-options
                        :disable="parseInt(memberItem.id) > 0"
                        option-label="mcl_level_name"
                        option-value="id"
                        v-model="memberItem.level_id"
                        :options="memberCardLevelDatas"
                        dense
                        label="会员等级"
                        :rules="[(val) => !!val || '必须选择会员级别']"
                      />
                    </div>
                    <div class="col-7">
                      <select-membertag @getMembertag="getMembertag" :memberId="memberItem.id" class="q-my-md"> </select-membertag>
                    </div>
                  </div>

                </q-form>
              </q-card>
            </div>
            <div class="col-4">
              <paidreg-model ref="paidregModelRef" @getPackage="getPaidRegPackage" @asynReg="hideSubmit" @paidregSuccess="paidregSuccess" />
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-pb-sm text-center q-gutter-sm">
        <q-btn label="提交" v-if="!paidRegSubmitStatus" unelevated @click="addMemberData" color="primary" class="q-px-xl" />
        <q-btn label="支付" v-if="paidRegSubmitStatus" unelevated @click="payPaidregSubmit" color="warning" class="q-px-xl" />
        <q-btn label="返回" unelevated :to="{ name: 'member' }" color="grey" class="q-px-xl" />

        <q-btn
          label="卡密激活"
          v-if="openPlugins && openPlugins.indexOf('Kmjh') > -1"
          unelevated
          @click="openKmjhRegDialog"
          color="positive"
          class="q-px-xl"
        />
      </div>
      <q-dialog v-model="nextDialogStatus" persistent>
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">会员登记成功！</div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn unelevated color="primary" @click="resetMemberInfo()">继续登记</q-btn>
            <q-btn flat @click="nextDialogStatus = false" :to="{ name: 'member' }">返回会员列表</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <kmjh-reg @hideNowPage="kmjhRegDialogStatus = false" ref="kmjhRegRef" v-if="kmjhRegDialogStatus" />
    </div>
  </q-page>
</template>
<script>
import { LocalStorage } from 'quasar'
import KmjhReg from 'pages/plugin/kmjh/Reg.vue'
import SelectMembertag from 'pages/member/tag/components/SelectMembertag.vue'
import paidregModel from 'pages/plugin/paidreg/RegModel.vue'
export default {
  name: 'memberReg',
  components: { SelectMembertag, paidregModel, KmjhReg },
  data () {
    return {
      selection: [],
      multiple: false,
      operatingText: '会员登记',
      memberCardLevelDatas: [],
      memberItem: {
        level_id: '',
        card_number: '',
        phone_number: '',
        nick_name: ''

      },
      birthday: '',
      roleOptions: [
        { label: '公历', value: '1' },
        { label: '农历', value: '2' }
      ],
      sexOptions: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
        { label: '未知', value: '3' }
      ],

      memberTagData: [],
      nextDialogStatus: false,
      paidRegSubmitStatus: false,
      paidregPackageInfo: false,
      kmjhRegDialogStatus: false,
      storeMemberConfig: {}
    }
  },
  computed: {
    cardIdVerify () {
      if (
        this.memberItem.mem_memberIdentityNum &&
        !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.memberItem.mem_memberIdentityNum)
      ) {
        return true
      }
      return false
    }
  },
  created () {
    this.getLevel()
    if (this.$route.query.memberId) {
      this.memberItem.id = this.$route.query.memberId
      this.operatingText = '会员修改'
      this.getMemberInfo()
    }
    if (LocalStorage.getItem('pmerchant_plugins_local').openPlugins) {
      this.openPlugins = LocalStorage.getItem('pmerchant_plugins_local').openPlugins
    }

    if (LocalStorage.getItem('pmerchant_store_local').storeMemberConfig) {
      this.storeMemberConfig = LocalStorage.getItem('pmerchant_store_local').storeMemberConfig
    }
  },
  methods: {
    changeMemberMobile () {
      if (this.storeMemberConfig && parseInt(this.storeMemberConfig.member_level_defaultMobile) == 1) {
        this.memberItem.mem_memberCardNum = this.memberItem.mem_memberMobile
      }
    },
    openKmjhRegDialog () {
      this.kmjhRegDialogStatus = true
      this.$nextTick(() => {
        this.$refs.kmjhRegRef.init()
      })
    },
    optionsLimit (date) {
      return date <= this.$q_date.formatDate(new Date(), 'YYYY/MM/DD')
    },
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.memberCardLevelDatas = res.data
            }
          }
        })
        .catch((error) => {})
    },

    getMemberInfo () {
      if (this.$route.query.memberId) {
        this.$store
          .dispatch('member/getMemberInfo', parseInt(this.$route.query.memberId))
          .then((res) => {
            if (res.code == 200 && res.data) {
              this.memberItem = res.data
              this.memberItem.membercardlevel_id = this.memberItem.membercardlevel_id.toString()
              if (this.memberItem.mem_memberBirthdayYear) {
                this.birthday =
                  this.memberItem.mem_memberBirthdayYear +
                  '-' +
                  this.memberItem.mem_memberBirthdayMonth +
                  '-' +
                  this.memberItem.mem_memberBirthdayDay
              }
            } else {
              this.$q.notify({
                message: '失败',
                caption: '会员信息获取异常！',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    generateNewCardNumber () {
      const obj = {
        member_mobile: this.memberItem.phone_number
      }
      this.$store
        .dispatch('member/createMemberCardNumber', obj)
        .then((res) => {
          if (res.code == 200) {
            this.memberItem.card_number = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    addMemberData () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.memberItem,
            memberTagData: this.memberTagData,
            paidregPayInfo: this.paidregPayInfo,
            source: 'reg'
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '会员' + this.operatingText + '成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.nextDialogStatus = true
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    resetMemberInfo () {
      this.nextDialogStatus = false
      this.memberItem = {
        level_id: '',
        card_number: '',
        phone_number: '',
        nick_name: '',
        id: ''
      }
      this.memberTagData = []
    },
    provinceupdate (a) {
      this.memberItem.province = a.value
      this.memberItem.province_id = a.code
    },
    cityupdate (a) {
      this.memberItem.city = a.value
      this.memberItem.city_id = a.code
    },
    areaupdate (a) {
      this.memberItem.district = a.value
      this.memberItem.district_id = a.code
    },
    getMembertag (val) {
      this.memberTagData = val
    },
    hideSubmit () {
      this.paidRegSubmitStatus = true
    },
    getPaidRegPackage (packageInfo) {
      this.paidRegSubmitStatus = false
      this.paidregPayInfo = {
        packageInfo
      }
    },
    payPaidregSubmit () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const timestr = this.birthday
          if (timestr) {
            const endTime = this.$q_date.formatDate(timestr, 'X')
            const date = new Date()
            const startTime = this.$q_date.formatDate(date, 'X')
            if (endTime > startTime) {
              this.$q.notify({
                message: '失败',
                caption: '生日不能大于当前时间,请重新选择',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
              return false
            }
          }

          this.$nextTick(() => {
            this.$refs.paidregModelRef.openCheckoutCounterPage()
          })
        }
      })
    },
    paidregSuccess (packageInfo, payInfo) {
      this.paidregPayInfo = {
        packageInfo,
        payInfo
      }
      this.$nextTick(() => {
        this.addMemberData()
      })
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
