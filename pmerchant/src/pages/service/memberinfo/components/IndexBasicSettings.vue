<template>
  <div class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white row q-pa-md q-pb-md row q-gutter-md">
        <q-btn unelevated color="green-6" label="保存" size="12px" class="q-px-md" icon="las la-save" @click="saveBut" />

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
      </div>
      <div class="col-shrink q-pa-md full-height">
        <q-scroll-area class="fit full-height">
          <q-form ref="memberDataRef" class="q-gutter-md">
            <div class="row justify-start">
              <div class="col-7">
                <q-input
                  label="卡号"
                  disable
                  outlined
                  v-model="memberInformation.card_number"
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '卡号是必填的']"
                >
                  <!-- <template v-slot:after>
                    <q-btn
                      color="warning"
                      v-if="!(storeMemberConfig && parseInt(storeMemberConfig.member_level_defaultMobile) == 1)"
                      class="full-width"
                      unelevated
                      label="一键生成卡号"
                      @click="generateNewCardNumber"
                    />
                  </template> -->
                </q-input>
              </div>

              <div class="col-7">
                <q-input
                  label="昵称"
                  outlined
                  v-model="memberInformation.nick_name"
                  class="q-mt-xs"
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '昵称是必填的']"
                />
              </div>
              <!-- <div class="col-7">
                <q-select
                  class="q-mt-xs"
                  outlined
                  emit-value
                  map-options
                  :disable="parseInt(memberInformation.id) > 0"
                  option-label="mcl_level_name"
                  option-value="id"
                  v-model="memberInformation.level_id"
                  :options="memberCardLevelDatas"
                  dense
                  label="会员等级"
                  :rules="[(val) => !!val || '必须选择会员级别']"
                />
              </div> -->
              <div class="col-7">
                <select-membertag @getMembertag="getMembertag" :memberId="memberInformation.id" class="q-my-md"> </select-membertag>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
    </div>
    <change-card ref="changeCardRef" @returnMethod="refreshMembership" v-if="numberChangeStatus"></change-card>
    <bind-card ref="refreshBindRef" @returnMethod="refreshBindMemberCard" v-if="bindCardStatus"></bind-card>
    <upgrade ref="upgradeRef" @returnMethod="levelName" v-if="levelChangeStatus"></upgrade>
    <extension ref="extensionRef" @returnMethod="extension" @click="delayChangeStatus"></extension>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
import ChangeCard from './ChangeCard.vue'
import Upgrade from './Upgrade.vue'
import Extension from './Extension.vue'
import BindCard from './BindCard.vue'
import SelectMembertag from 'pages/member/tag/components/SelectMembertag.vue'
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
      changeBindStatus: false,
      storeMemberConfig: {}
    }
  },
  watch: {
    memberInformation (val) {
      this.memberInformation = val
    }
  },
  mounted () {},
  created () {
    if (LocalStorage.getItem('pmerchant_store_local').storeMemberConfig) {
      this.storeMemberConfig = LocalStorage.getItem('pmerchant_store_local').storeMemberConfig
    }
  },
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
        this.memberInformation.mcl_level_name = val
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
