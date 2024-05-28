<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-mb-xs q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        会员登记
      </div>
      <div class="col-shrink full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-form ref="memberDataRef" class="row">
            <div class="col-8 q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-6">
                  <q-input
                    label="卡号"
                    outlined
                    v-model="memberItem.mem_memberCardNum"
                    dense
                    lazy-rules
                    readonly
                    :rules="[(val) => !!val || '卡号是必填的', (val) => /^\d+$/.test(val) || '卡号为非负整数']"
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
                <div class="col-12 col-md-6">
                  <!-- (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || val.length == 0 || '电话号不正确', -->

                  <q-input
                    label="手机号"
                    outlined
                    v-model="memberItem.mem_memberMobile"
                    dense
                    lazy-rules
                    :rules="[(val) => !!val || '手机号是必填的']"
                    @input="changeMemberMobile"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input label="昵称" outlined v-model="memberItem.mem_memberName" dense lazy-rules :rules="[(val) => !!val || '昵称是必填的']" />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    emit-value
                    map-options
                    :disable="parseInt(memberItem.id) > 0"
                    option-label="mcl_level_name"
                    option-value="id"
                    v-model="memberItem.membercardlevel_id"
                    :options="memberCardLevelDatas"
                    dense
                    label="会员等级"
                    :rules="[(val) => !!val || '必须选择会员级别']"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input label="真实姓名" outlined v-model="memberItem.mem_memberRealName" dense lazy-rules :error="false" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined v-model="memberItem.mem_license_plate" dense label="车牌号" lazy-rules :error="false" />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    label="身份证"
                    outlined
                    v-model="memberItem.mem_memberIdentityNum"
                    dense
                    lazy-rules
                    :error="cardIdVerify"
                    :error-message="'身份证号格式不正确'"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    emit-value
                    map-options
                    option-value="value"
                    option-label="label"
                    v-model="memberItem.mem_memberSex"
                    :options="sexOptions"
                    dense
                    lazy-rules
                    :error="false"
                    label="性别"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    emit-value
                    map-options
                    option-value="value"
                    option-disable="inactive"
                    option-label="label"
                    v-model="memberItem.mem_memberBirthdayType"
                    :options="roleOptions"
                    dense
                    label="生日类型"
                    lazy-rules
                    :error="false"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input readonly outlined v-model="birthday" label="出生日期" dense lazy-rules :error="false">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-date v-model="birthday" mask="YYYY-MM-DD" :options="optionsLimit" today-btn>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6">
                  <hl-address
                    :province="memberItem.province"
                    :city="memberItem.city"
                    :area="memberItem.district"
                    @province="provinceupdate"
                    @city="cityupdate"
                    @area="areaupdate"
                  ></hl-address>
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined v-model="memberItem.mem_memberDetailAddress" dense label="详细地址" lazy-rules :error="false" />
                </div>

                <div class="col-12 col-md-6">
                  <q-input outlined v-model="memberItem.mem_memberNote" dense type="textarea" label="会员备注" />
                </div>
                <div class="col-12 col-md-6" align="left ">
                  <hl-avatar
                    :coverImage="memberItem.coverImage"
                    @confirmCheck="
                      (val) => {
                        $nextTick(() => {
                          memberItem.mem_memberPicture = val;
                        });
                      }
                    "
                  />
                </div>

                <div class="col-12">
                  <select-membertag @getMembertag="getMembertag" :memberId="memberItem.id" class="q-my-md"> </select-membertag>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="q-mt-sm" v-if="is_main_store">
                <q-select
                  label="门店"
                  :rules="[(val) => !!val || '请选择门店']"
                  @input="changeRegStore"
                  v-model="memberItem.StoreId"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  dense
                  outlined
                  :options="libInStoreList"
                />
              </div>

              <paidreg-model
                ref="paidregModelRef"
                @getPackage="getPaidRegPackage"
                @asynReg="hideSubmit"
                :storeId="memberItem.StoreId"
                @paidregSuccess="paidregSuccess"
              />
            </div>
          </q-form>
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
        membercardlevel_id: '',
        mem_memberCardNum: '',
        province: '',
        city: '',
        district: '',
        province_id: '',
        city_id: '',
        district_id: '',
        mem_memberName: '',
        mem_memberMobile: '',
        mem_memberWechat: '',
        mem_memberRealName: '',
        mem_memberIdentityNum: '',
        mem_memberBirthdayType: '1',
        mem_memberDetailAddress: '',
        mem_memberSex: '3',
        mem_memberNote: '',
        mem_memberStatus: 1,
        mem_memberBirthdayYear: '',
        mem_memberBirthdayMonth: '',
        mem_memberBirthdayDay: '',
        mem_memberPicture: '',
        mem_license_plate: '',
        StoreId: ''
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
      libInStoreList: [],
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
    },
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    } else {
      this.setRegStore()
    }
    this.getLevel()
    if (this.$route.query.memberId) {
      this.memberItem.id = this.$route.query.memberId
      this.operatingText = '会员修改'
      this.getMemberInfo()
    }
    if (LocalStorage.getItem('sspacechainstore_store_local').storeMemberConfig) {
      this.storeMemberConfig = LocalStorage.getItem('sspacechainstore_store_local').storeMemberConfig
    }
    if (LocalStorage.getItem('sspacechainstore_plugins_local').openPlugins) {
      this.openPlugins = LocalStorage.getItem('sspacechainstore_plugins_local').openPlugins
    }
  },
  methods: {
    changeMemberMobile () {
      if (this.storeMemberConfig && parseInt(this.storeMemberConfig.member_level_defaultMobile) == 1) {
        this.memberItem.mem_memberCardNum = this.memberItem.mem_memberMobile
      }
    },

    generateNewCardNumber () {
      let cardNumber = ''
      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberPrefix) {
        cardNumber += this.storeMemberConfig.member_level_cardNumberPrefix
      }

      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberLength) {
        cardNumber += this.randomStr(this.storeMemberConfig.member_level_cardNumberLength)
      } else {
        cardNumber += this.randomStr(11)
      }

      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberSuffix) {
        cardNumber += this.storeMemberConfig.member_level_cardNumberSuffix
      }
      this.memberItem.mem_memberCardNum = cardNumber
    },

    randomStr (cardNumberLength) {
      const len = parseInt(cardNumberLength) ? parseInt(cardNumberLength) : 11
      const t = '1234567890'
      let val = ''
      for (let i = 0; i < len; i++) {
        val += t.charAt(Math.floor(Math.random() * t.length))
      }
      return val
    },

    openKmjhRegDialog () {
      this.kmjhRegDialogStatus = true
      this.$nextTick(() => {
        this.$refs.kmjhRegRef.init()
      })
    },
    changeRegStore () {
      this.$nextTick(() => {
        this.$refs.paidregModelRef.getList(this.memberItem.StoreId)
      })
    },
    setRegStore () {
      const accountInfo = this.$q.localStorage.getItem('sspacechainstore_account_info')
      if (accountInfo && accountInfo.store_id) {
        this.$nextTick(() => {
          this.$refs.paidregModelRef.getList(accountInfo.store_id)
        })
      }
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    optionsLimit (date) {
      return date <= this.$q_date.formatDate(new Date(), 'YYYY/MM/DD')
    },
    getLevel () {
      this.$store
        .dispatch('level/getAllData', {
          mclType: 'default'
        })
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelDatas = res.data ? res.data : []
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

    addMemberData () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const timestr = this.birthday
          if (timestr) {
            const arr = timestr.split('-')
            this.memberItem.mem_memberBirthdayYear = arr[0]
            this.memberItem.mem_memberBirthdayMonth = arr[1]
            this.memberItem.mem_memberBirthdayDay = arr[2]
          }

          const obj = {
            ...this.memberItem,
            memberTagData: this.memberTagData,
            paidregPayInfo: this.paidregPayInfo
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
        id: '',
        membercardlevel_id: '',
        mem_memberCardNum: '',
        province: '',
        city: '',
        district: '',
        province_id: '',
        city_id: '',
        district_id: '',
        mem_memberName: '',
        mem_memberMobile: '',
        mem_memberWechat: '',
        mem_memberRealName: '',
        mem_memberIdentityNum: '',
        mem_memberBirthdayType: '1',
        mem_memberDetailAddress: '',
        mem_memberSex: '3',
        mem_memberNote: '',
        mem_memberStatus: 1,
        mem_memberBirthdayYear: '',
        mem_memberBirthdayMonth: '',
        mem_memberBirthdayDay: '',
        mem_memberPicture: ''
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
