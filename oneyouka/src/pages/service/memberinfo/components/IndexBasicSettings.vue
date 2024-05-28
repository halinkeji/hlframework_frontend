<template>
  <q-card flat>
    <q-card-section>
      <change-card ref="changeCardRef" @returnMethod="refreshMembership" v-if="numberChangeStatus"></change-card>
      <bind-card ref="refreshBindRef" @returnMethod="refreshBindMemberCard" v-if="bindCardStatus"></bind-card>
      <upgrade ref="upgradeRef" @returnMethod="levelName" v-if="levelChangeStatus"></upgrade>
      <extension ref="extensionRef" @returnMethod="extension" @click="delayChangeStatus"></extension>
      <div class="row q-gutter-md">
        <q-btn
          unelevated
          color="indigo"
          v-if="authorityMeta('rfid')"
          label="绑定实体卡"
          size="12px"
          class="q-px-md"
          icon="las la-sim-card"
          @click="bindPhysicalCard"
        />
        <q-btn
          unelevated
          color="red-5"
          v-if="authorityMeta('changeCode')"
          label="换卡"
          size="12px"
          class="q-px-md"
          icon="lar la-credit-card"
          @click="changeNumber"
        />
        <q-btn
          unelevated
          color="red-5"
          v-if="authorityMeta('upgrade')"
          label="升级"
          size="12px"
          class="q-px-md"
          icon="las la-upload"
          @click="LevelChange"
        />
        <q-btn
          unelevated
          color="amber-8"
          v-if="authorityMeta('extension')"
          label="延期"
          size="12px"
          class="q-px-md"
          icon="las la-stopwatch"
          :disable="(memberInformation.mem_specifiedEndTime >= 2147457847) ? true : false"
          @click="delayChange"
        >

          <q-tooltip>
            非付费级别会员不可延期
          </q-tooltip>
        </q-btn>
        <q-btn
          unelevated
          color="red-5"
          label="锁卡"
          size="12px"
          class="q-px-md"
          icon="las la-unlock"
          @click="lockCardPromptButton"
          v-if="memberInformation.mem_memberStatus == 1 && authorityMeta('locking')"
        />
        <q-btn
          unelevated
          color="blue-6"
          label="解锁"
          size="12px"
          class="q-px-md"
          icon="las la-pen"
          @click="handleCloseButton"
          v-if="memberInformation.mem_memberStatus == 2 && authorityMeta('locking')"
        />
        <q-btn unelevated color="green-6" v-if="authorityMeta('save')" label="保存" size="12px" class="q-px-md" icon="las la-save" @click="saveBut" />

        <q-btn
          unelevated
          color="orange"
          v-if="authorityMeta('password')"
          label="修改密码"
          size="12px"
          class="q-px-md"
          icon="las la-key"
          @click="changePassword"
        />

         <q-dialog v-model="changePasswordDialog" persistent>
          <q-card
            :style="{
              width: parseInt($q.screen.width * 0.2) + 'px',
              'max-width': parseInt($q.screen.width * 0.2) + 'px',
            }"
            flat
          >
            <q-card-section>修改密码</q-card-section>
            <q-separator />
            <q-card-section class="q-pt-none">
              <q-form
                :autofocus="true"
                @submit="
                  () => {
                    return false;
                  }
                "
                class="q-gutter-md"
                ref="memberPasswordFormRef"
              >
                <div class="row">
                  <div class="col-12 q-mt-sm" >
                    <q-input
                      ref="currentPasswordInput"
                      dense
                      @keyup.enter="confirmChangePassword"
                      outlined
                      v-model="currentPasswordValue"
                      :rules="[(val) => !!val || '请输入密码']"
                      hint="默认密码：888888。如会员未及时更新密码，请尽快更新"
                    >
                    </q-input>
                  </div>
                </div>
              </q-form>
            </q-card-section>
              <q-separator />
            <q-card-actions align="around">
              <q-btn unelevated color="primary" @click="confirmChangePassword" class="q-px-xl">确认</q-btn>
              <q-btn unelevated color="grey" @click="cancelChangePassword" class="q-px-xl">取消</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>

      </div>
      <q-form ref="memberDataRef" class="q-gutter-md">
        <q-card flat class="rounded-borders q-my-md row">
          <div class="col-6 row q-px-xs q-col-gutter-xs">
            <div class="col-12 text-center">
              <hl-avatar
                :coverImage="memberInformation.coverImage"
                @confirmCheck="
                  (val) => {
                    $nextTick(() => {
                      memberInformation.mem_memberPicture = val;
                    });
                  }
                "
              />
            </div>

            <div class="col-12 col-md-4">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label lines="1">
                    {{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-red text-weight-bold text-subtitle1">
                    {{ formatAmount(memberInformation.mem_memberMoneyCount) }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-md-4">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label lines="1">
                    {{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-red text-weight-bold text-subtitle1">
                    {{ formatAmount(memberInformation.mem_memberPointsCount) }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-md-4">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label lines="1"> 次数 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-red text-weight-bold text-subtitle1">
                    {{ formatAmount(memberInformation.mem_memberNumberCount) }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-4">
              <q-item class="bg-grey-3">
                <q-item-section>
                  <q-item-label lines="1"> 卡号 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-dark"> {{ memberInformation.mem_memberCardNum }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-md-4">
              <q-item class="bg-grey-3">
                <q-item-section>
                  <q-item-label lines="1"> 级别 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-dark"> {{ memberInformation.mcl_level_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-md-4">
              <q-item class="bg-grey-3">
                <q-item-section>
                  <q-item-label lines="1"> 到期时间 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-dark"> {{ mem_specifiedEndTime }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12">
              <select-membertag @getMembertag="getMembertag" :memberId="memberInformation.id" class="q-my-md"> </select-membertag>
            </div>
          </div>

          <div class="col-6 row q-px-xs q-col-gutter-sm">
            <div class="col-md-6 col-12">
              <q-input v-model="memberInformation.mem_memberName" dense outlined label="昵称 *" :rules="[(val) => !!val || '昵称是必填项']">
              </q-input>
            </div>
            <div class="col-md-6 col-12">
              <q-input v-model="memberInformation.mem_memberRealName" outlined label="真实姓名" dense> </q-input>
            </div>
            <div class="col-md-6 col-12">
              <q-input
                outlined
                v-model="memberInformation.mem_memberMobile"
                dense
                lazy-rules
                label="手机号 *"
                :rules="[(val) => !!val || '手机号是必填的']"
              >
              </q-input>
              <!-- :rules="[(val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '手机号不正确']" -->
            </div>

            <div class="col-md-6 col-12">
              <q-input
                outlined
                v-model="memberInformation.mem_memberIdentityNum"
                dense
                label="身份证号"
                lazy-rules
                :error="cardIdVerify"
                :error-message="'身份证号格式不正确'"
              >
              </q-input>
            </div>

            <div class="col-md-6 col-12">
              <q-input outlined v-model="memberInformation.mem_license_plate" dense label="车牌号" lazy-rules> </q-input>
            </div>
            <div class="col-md-6 col-12">
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

            <div class="col-md-6 col-12">
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
            <div class="col-md-6 col-12">
              <q-input outlined v-model="birthday" label="出生日期" dense :error="false" readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                      <q-date v-model="birthday" :options="optionsLimit" mask="YYYY-MM-DD " today-btn>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-menu>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <hl-address
                :province="memberInformation.province"
                :city="memberInformation.city"
                :area="memberInformation.district"
                @province="provinceupdate"
                @city="cityupdate"
                @area="areaupdate"
              ></hl-address>
            </div>
            <div class="col-12">
              <q-input outlined v-model="memberInformation.mem_memberDetailAddress" dense label="详细地址"> </q-input>
            </div>

            <div class="col-12">
              <q-input outlined v-model="memberInformation.mem_memberNote" dense type="textarea">
                <template v-slot:prepend>
                  <span class="text-subtitle1">备注</span>
                </template>
              </q-input>
            </div>
          </div>
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
import SelectMembertag from 'pages/member/tag/components/SelectMembertag.vue'
import md5 from 'md5'
export default {
  name: 'IndexBasicSettings',
  components: {
    ChangeCard,
    Upgrade,
    Extension,
    BindCard,
    SelectMembertag
  },
  data () {
    return {
      memberInformation: {},
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
      changeBindStatus: false,
      changePasswordDialog: false,
      currentPasswordValue: ''
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
    mem_specifiedEndTime () {
      return this.memberInformation.mem_specifiedEndTime >= 2147457847
        ? '永久有效'
        : this.$q_date.formatDate(this.memberInformation.mem_specifiedEndTime * 1000, 'YYYY-MM-DD')
    },
    cardIdVerify () {
      if (
        this.memberInformation.mem_memberIdentityNum &&
        !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.memberInformation.mem_memberIdentityNum)
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    changePassword () {
      this.changePasswordDialog = true
      const currentPasswordInput = this.$refs.currentPasswordInput
      setTimeout(() => {
        if (currentPasswordInput) {
          currentPasswordInput.focus()
        }
      }, 500)
    },
    cancelChangePassword () {
      this.changePasswordDialog = false
      this.currentPasswordValue = ''
    },
    confirmChangePassword () {
      this.$refs.memberPasswordFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            mem_memberPassword: md5(this.currentPasswordValue),
            id: this.memberInformation.id
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改密码成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.cancelChangePassword()
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
    optionsLimit (date) {
      return date <= this.$q_date.formatDate(new Date(), 'YYYY/MM/DD')
    },
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
        this.$refs.changeCardRef.init(this.memberInformation)
      })
    },
    bindPhysicalCard () {
      this.bindCardStatus = true
      this.$nextTick(() => {
        this.$refs.refreshBindRef.init(this.memberInformation)
      })
    },
    LevelChange () {
      this.levelChangeStatus = true
      this.$nextTick(() => {
        this.$refs.upgradeRef.init(this.memberInformation)
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
        this.memberInformation.mcl_level_name = val.levelName
        this.memberInformation.membercardlevel_id = val.newLevelId
      }
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    getMembertag (val) {
      this.memberTagData = val
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
