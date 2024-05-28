<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.5 + 'px',
        'min-width': $q.screen.width * 0.5 + 'px',
      }"
      class="q-pa-md"
    >
      <q-card-section class="row items-center q-pa-none q-mb-lg">
        <div class="text-h6">新增主副卡关联</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-form ref="linkDataRef">
        <div class="row q-mt-md">
          <div class="col-6 q-pr-sm">
            <q-input outlined bottom-slots v-model="memberInfo" dense class="q-pb-none" label="请输入主会员卡号|手机号" clearable>
              <template v-slot:after>
                <q-btn unelevated color="primary" @click="getMemberData" label="查询" class="q-px-md full-height" />
              </template>
            </q-input>
          </div>
          <div class="col-6 q-pl-sm">
            <q-input outlined bottom-slots v-model="sonMemberInfo" dense class="q-pb-none" label="请输入副会员卡号|手机号" clearable>
              <template v-slot:after>
                <q-btn unelevated color="primary" @click="getMemberData('son')" label="查询" class="q-px-md full-height" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-mt-sm" v-if="parseInt(memberData.id) > 0 || parseInt(sonMemberData.id) > 0">
          <div class="col-6 q-pr-sm">
            <q-card class="q-pa-sm" flat bordered v-if="parseInt(memberData.id) > 0">
              <div class="text-subtitle1 ">主卡信息</div>
              <q-card flat class="rounded-borders" v-if="memberData">
                <q-item>
                  <q-item-section avatar>

                      <q-avatar v-if="memberData.coverImage && memberData.coverImage.id" text-color="white">
                        <img :src="$q.localStorage.getItem('cychainstore_system_local').attach_url + memberData.coverImage.path" />
                      </q-avatar>
                <q-avatar v-else><q-icon color="grey" name="las la-user-circle" size="xl"></q-icon></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ memberData.mem_memberName }}
                      <span class="q-mr-sm" v-if="memberData.mem_memberRealName">({{ memberData.mem_memberRealName }})</span>
                    </q-item-label>
                    <q-item-label caption>{{ memberData.mem_memberCardNum }}</q-item-label>
                    <q-item-label caption>
                      <span v-if="parseInt(memberData.mem_specifiedEndTime) < 2147457847">
                        {{ $q_date.formatDate(memberData.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
                      </span>
                      <span v-else>
                        永久有效
                      </span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>
                      <q-chip square color="blue-1" text-color="blue-8">
                        {{ memberData.memberLevel ? memberData.memberLevel.mcl_level_name : '无等级' }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </q-card>
          </div>
          <div class="col-6 q-pl-sm" v-if="parseInt(sonMemberData.id) > 0">
            <q-card class="q-pa-sm" flat bordered>
              <div class="text-subtitle1 ">副卡信息</div>
              <q-card flat class="rounded-borders">
                <q-item>
                  <q-item-section avatar>
                      <q-avatar v-if="sonMemberData.coverImage && sonMemberData.coverImage.id" text-color="white">
                        <img :src="$q.localStorage.getItem('cychainstore_system_local').attach_url + sonMemberData.coverImage.path" />
                      </q-avatar>
                <q-avatar v-else><q-icon color="grey" name="las la-user-circle" size="xl"></q-icon></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ sonMemberData.mem_memberName }}
                      <span class="q-mr-sm" v-if="sonMemberData.mem_memberRealName">({{ sonMemberData.mem_memberRealName }})</span>
                    </q-item-label>
                    <q-item-label caption>{{ sonMemberData.mem_memberCardNum }}</q-item-label>
                    <q-item-label caption>
                      <span v-if="parseInt(sonMemberData.mem_specifiedEndTime) < 2147457847">
                        {{ $q_date.formatDate(sonMemberData.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
                      </span>
                      <span v-else>
                        永久有效
                      </span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>
                      <q-chip square color="blue-1" text-color="blue-8">
                        {{ sonMemberData.memberLevel ? sonMemberData.memberLevel.mcl_level_name : '无等级' }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-6 q-pr-sm">
            <q-select
              outlined
              dense
              v-model="memberLinkData.zml_is_share_balance"
              option-label="label"
              :options="shareOptions"
              :label="`是否共享${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
              emit-value
              map-options
            />

          </div>
          <div class="col-6 q-pl-sm">
            <q-select
              outlined
              dense
              v-model="memberLinkData.zml_is_share_integral"
              option-label="label"
              :options="shareOptions"
              :label="`是否共享${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="row q-mt-lg" v-if="parseInt(memberLinkData.zml_is_share_balance) == 2">
          <div class="col-6 q-pr-sm">
            <q-input
              outlined
              dense
              v-model="memberLinkData.zml_balance_amount"
              :label="`共享${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
              :rules="[
                (val) => !!val || '必填项',
                (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的' + $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
              ]"
            />
          </div>
          <div class="col-6 q-pl-sm">
            <q-select
              outlined
              dense
              v-model="memberLinkData.zml_limit_balance_time"
              option-label="label"
              :options="timeOptions"
              :label="`${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit}日期限制`"
              emit-value
              map-options
            />
          </div>
        </div>
        <div
          class="row "
          v-if="parseInt(memberLinkData.zml_is_share_integral) == 2"
          :class="{
            'q-mt-xs': parseInt(memberLinkData.zml_is_share_balance) == 2,
            'q-mt-lg': parseInt(memberLinkData.zml_is_share_balance) < 2,
          }"
        >
          <div class="col-6 q-pr-sm">
            <q-input
              outlined
              dense
              v-model="memberLinkData.zml_integral_amount"
              :label="`共享${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
              :rules="[
                (val) => !!val || '必填项',
                (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit,
              ]"
            />
          </div>
          <div class="col-6 q-pl-sm">
            <q-select
              outlined
              dense
              v-model="memberLinkData.zml_limit_integral_time"
              option-label="label"
              :options="timeOptions"
              :label="`${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}日期限制`"
              emit-value
              map-options
            />
          </div>
        </div>

      </q-form>
      <div class="text-center q-gutter-sm">
        <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ZfkAddMemberLink',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      memberInfo: '',
      sonMemberInfo: '',
      memberLinkData: {
        zml_member_id: '',
        zml_son_member_id: '',
        zml_status: 2,
        zml_is_share_balance: '1',
        zml_limit_balance_time: '1',
        zml_balance_amount: '',
        zml_is_share_integral: '1',
        zml_limit_integral_time: '1',
        zml_integral_amount: '',
        zml_is_share_count: '1',
        zml_is_share_timing: '1',
        zml_is_share_coupon: '1'
      },
      memberData: {},
      sonMemberData: {},
      shareOptions: [
        { label: '不共享', value: '-1' },
        { label: '共享（不限制）', value: '1' },
        { label: '共享（限制）', value: '2' }
      ],
      timeOptions: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '天', value: '5' }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    getMemberData (type) {
      if (parseInt(this.memberInfo) > 0 || parseInt(this.sonMemberInfo) > 0) {
        const params = {
          memberInfo: type == 'son' ? this.sonMemberInfo : this.memberInfo
        }
        this.$store
          .dispatch('zfk/getMemberData', params)
          .then((res) => {
            if (res.code == 200) {
              if (type == 'son') {
                this.sonMemberData = res.data ? res.data : {}
                this.memberLinkData.zml_son_member_id = res.data.id ? res.data.id : ''
              } else {
                this.memberData = res.data ? res.data : {}
                this.memberLinkData.zml_member_id = res.data.id ? res.data.id : ''
              }
              this.$q.notify({
                message: '成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
      if (!this.memberLinkData.zml_member_id) {
        this.$q.notify({
          message: '失败',
          caption: '请绑定主卡',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      if (!this.memberLinkData.zml_son_member_id) {
        this.$q.notify({
          message: '失败',
          caption: '请绑定副卡',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      if (this.memberLinkData.zml_member_id == this.memberLinkData.zml_son_member_id) {
        this.$q.notify({
          message: '失败',
          caption: '主卡与副卡相同',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.$refs.linkDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const data = {
            ...this.memberLinkData
          }
          this.$store
            .dispatch('zfk/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '新增主副卡关联成功',
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
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    authorityMeta (key) {
      // return true
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
