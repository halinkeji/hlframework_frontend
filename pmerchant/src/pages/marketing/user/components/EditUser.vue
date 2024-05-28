<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="col-shrink q-pa-xs row q-px-sm items-center">
        <div class="text-subtitle2">{{ dataId ? '修改' : '新增' }}类型</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>
      <q-separator />
      <q-card-section class="col-shrink q-pa-sm">
        <q-form ref="newsDataRef" class="row q-col-gutter-sm">
          <div class="col-12">
            <q-select
              outlined
              option-value="id"
              option-label="pmt_title"
              emit-value
              map-options
              bottom-slots
              :options="marketingTypeDataList"
              v-model="marketingUserForm.pmu_marketing_type_id"
              dense
              @input="changeMarketingType"
              label="选择类型"
            />
          </div>
          <div class="col-12">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              bottom-slots
              :options="[
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' },
              ]"
              v-model="marketingUserForm.pmu_status"
              dense
              label="状态"
            />
          </div>
          <div class="col-12">
            <q-input dense readonly outlined v-model="marketingUserForm.pmu_pmerchant_card_number" label="会员卡号">
              <template v-slot:after>
                <q-btn color="red" label="解除会员绑定" v-if="marketingUserForm.m_pmerchant_id" unelevated @click="clearMemberBind" />
                <q-btn color="primary" label="绑定会员" v-else unelevated @click="addMember" />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section class="col-shrink row q-gutter-sm text-center justify-center q-pb-md">
        <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
        <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
      </q-card-section>
      <hl-choose-manager ref="chooseManagerList" @getChooseManageData="receivingAdministrator" v-if="chooseMemberDialog" @closeChooseManage="chooseMemberDialog = false"></hl-choose-manager>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EditType',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      marketingUserForm: {
        m_pmerchant_id: '',
        pmu_pmerchant_card_number: '',
        pmu_type: '',
        pmu_marketing_type_id: '',
        pmu_status: ''
      },
      marketingTypeDataList: [],
      chooseMemberDialog: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.addStoreSidebar = true
      this.getTypeListData()
      if (id > 0) {
        this.getItem()
      }
    },
    addMember () {
      this.chooseMemberDialog = true
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      this.chooseMemberDialog = false
      if (val && val.length > 0) {
        const memberInfo = val[0]
        this.marketingUserForm.m_pmerchant_id = memberInfo.m_pmerchant_id
        this.marketingUserForm.pmu_pmerchant_card_number = memberInfo.card_number
      }
    },
    clearMemberBind () {
      this.marketingUserForm.m_pmerchant_id = ''
      this.marketingUserForm.pmu_pmerchant_card_number = ''
    },
    changeMarketingType () {
      const that = this
      const index = _.findIndex(that.marketingTypeDataList, function (o) {
        return parseInt(o.id) == parseInt(that.marketingUserForm.pmu_marketing_type_id)
      })
      if (index > -1) {
        const marketingTypeItem = that.marketingTypeDataList[index]
        that.marketingUserForm.pmu_type = marketingTypeItem.pmt_type
      }
    },
    getTypeListData () {
      this.$store.dispatch('marketingManage/getTypeAllData').then((res) => {
        if (res.code == 200) {
          this.marketingTypeDataList = res.data ? res.data : []
        }
      })
    },

    getItem () {
      this.$store
        .dispatch('marketingManage/getUserData', {
          id: this.dataId
        })
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.marketingUserForm = res.data
          }
        })
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.marketingUserForm,
            id: this.dataId
          }
          this.$store
            .dispatch('marketingManage/setUserData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              } else {
                this.$q.notify({
                  message: '错误',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: 'Error',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.addStoreSidebar = false
      this.$emit('getMethods')
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
