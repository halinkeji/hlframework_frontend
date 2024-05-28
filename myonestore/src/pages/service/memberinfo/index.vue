<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <hl-card-reading scenes="info" ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
        <q-tabs
          v-model="activeTab"
          indicator-color="primary"
          align="left"
          class="bg-white q-mt-sm"
          active-color="primary"
          content-class="text-grey-9"
          narrow-indicator
          dense
          v-if="parseInt(memberId) > 0"
          @input="changeTab"
        >
          <q-tab name="1" label="基本信息" />
          <q-tab name="2" label="消费记录" />
          <q-tab name="count" label="会员次卡" />
          <q-tab name="timing" label="会员时卡" />
          <q-tab name="growRecord" label="成长值变更记录" />
          <q-tab name="upgradeList" label="会员升级记录" />
          <q-tab name="hlcoupon" label="卡券记录" v-if="openPlugins && openPlugins.indexOf('Hlcoupon') > -1" />
          <q-tab name="track" label="售后日志" v-if="openPlugins && openPlugins.indexOf('Track') > -1" />
          <q-tab name="jfmall" label="积分商城订单" v-if="openPlugins && openPlugins.indexOf('Jfmall') > -1" />
        </q-tabs>
      </div>
      <div class="col-shrink bg-white full-height q-mt-xs" v-if="parseInt(memberId) > 0 && activeTab == 1">
        <q-scroll-area class="fit full-height">
          <basic-settings @returnMethod="refreshMembership" ref="memberDataref" />
        </q-scroll-area>
      </div>

      <div class="col-shrink bg-white q-pa-sm full-height q-mt-xs" v-show="activeTab == 2">
        <document-management :memberId="memberId" ref="documentManagementRef"></document-management>
      </div>
      <div class="col-shrink bg-white full-height q-mt-xs" v-if="activeTab == 'track'">
        <track-record-list :currentMemberId="memberId"></track-record-list>
      </div>
      <div class="col-shrink bg-white full-height q-mt-xs" v-if="activeTab == 'jfmall'">
        <jfmall-order-record :currentMemberId="memberId"></jfmall-order-record>
      </div>
      <div class="col-shrink bg-white full-height q-mt-xs" v-if="activeTab == 'hlcoupon'">
        <coupon-list :currentMemberId="memberId"></coupon-list>
      </div>

      <div class="col-shrink bg-white full-height flex flex-center q-mt-xs" v-if="!memberId">
        <div class="text-center">
          <q-icon size="150px" color="blue-grey" name="las la-edit"> </q-icon>
          <div class="text-blue-grey">请先读卡</div>
        </div>
      </div>
      <div class="col-shrink bg-white full-height" v-if="activeTab == 'count'">
        <deduct-count ref="deductCountRef" />
      </div>
      <div class="col-shrink bg-white full-height" v-if="activeTab == 'timing'">
        <deduct-duration ref="deductDurationRef" />
      </div>
      <div class="col-shrink bg-white full-height" v-if="activeTab == 'growRecord'">
        <grow-record :currentMemberId="memberId"  />
      </div>

       <div class="col-shrink bg-white full-height" v-if="activeTab == 'upgradeList'">
        <upgrade-record :currentMemberId="memberId"  />
      </div>

    </div>
  </q-page>
</template>
<script>
import BasicSettings from './components/IndexBasicSettings.vue'
import DeductCount from './components/DeductCount.vue'
import DocumentManagement from '../../set/invoice/index.vue'
import TrackRecordList from 'pages/plugin/track/MemberRecordList.vue'
import JfmallOrderRecord from 'pages/plugin/jfmall/jforder/record.vue'
import DeductDuration from './components/DeductDuration.vue'
import CouponList from 'pages/plugin/hlcoupon/components/CouponList.vue'
import GrowRecord from './components/GrowRecord.vue'
import UpgradeRecord from './components/UpgradeRecord.vue'
import { LocalStorage } from 'quasar'
export default {
  name: 'memberinfo',
  components: {
    BasicSettings,
    DocumentManagement,
    TrackRecordList,
    JfmallOrderRecord,
    DeductCount,
    DeductDuration,
    CouponList,
    GrowRecord,
    UpgradeRecord
  },
  data () {
    return {
      userData: {
        mem_memberName: '',
        mem_memberRealName: '',
        mem_memberMoneyCount: '',
        mem_memberNumberCount: '',
        mem_memberPointsCount: '',
        membercardlevel_id: '',
        mem_memberIdentityNum: '',
        mem_memberPicture: '',
        mem_memberWechat: '',
        email: '',
        mem_memberMobile: '',
        mem_memberCardNum: '',
        birthday: '',
        mem_memberSex: '',
        mem_memberBirthdayType: '',
        mem_memberNote: '',
        province: '',
        mem_memberDetailAddress: '',
        mcl_level_name: '',
        mem_license_plate: ''
      },

      searchFrom: {
        memberId: 0,
        consumePayType: '',
        selectoperator: '',
        documentNumber: '',
        cardNumber: '',
        start_specifiedStartTime: '',
        end_specifiedEndTime: '',
        payStatus: ''
      },
      activeName: 0,
      cardReading: '',
      activeTab: '1',
      memberId: 0,
      cardReaderData: {},
      openPlugins: []
    }
  },
  watch: {
    // activeTab(val) {
    //   this.memberId = this.cardReaderData.id;
    // }
  },
  mounted () {},
  created () {
    if (LocalStorage.getItem('myonestore_plugins_local').openPlugins) {
      this.openPlugins = LocalStorage.getItem('myonestore_plugins_local').openPlugins
    }
  },
  computed: {},
  methods: {
    changeTab () {
      if (parseInt(this.activeTab) == 1) {
        this.$nextTick(() => {
          this.$refs.memberDataref.initData(this.cardReaderData)
        })
      }

      if (this.activeTab == 'count') {
        this.$nextTick(() => {
          this.$refs.deductCountRef.init(this.memberId)
        })
      }
      if (this.activeTab == 'timing') {
        this.$nextTick(() => {
          this.$refs.deductDurationRef.init(this.memberId)
        })
      }
    },
    // 读卡传值
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.userData = val
          if (this.userData.mem_memberBirthdayYear) {
            this.userData.birthday = this.userData.mem_memberBirthdayYear + '-' + this.userData.mem_memberBirthdayMonth + '-' + this.userData.mem_memberBirthdayDay
          }

          this.memberId = this.userData.id
          this.cardReading = ''
          this.updateMemberData(this.userData)
        }
      }
    },
    refreshMembership (val) {
      if (val) {
        this.userData.mem_memberCardNum = val
      }
    },
    // 读卡后向组件里传值
    updateMemberData (val) {
      if (val) {
        this.activeTab = '1'
        this.cardReaderData = val
        this.$nextTick(() => {
          this.$refs.memberDataref.initData(val)
        })
        this.$nextTick(() => {
          this.changeTab()
        })
      }
    }
  }
}
</script>
<style></style>
