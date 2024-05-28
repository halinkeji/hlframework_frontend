<template>
  <q-card flat>
    <q-card-section>
      <change-card ref="changeCardRef" @returnMethod="refreshMembership" v-if="numberChangeStatus"></change-card>
      <bind-card ref="refreshBindRef" @returnMethod="refreshBindMemberCard" v-if="bindCardStatus"></bind-card>
      <upgrade ref="upgradeRef" @returnMethod="levelName" v-if="levelChangeStatus"></upgrade>
      <extension ref="extensionRef" @returnMethod="extension" @click="delayChangeStatus"></extension>
      <change-bind ref="changeRef" v-if="changeBindStatus"></change-bind>
      <div class="row q-gutter-md">
        <q-btn unelevated color="indigo" label="绑定实体卡" size="12px" class="q-px-md" icon="las la-sim-card" @click="bindPhysicalCard" />
        <q-btn unelevated color="red-5" label="换卡" size="12px" class="q-px-md" icon="lar la-credit-card" @click="changeNumber" />
        <q-btn unelevated color="blue-6" label="店铺改绑" size="12px" class="q-px-md" icon="las la-pen" @click="changeBind" v-if="is_main_store" />
        <q-btn unelevated color="red-5" label="升级" size="12px" class="q-px-md" icon="las la-upload" @click="LevelChange" />
        <q-btn unelevated color="amber-8" label="延期" size="12px" class="q-px-md" icon="las la-stopwatch" @click="delayChange" />
        <q-btn unelevated color="red-5" label="锁卡" size="12px" class="q-px-md" icon="las la-unlock" @click="lockCardPromptButton" v-if="memberInformation.mem_memberStatus == 1" />
        <q-btn unelevated color="blue-6" label="解锁" size="12px" class="q-px-md" icon="las la-pen" @click="handleCloseButton" v-if="memberInformation.mem_memberStatus == 2" />
        <q-btn unelevated color="green-6" label="保存" size="12px" class="q-px-md" icon="las la-save" @click="saveBut" />
      </div>
      <q-form ref="memberDataRef" class="q-gutter-md ">
        <q-card flat class="rounded-borders q-my-md">
          <div class="row q-mt-xs q-gutter-xs">
            <div class="col-md-3 col-12 ">
              <q-input
                v-model="memberInformation.mem_memberMoneyCount"
                dense
                disable
                standout
                :label="`总${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
                class="q-mt-md"
              >
              </q-input>
            </div>
            <div class="col-md-3 col-12">
              <q-input
                v-model="memberInformation.mem_memberPointsCount"
                disable
                standout
                dense
                :label="`总${$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                class="q-mt-md"
              >
              </q-input>
            </div>
            <div class="col-md-3 col-12 ">
              <q-input standout disable v-model="memberInformation.mem_memberNumberCount" dense label="总次数" class="q-mt-md"> </q-input>
            </div>
            <div class="col-md-3 col-12">
              <q-input v-model="memberInformation.mem_memberName" dense outlined bottom-slots label="昵称 *" class="q-mt-md" :rules="[(val) => !!val || '昵称是必填项']"> </q-input>
            </div>
            <div class="col-md-3 col-12">
              <q-input v-model="memberInformation.mem_memberRealName" outlined label="真实姓名" bottom-slots dense class="q-mt-md"> </q-input>
            </div>
            <div class="col-md-3 col-12">
              <q-input outlined bottom-slots v-model="memberInformation.mem_memberMobile" dense class="q-mt-md" lazy-rules label="手机号 *" :rules="[(val) => !!val || '手机号是必填的']"> </q-input>
            </div>
          </div>
          <!-- :rules="[(val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '手机号不正确']" -->
          <div class="row q-mt-sm">
            <div class="col-md-8 col-12">
              <div class="row q-gutter-md">
                <div class="col">
                  <q-input standout disable v-model="memberInformation.mem_memberCardNum" dense label="卡号"> </q-input>
                </div>
                <div class="col">
                  <q-input standout disable v-model="memberInformation.mcl_level_name" dense label="级别 *"> </q-input>
                </div>
              </div>
              <div class="row q-gutter-md q-mt-sm">
                <div class="col">
                  <q-input outlined bottom-slots v-model="memberInformation.mem_memberIdentityNum" dense label="身份证号" lazy-rules :error="cardIdVerify" :error-message="'身份证号格式不正确'">
                  </q-input>
                </div>
                <div class="col">
                  <q-select
                    outlined
                    dense
                    v-model="memberInformation.mem_memberSex"
                    :options="sexOptions"
                    label="性别"
                    emit-value
                    map-options
                    option-value="value"
                    option-disable="inactive"
                    option-label="label"
                    :error="false"
                  />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 col-md-3 q-pr-sm">
                  <q-select
                    outlined
                    emit-value
                    map-options
                    option-value="value"
                    option-disable="inactive"
                    option-label="label"
                    v-model="memberInformation.mem_memberBirthdayType"
                    :options="roleOptions"
                    dense
                    label="生日类型"
                    :error="false"
                  />
                </div>
                <div class="col-6 col-md-3 q-pr-xs  ">
                  <q-input outlined v-model="birthday" label="出生日期" dense :error="false" readonly>
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-date v-model="birthday" mask="YYYY-MM-DD " today-btn>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-md-3 col-12 ">
                  <q-input outlined bottom-slots v-model="mem_specifiedEndTime" disable dense label="到期时间"> </q-input>
                </div>
              </div>
            </div>
            <div class="col-md-1 col-6 q-pl-sm">
              <hl-upload
                :multiple="false"
                :currentAttach="memberInformation.coverImage"
                @input="(val)=>{ $nextTick(()=>{ memberInformation.mem_memberPicture = val })}"
                currentDescription="建议尺寸比例1:1"
                currentTitle="会员头像"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-8 q-mb-md">
              <hl-address
                :province="memberInformation.province"
                :city="memberInformation.city"
                :area="memberInformation.district"
                @province="provinceupdate"
                @city="cityupdate"
                @area="areaupdate"
              ></hl-address>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-8">
              <q-input outlined bottom-slots v-model="memberInformation.mem_memberDetailAddress" dense label="详细地址"> </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-8">
              <q-input outlined bottom-slots v-model="memberInformation.mem_memberNote" dense type="textarea">
                <template v-slot:prepend>
                  <span class="text-subtitle1">备注</span>
                </template>
              </q-input>
            </div>
          </div>
          <select-membertag @getMembertag="getMembertag" :memberId="memberInformation.id" class="q-my-md"> </select-membertag>
        </q-card>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import ChangeCard from './ChangeCard.vue'
