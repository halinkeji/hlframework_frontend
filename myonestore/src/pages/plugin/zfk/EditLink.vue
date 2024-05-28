<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.35 + 'px',
        'min-width':$q.screen.width * 0.35 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="linkDataRef">
        <q-card-section class="row items-center q-pa-none q-mb-lg">
          <div class="text-h6 q-pr-lg">修改副卡</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card flat bordered v-if="memberLinkData.member || memberLinkData.sonMember">
          <q-card-section horizontal>
            <q-card-section class="col-6 row">
              <q-item-section avatar>
                <q-avatar v-if="memberLinkData.member && memberLinkData.member.coverImage && memberLinkData.member.coverImage.id" text-color="white">
                  <img :src="$q.localStorage.getItem('myonestore_system_local').attach_url + memberLinkData.member.coverImage.path" />
                </q-avatar>
                <q-avatar v-else><q-icon color="grey" name="las la-user-circle" size="xl"></q-icon></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ memberLinkData.member.mem_memberName }}
                  <span class="q-mr-sm" v-if="memberLinkData.member.mem_memberRealName">({{ memberLinkData.member.mem_memberRealName }})</span>
                </q-item-label>
                <q-item-label caption>{{ memberLinkData.member.mem_memberCardNum }}</q-item-label>
                <q-item-label caption>
                  <span v-if="parseInt(memberLinkData.member.mem_specifiedEndTime) < 2147457847">
                    {{ $q_date.formatDate(memberLinkData.member.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
                  </span>
                  <span v-else>
                    永久有效
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>
                  <q-chip square color="blue-1" text-color="blue-8">主卡</q-chip>
                </q-item-label>
              </q-item-section>
            </q-card-section>
            <q-separator vertical />
            <q-card-section class="col-6 row">
              <q-item-section avatar>
                <q-avatar v-if="memberLinkData.sonMember && memberLinkData.sonMember.coverImage && memberLinkData.sonMember.coverImage.id" text-color="white">
                  <img :src="$q.localStorage.getItem('myonestore_system_local').attach_url + memberLinkData.sonMember.coverImage.path" />
                </q-avatar>
                <q-avatar v-else><q-icon color="grey" name="las la-user-circle" size="xl"></q-icon></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ memberLinkData.sonMember.mem_memberName }}
                  <span class="q-mr-sm" v-if="memberLinkData.sonMember.mem_memberRealName">({{ memberLinkData.sonMember.mem_memberRealName }})</span>
                </q-item-label>
                <q-item-label caption>{{ memberLinkData.sonMember.mem_memberCardNum }}</q-item-label>
                <q-item-label caption>
                  <span v-if="parseInt(memberLinkData.sonMember.mem_specifiedEndTime) < 2147457847">
                    {{ $q_date.formatDate(memberLinkData.sonMember.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
                  </span>
                  <span v-else>
                    永久有效
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>
                  <q-chip square color="blue-1" text-color="blue-8">副卡</q-chip>
                </q-item-label>
              </q-item-section>
            </q-card-section>
          </q-card-section>
        </q-card>
        <div class="q-mt-sm">
          <q-select
            outlined
            dense
            v-model="memberLinkData.zml_is_share_balance"
            option-label="label"
            :options="shareOptions"
            :label="`是否共享${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
            emit-value
            map-options
          />
        </div>
        <div class="q-mt-lg" v-if="parseInt(memberLinkData.zml_is_share_balance) == 2">
          <q-input
            outlined
            dense
            v-model="memberLinkData.zml_balance_amount"
            :label="`共享${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
            :rules="[
              (val) => !!val || '必填项',
              (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || '请输入正确的' + $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
            ]"
          />
        </div>
        <div class="q-mt-xs" v-if="parseInt(memberLinkData.zml_is_share_balance) == 2">
          <q-select
            outlined
            dense
            v-model="memberLinkData.zml_limit_balance_time"
            option-label="label"
            :options="timeOptions"
            :label="`${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit}日期限制`"
            emit-value
            map-options
          />
        </div>
        <div class="q-mt-lg">
          <q-select
            outlined
            dense
            v-model="memberLinkData.zml_is_share_integral"
            option-label="label"
            :options="shareOptions"
            :label="`是否共享${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`"
            emit-value
            map-options
          />
        </div>
        <div class="q-mt-lg" v-if="parseInt(memberLinkData.zml_is_share_integral) == 2">
          <q-input
            outlined
            dense
            v-model="memberLinkData.zml_integral_amount"
            :label="`共享${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`"
            :rules="[
              (val) => !!val || '必填项',
              (val) => /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) || `请输入正确的${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`,
            ]"
          />
        </div>
        <div class="q-mt-xs" v-if="parseInt(memberLinkData.zml_is_share_integral) == 2">
          <q-select
            outlined
            dense
            v-model="memberLinkData.zml_limit_integral_time"
            option-label="label"
            :options="timeOptions"
            :label="`${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}日期限制`"
            emit-value
            map-options
          />
        </div>
        <div class="q-mt-md q-mr-sm justify-center q-gutter-sm row">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" v-if="authorityMeta('saveLink')" class="q-px-xl" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ZfkEditLink',
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      memberLinkData: {},
      shareOptions: [
        { label: '不共享', value: -1 },
        { label: '共享（不限制）', value: 1 },
        { label: '共享（限制）', value: 2 }
      ],
      timeOptions: [
        { label: '年', value: 1 },
        { label: '季度', value: 2 },
        { label: '月', value: 3 },
        { label: '周', value: 4 },
        { label: '天', value: 5 }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('zfk/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.memberLinkData = res.data ? res.data : {}
              this.memberLinkData.zml_is_share_balance = res.data ? parseInt(res.data.zml_is_share_balance) : ''
              this.memberLinkData.zml_limit_balance_time = res.data ? parseInt(res.data.zml_limit_balance_time) : ''
              this.memberLinkData.zml_is_share_integral = res.data ? parseInt(res.data.zml_is_share_integral) : ''
              this.memberLinkData.zml_limit_integral_time = res.data ? parseInt(res.data.zml_limit_integral_time) : ''
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
    },
    setData () {
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
                  caption: '修改副卡',
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
      this.addButtonDisabled = false
      this.$emit('dataList')
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
