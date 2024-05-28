<template>
  <q-dialog @hide="hideNowPage" v-model="bindMobileStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md text-h6 q-mb-xs">用户设置</div>

        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-list bordered padding class="rounded-borders">
              <q-item-label header>消息提醒</q-item-label>
              <q-item :v-ripple="false">
                <q-item-section>
                  <q-item-label>微信公众号模板消息提醒</q-item-label>
                  <q-item-label caption>启用后，当前操作员可以接收门店消费后微信公众号模板消息提醒</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="wechatPushNotice.member_consume" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
               <q-item :v-ripple="false">
                <q-item-section>
                  <q-item-label>微信公众号模板消息提醒</q-item-label>
                  <q-item-label caption>启用后，当前操作员可以接收会员注册时微信公众号模板消息提醒</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="green" v-model="wechatPushNotice.member_reg" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>

            </q-list>

            <div class="row" v-if="configContent.wechat_fast_menu && configContent.wechat_fast_menu.length > 0">
              <div class="col service-box q-ma-xs">
                <div class="row">
                  <div class="service-box-item text-center q-py-sm" v-for="(i, k) in configContent.wechat_fast_menu">
                    <q-btn dense flat :icon="i.icon" stack color="light-blue" @click="delFastMenuItem(i)">
                      <q-badge color="red" floating transparent v-if="editStatus" rounded>
                        <q-icon name="fa-solid fa-minus" size="6px"></q-icon>
                      </q-badge>
                    </q-btn>
                    <div class="text-weight-light text-dark">{{ i.name }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-for="(item, key) in allMenuList">
              <div class="row q-mt-md q-mb-sm" v-if="item.children && item.children.length > 0">
                <div class="col text-left q-pl-sm text-weight-bold">{{ item.name }}</div>
              </div>
              <div class="row" v-if="item.children && item.children.length > 0">
                <div class="col service-box q-ma-xs">
                  <div class="row">
                    <div class="service-box-item text-center q-py-sm" v-for="(i, k) in item.children" v-if="showStatus(i.mark)">
                      <q-btn dense flat :icon="i.icon" stack color="light-blue" @click="plusFastMenu(i)">
                        <q-badge color="amber-7" floating transparent v-if="editStatus" rounded>
                          <q-icon name="fa-solid fa-plus" size="6px"></q-icon>
                        </q-badge>
                      </q-btn>
                      <div class="text-weight-light text-dark">{{ i.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated color="primary" class="q-px-xl" @click="saveBindData" label="保存" />
          <q-btn unelevated color="grey" @click="bindMobileStatus = false" class="q-px-xl" label="关闭" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  components: {},
  name: 'index',
  props: {},
  data () {
    return {
      chooseManagerStatus: false,
      bindMobileStatus: false,
      configContent: {
        wechat_push_notice: {},
        wechat_fast_menu: []
      },
      allMenuList: [],
      editStatus: false,
      wechatPushNotice: {
        member_consume: 0,
        member_reg: 0
      }
    }
  },
  computed: {},
  created () {},
  watch: {},
  mounted () {},
  methods: {
    init (userId) {
      this.bindMobileStatus = true
      if (userId && parseInt(userId) > 0) {
        this.user_id = userId
        this.getMobileInfo()
      }
    },
    hideNowPage () {
      this.$emit('closeDialog')
    },
    setWechatPushNotice (templatModel) {
      const that = this
      const wechatPushNotice = this.wechatPushNotice
      for (const key in wechatPushNotice) {
        if (templatModel[key]) {
          that.wechatPushNotice[key] = templatModel[key]
        }
      }
    },
    getMobileInfo () {
      const payload = {
        relation_user_id: parseInt(this.user_id)
      }

      this.$store
        .dispatch('user/getUserExtend', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.configContent = res.data
            if (this.configContent && this.configContent.wechat_fast_menu) {
              this.configContent.wechat_fast_menu = JSON.parse(this.configContent.wechat_fast_menu)
            }

            if (this.configContent && this.configContent.wechat_push_notice) {
              this.setWechatPushNotice(JSON.parse(this.configContent.wechat_push_notice))
            }
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

    saveBindData () {
      this.configContent.wechat_push_notice = this.wechatPushNotice
      const payload = {
        relation_user_id: parseInt(this.user_id),
        ...this.configContent
      }

      this.$store
        .dispatch('user/setUserExtend', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.bindMobileStatus = false
            this.$q.notify({
              message: '成功',
              caption: '设置成功！',
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

    showStatus (mark) {
      const menuIndex = _.findIndex(this.configContent.wechat_fast_menu, function (o) {
        return o.mark == mark
      })
      if (menuIndex > -1) {
        return false
      }
      return true
    },
    plusFastMenu (item) {
      if (this.editStatus) {
        const menuIndex = _.findIndex(this.configContent.wechat_fast_menu, function (o) {
          return o.mark == item.mark
        })
        if (menuIndex < 0) {
          this.configContent.wechat_fast_menu = this.configContent.wechat_fast_menu && this.configContent.wechat_fast_menu.length >= 0 ? this.configContent.wechat_fast_menu : []
          this.configContent.wechat_fast_menu.push(item)
        }
      }
    },

    delFastMenuItem (item) {
      if (this.editStatus) {
        if (this.configContent.wechat_fast_menu && this.configContent.wechat_fast_menu.length > 0) {
          const menuIndex = _.findIndex(this.configContent.wechat_fast_menu, function (o) {
            return o.mark == item.mark
          })
          if (menuIndex > -1) {
            this.configContent.wechat_fast_menu.splice(menuIndex, 1)
          }
        }
      }
    }
  }
}
</script>