import Upgrade from './Upgrade.vue'
import Extension from './Extension.vue'
import BindCard from './BindCard.vue'
import ChangeBind from './ChangeBind.vue'
import SelectMembertag from 'pages/member/tag/components/SelectMembertag.vue'

export default {
  name: 'IndexBasicSettings',
  components: {
    ChangeCard,
    Upgrade,
    Extension,
    BindCard,
    ChangeBind,
    SelectMembertag
  },
  data () {
    return {
      memberInformation: {},
      uploadImgStatus: false,
      multiple: false,
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
      imageData: false,
      numberChangeStatus: false,
      levelChangeStatus: false,
      delayChangeStatus: false,
      bindCardStatus: false,
      changeBindStatus: false
    }
  },
  watch: {
    memberInformation (val) {
      this.memberInformation = val
    }
  },
  mounted () {},
  created () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    },
    mem_specifiedEndTime () {
      return this.memberInformation.mem_specifiedEndTime >= 2147457847 ? '永久有效' : this.$q_date.formatDate(this.memberInformation.mem_specifiedEndTime * 1000, 'YYYY-MM-DD')
    },
    cardIdVerify () {
      if (this.memberInformation.mem_memberIdentityNum && !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.memberInformation.mem_memberIdentityNum)) {
        return true
      }
      return false
    }
  },
  methods: {
    initData (val) {
      this.memberInformation = val
      this.birthday = this.memberInformation.birthday
      this.memberInformation.mcl_level_name = val.memberLevel ? val.memberLevel.mcl_level_name : ''
    },
    saveBut () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const timestr = this.birthday
          if (timestr) {
            const arr = timestr.split('-')
            this.memberInformation.mem_memberBirthdayYear = arr[0]
            this.memberInformation.mem_memberBirthdayMonth = arr[1]
            this.memberInformation.mem_memberBirthdayDay = arr[2]
          }
          const obj = {
            ...this.memberInformation,
            memberTagData: this.memberTagData
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '会员信息更新成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
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
    changeNumber () {
      this.numberChangeStatus = true
      this.$nextTick(() => {
        this.$refs.changeCardRef.init(this.memberInformation.id)
      })
    },
    bindPhysicalCard () {
      this.bindCardStatus = true
      this.$nextTick(() => {
        this.$refs.refreshBindRef.init(this.memberInformation.id)
      })
    },
    LevelChange () {
      this.levelChangeStatus = true
      this.$nextTick(() => {
        this.$refs.upgradeRef.init(this.memberInformation.id)
      })
    },
    changeBind () {
      this.changeBindStatus = true
      this.$nextTick(() => {
        this.$refs.changeRef.init(this.memberInformation.id)
      })
    },
    delayChange () {
      this.delayChangeStatus = true
      this.$nextTick(() => {
        this.$refs.extensionRef.init(this.memberInformation.id)
      })
    },

    lockCardPromptButton () {
      this.memberInformation.mem_memberStatus = 2
      const obj = {
        id: this.memberInformation.id,
        mem_memberStatus: 2
      }
      this.$store
        .dispatch('member/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '会员锁卡成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
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
    },
    handleCloseButton () {
      this.memberInformation.mem_memberStatus = 1
      const obj = {
        id: this.memberInformation.id,
        mem_memberStatus: 1
      }
      this.$store
        .dispatch('member/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '会员解锁成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
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
    },
    // 换卡后刷新页面
    refreshMembership (val) {
      if (val) {
        this.numberChangeStatus = false
        this.memberInformation.mem_memberCardNum = val
        this.$emit('returnMethod', val)
      }
    },
    // 写入实体卡并换卡
    refreshBindMemberCard (val) {
      if (val) {
        this.bindCardStatus = false
        this.memberInformation.mem_memberCardNum = val
        this.$emit('returnMethod', val)
      }
    },
    provinceupdate (a) {
      this.memberInformation.province = a.value
    },
    cityupdate (a) {
      this.memberInformation.city = a.value
    },
    areaupdate (a) {
      this.memberInformation.district = a.value
    },
    extension (val) {
      if (val) {
        this.delayChangeStatus = false
        this.memberInformation.mem_specifiedEndTime = val
      }
    },
    levelName (val) {
      if (val) {
        this.levelChangeStatus = false
        this.memberInformation.mcl_level_name = val
      }
    },

    getMembertag (val) {
      this.memberTagData = val
    }
  }
}
</script>
