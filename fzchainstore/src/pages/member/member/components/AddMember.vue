<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-mb-xs q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        {{ operatingText }}会员
      </div>
      <div class="col-shrink full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-card flat class="q-pa-sm">
            <q-form ref="memberDataRef" class="q-gutter-md q-mt-md">
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input
                    label="卡号"
                    outlined
                    v-model="memberItem.mem_memberCardNum"
                    dense
                    lazy-rules
                    :rules="[(val) => !!val || '卡号是必填的', (val) => /^\d+$/.test(val) || '卡号为非负整数']"
                  >
                    <template v-slot:after>
                      <q-btn color="warning" class="full-width" unelevated label="一键生成卡号" @click="generateNewCardNumber" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6  q-pr-lg ">
                  <!-- (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || val.length == 0 || '电话号不正确', -->

                  <q-input
                    label="手机号"
                    outlined
                    v-model="memberItem.mem_memberMobile"
                    dense
                    lazy-rules
                    :rules="[(val) => !!val || '手机号是必填的']"
                  />
                </div>
              </div>
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input
                    label="昵称"
                    outlined
                    v-model="memberItem.mem_memberName"
                    class="q-mt-xs"
                    dense
                    lazy-rules
                    :rules="[(val) => !!val || '昵称是必填的']"
                  />
                </div>
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-select
                    class=" q-mt-xs"
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
              </div>
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input label="真实姓名" outlined class="q-mt-xs" v-model="memberItem.mem_memberRealName" dense lazy-rules :error="false" />
                </div>
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input class=" q-mt-xs" outlined v-model="memberItem.mem_memberWechat" dense label="微信号" lazy-rules :error="false" />
                </div>
              </div>
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input
                    label="身份证"
                    class="q-mt-xs"
                    outlined
                    v-model="memberItem.mem_memberIdentityNum"
                    dense
                    lazy-rules
                    :error="cardIdVerify"
                    :error-message="'身份证号格式不正确'"
                  />
                </div>
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-select
                    class=" q-mt-xs"
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
              </div>
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-select
                    class=" q-mt-xs"
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
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input readonly outlined v-model="birthday" label="出生日期" dense square lazy-rules :error="false" class="q-mt-xs">
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
              </div>
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <hl-address
                    :province="memberItem.province"
                    :city="memberItem.city"
                    :area="memberItem.district"
                    @province="provinceupdate"
                    @city="cityupdate"
                    @area="areaupdate"
                  ></hl-address>
                </div>
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input class=" q-mt-xs" outlined v-model="memberItem.mem_memberDetailAddress" dense label="详细地址" lazy-rules :error="false" />
                </div>
              </div>
              <div class="row q-pl-xs ">
                <div class="col-12 col-md-6  q-pr-lg ">
                  <q-input class=" q-mt-xs" outlined v-model="memberItem.mem_memberNote" dense type="textarea" label="会员备注" />
                </div>
                <div class=" col-12 col-md-2 q-mt-xs  q-pl-xs " align="left ">
                  <hl-upload
                      :multiple="false"
                      :currentAttach="memberItem.coverImage"
                      @input="
                        (val) => {
                          $nextTick(() => {
                            memberItem.mem_memberPicture = val;
                          });
                        }
                      "
                      currentDescription="建议尺寸比例1:1"
                      currentTitle="会员头像"
                    />
                </div>
              </div>
              <select-membertag @getMembertag="getMembertag" :memberId="memberItem.id" class="q-my-md"> </select-membertag>
            </q-form>
          </q-card>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs  q-pb-sm text-center q-gutter-sm">
        <q-btn label="提交" unelevated @click="addMemberData" color="primary" class="q-px-xl" />
        <q-btn label="返回" unelevated :to="{ name: 'member' }" color="grey" class="q-px-xl " />
      </div>
    </div>
  </q-page>
</template>
<script>
import SelectMembertag from 'pages/member/tag/components/SelectMembertag.vue'
export default {
  name: 'AddMember',
  components: { SelectMembertag },
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
        mem_memberPicture: ''
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
      uploadImgStatus: false,
      memberTagData: []
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
  },
  methods: {
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
      const newDate = new Date()
      this.memberItem.mem_memberCardNum = newDate
        .getTime()
        .toString()
        .slice(2)
    },

    addMemberData () {
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
            const arr = timestr.split('-')
            this.memberItem.mem_memberBirthdayYear = arr[0]
            this.memberItem.mem_memberBirthdayMonth = arr[1]
            this.memberItem.mem_memberBirthdayDay = arr[2]
          }

          const obj = {
            ...this.memberItem,
            memberTagData: this.memberTagData
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
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.$router.go(-1)
                  }, 500)
                })
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
