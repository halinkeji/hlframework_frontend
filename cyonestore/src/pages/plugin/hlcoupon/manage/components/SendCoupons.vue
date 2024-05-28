<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pa-sm text-center text-h6">发送卡券</div>

      <div class="col-shrink q-pa-sm full-height bg-grey-2">
        <q-scroll-area class="fit full-height">
          <q-card flat bordered class="q-pa-md">
            <div class="row q-gutter-md q-mb-md">
              <q-chip color="red" text-color="white">系统会自动选择卡券属性为主动群发的卡券，默认发送数量为限领数量。</q-chip>
            </div>
            <div class="row q-gutter-md q-mb-md">
              <div class="col-5">
                <q-input
                  outlined
                  bottom-slots
                  v-model="card_number"
                  dense
                  @keyup.enter.native="cardReader"
                  class="q-pb-none"
                  label="请输入卡号/手机号/身份证号"
                >
                </q-input>
              </div>
              <q-btn unelevated color="blue-6" @click="cardReader()" label="添加会员" />
              <q-btn unelevated color="blue-6" @click="addMember()" label="选择会员" />
            </div>
            <div class="row q-gutter-md">
              <div v-for="(item, key) in memberList">
                <q-chip removable color="#24c1a0" text-color="white" @remove="delMember(key)">
                  <q-avatar v-if="item.coverImage && item.coverImage.id" text-color="white">
                    <img :src="$q.localStorage.getItem('cyonestore_system_local').attach_url + item.coverImage.path" />
                  </q-avatar>
                  <div class="ellipsis">
                    {{ item.mem_memberName }}
                    <q-tooltip>{{ item.mem_memberMobile }}</q-tooltip>
                  </div>
                </q-chip>
              </div>
            </div>
            <div class="q-my-md text-subtitle1">本次发放卡券</div>
            <div class="row q-gutter-md">
              <div v-for="item in sendCouponsData" :key="item.id">
                <q-chip color="#24c1a0" class="mr-2">{{ item.cou_title }}</q-chip>
              </div>
            </div>
            <div class="q-my-md text-subtitle1">选择会员组</div>
            <div class="q-gutter-md row">
              <div v-for="item in memberCardLevelDatas">
                <q-checkbox v-model="memberGroup" :val="item.id" color="#24c1a0">{{ item.mcl_level_name }}</q-checkbox>
              </div>
            </div>
          </q-card>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn unelevated @click="sendBut()" class="q-px-xl" color="blue-6" label="发送" />
        <q-btn unelevated class="q-px-xl" :to="{ name: 'hlCoupon' }" color="grey" label="返回" />
      </div>
    </div>
    <hl-choose-manager
      v-if="chooseManagerVisible"
      ref="chooseManagerList"
      @getChooseManageData="receivingAdministrator"
      @closeChooseManage="closeChooseManage"
    ></hl-choose-manager>
  </q-page>
</template>
<script>
export default {
  name: 'SendCoupons',
  components: {},
  data () {
    return {
      sendCouponsData: [],
      memberGroup: [],
      chooseManagerVisible: false,
      memberList: [],
      card_number: '',
      memberCardLevelDatas: [],
      disabledStatus: false,
      zcrzGroup: [],
      zcrzDatas: []
    }
  },

  mounted () {
    this.sendCouponsData = this.$route.params.sendCouponsData || []
    this.getLevel()
  },
  created () {},
  computed: {},
  methods: {
    delMember (val) {
      this.memberList.splice(val, 1)
    },
    // 获取会员组
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelDatas = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 选择会员
    addMember () {
      this.chooseManagerVisible = true
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        const memberList = this.memberList.map((item) => {
          return parseInt(item.id)
        })
        val.forEach((item) => {
          if (memberList.indexOf(parseInt(item.id)) == -1) {
            this.memberList.push(item)
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: item.mem_memberName + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
      }
    },
    // 关闭
    closeChooseManage () {
      this.chooseManagerVisible = false
    },

    // 读卡传值
    cardReader () {
      if (this.card_number) {
        const obj = {
          card_number: this.card_number
        }

        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              const memberList = this.memberList.map((item) => {
                return parseInt(item.id)
              })
              if (res.data) {
                if (memberList.indexOf(parseInt(res.data.id)) == -1) {
                  this.memberList.push(res.data)
                } else {
                  this.$q.notify({
                    color: 'red',
                    message: '操作失败',
                    caption: res.data.mem_memberName + '已存在',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
              }
              this.card_number = ''
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      }
    },
    // 发送
    sendBut () {
      this.disabledStatus = true
      const obj = {
        sendCouponsData: this.sendCouponsData,
        memberGroup: this.memberGroup,
        zcrzGroup: this.zcrzGroup,
        memberList: this.memberList
      }
      this.$store
        .dispatch('hlCoupon/send', obj)
        .then((res) => {
          if (res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '添加成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.disabledStatus = false
            this.$router.push({ name: 'hlCoupon' })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.disabledStatus = false
        })
    }
  }
}
</script>
