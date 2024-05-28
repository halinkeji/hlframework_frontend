<template>
  <q-layout view="hHh Lpr lFf" class="shadow-2 fit rounded-borders">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar class="q-pl-none">
        <span class="q-px-md">{{ store_info.name || '' }}</span>

        <q-separator vertical color="white" inset />
        <div v-for="(item, key) in linksData">
          <q-btn :icon="item.icon" class="text-caption" :label="item.name" stack flat color="white">
            <q-menu :offset="[50, 0]">
              <q-card class="bg-white text-dark" flat style="width: 200px">
                <div :key="k" v-for="(i, k) in item.children">
                  <q-expansion-item expand-icon-class="text-dark" expand-separator :label="i.name" v-if="i.children && i.children.length > 0">
                    <q-list separator class="text-dark full-width">
                      <q-item
                        clickable
                        :active="$route.path === value.to"
                        v-ripple
                        active-class=" bg_deep text-white"
                        @click="goPage(value.to)"
                        :key="k"
                        v-for="(value, k) in i.children"
                      >
                        <q-item-section>{{ value.name }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-expansion-item>
                  <q-item clickable v-ripple v-else active-class=" bg_deep text-white" :active="$route.path === i.to" @click="goPage(i.to)">
                    <q-item-section>{{ i.name }}</q-item-section>
                  </q-item>
                </div>
              </q-card>
            </q-menu>
          </q-btn>
        </div>

        <q-space />

        <div class="column full-height">
          <div class="col text-right row">
            <q-btn dense flat @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'">
              <q-tooltip content-class="grey-3" :offset="[10, 10]"> 全屏 </q-tooltip>
            </q-btn>
            <q-btn v-if="$q.screen.gt.sm" flat round dense size="sm" icon="fas fa-headset" class="q-mr-xs">
              <q-menu fit>
                <q-card class="full-width" flat bordered>
                  <q-card-section class="text-center q-pb-xs">
                    <div class="text-subtitle2">售后客服</div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="flex flex-center">
                    <q-avatar square size="100px" v-if="sy_serve_qrcode">
                      <img :src="sy_serve_qrcode" />
                    </q-avatar>
                    <q-icon v-else name="contact_support" size="50px" color="grey" />
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section>
                    <div class="q-mr-xs">联系电话 : {{ sy_serve_mobile ? sy_serve_mobile : '待分配' }}</div>
                    <div class="text-grey text-caption">到期时间 : {{ storeEndTime }}</div>
                  </q-card-section>
                </q-card>
              </q-menu>
            </q-btn>

            <q-btn v-if="$q.screen.gt.sm && wxappQrcodeUrlType == 'local'" flat round dense size="sm" icon="fab fa-weixin" class="q-mr-xs">
              <q-menu fit>
                <q-card class="full-width" flat bordered>
                  <q-card-section class="text-center q-pb-xs">
                    <div class="text-subtitle2">小程序入口二维码</div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="flex flex-center">
                    <q-img :src="wxappQrcodeUrl" :ratio="1" width="200px" />
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="text-center q-pa-xs">
                    <q-btn rounded @click="downloadQrcode" color="primary" label="下 载" />
                  </q-card-section>
                </q-card>
              </q-menu>
            </q-btn>

            <q-btn
              v-if="$q.screen.gt.sm && wxappQrcodeUrlType == 'pmerchant'"
              @click="clickOpenWxappQrcode"
              flat
              round
              dense
              size="sm"
              icon="fab fa-weixin"
              class="q-mr-xs"
            >
            </q-btn>

            <div v-if="availableStoreList && availableStoreList.length > 1">
              <q-select
                v-model="nowStoreId"
                :options="availableStoreList"
                label="当前门店"
                color="white"
                :style="{
                  width: this.$q.screen.width * 0.15 + 'px',
                }"
                emit-value
                map-options
                @input="switchStoreManage"
                filled
                class="storeListClass full-height"
                square
                dense
                label-color="white"
                option-value="id"
                option-label="name"
                options-selected-class="bg-primary text-white"
                ><template v-slot:selected-item="scope">
                  <div class="text-white">
                    {{ scope.opt.name }}
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" class="text-black">
                    <q-item-section avatar>
                      <q-avatar>
                        <q-img :src="scope.opt.logo ? `${$q.localStorage.getItem('sspacechainstore_system_local').attach_url}` + scope.opt.logo : ''"
                          ><template v-if="!scope.opt.logo">
                            <div class="absolute-full flex flex-center">x</div>
                          </template>
                          <template v-slot:error>
                            <div class="absolute-full flex flex-center">x</div>
                          </template>
                        </q-img>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> <q-badge color="orange" v-if="scope.opt.lib_id == scope.opt.id">总</q-badge>{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-btn outline rounded color="bg-primary" size="sm" label="进入" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <q-btn flat :label="userName">
              <q-avatar color="grey-1" class="color_shallow" icon="las la-user" size="36px" />
              <q-menu transition-show="scale" transition-hide="scale">
                <q-list bordered style="width: 200px">
                  <q-item clickable v-ripple @click="updatePassword">
                    <q-item-section avatar>
                      <q-avatar icon="las la-user-lock" class="bg-primary" text-color="white"></q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>修改密码</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="las la-angle-right" size="xs" class="color_shallow" />
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple @click="updateMenuData">
                    <q-item-section avatar>
                      <q-avatar class="bg-primary" icon="lab la-buffer" text-color="white"></q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>更新缓存</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="las la-angle-right" size="xs" class="color_shallow" />
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple @click="openShiftDialog">
                    <q-item-section avatar>
                      <q-avatar class="bg-primary" icon="las la-calendar-check" text-color="white"></q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>交接班</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="las la-angle-right" size="xs" class="color_shallow" />
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple @click="logoutAccount">
                    <q-item-section avatar>
                      <q-avatar color="negative" icon="las la-sign-out-alt" class="text-white"></q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>退出</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="las la-angle-right" size="xs" color="negative" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="100" :breakpoint="500" bordered persistent>
      <div class="row full-width full-height bg-primary">
        <div class="col-12">
          <q-scroll-area class="fit">
            <div class="row">
              <div class="col-12" style="height: 1px">
                <q-separator color="white" />
              </div>
            </div>
            <q-tabs v-model="tab" vertical indicator-color="transparent" class="text-white" active-bg-color="teal" active-class=" bg_deep text-h6 ">
              <q-route-tab
                :name="item.name"
                :to="{ path: item.to }"
                v-for="(item, key) in businessMenuData"
                :icon="item.icon ? item.icon : 'las la-icons'"
                :label="item.name"
                :key="key"
              ></q-route-tab>
            </q-tabs>
            <q-space />
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>
    <shift-index v-if="shiftDialogStatus" ref="shiftRefs" @closeDialog="shiftDialogStatus = false" @logoutAccount="logoutAccount" />
    <upate-password ref="passwordDialogRef" @closeDialog="closeUpdateDialog" v-if="passwordDialogStatus" />
    <q-page-container class="bg-grey-3 main-page-container q-pt-xs" style="padding-left: 100px">
      <router-view />
    </q-page-container>

    <q-dialog v-model="qrcodeDialog" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.9) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.9) + 'px',
        }"
      >
      <q-card-section class="row q-py-xs q-px-sm items-center">
        微信小程序商家码
        <q-space />
         <q-btn unelevated dense flat round icon="close" color="grey" @click="closeDialog" />
      </q-card-section>
      <q-separator />
        <q-card-section class="q-pa-md row q-gutter-xs" v-if="wxappQrcodeUrl && wxappQrcodeUrl.one">
          <div class="col-2" v-if="wxappQrcodeUrl && wxappQrcodeUrl.one">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（280px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center">
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.one}`" style="width: 140px" width="140" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.one, '280 * 280')" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-3" v-if="wxappQrcodeUrl && wxappQrcodeUrl.two">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（640px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center">
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.two}`" style="width: 320px" width="320" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.two, '320 * 320')" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col" v-if="wxappQrcodeUrl && wxappQrcodeUrl.three">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（1280px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center">
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.three}`" style="width: 640px" width="640" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.three, '1280 * 1280')" />
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>

        <q-separator />

      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
import layout from '@/components/Layout/Layout.vue'
import UpatePassword from './Password.vue'
import routes from '@/router/routes'
import shiftIndex from '../pages/shift/index.vue'
export default {
  name: 'MainLayout',
  components: {
    UpatePassword,
    shiftIndex
  },
  data () {
    return {
      title: '',
      sy_icon: '',
      sy_serve_qrcode: '',
      sy_serve_mobile: '',
      userName: '',
      leftDrawerOpen: false,
      linksData: [],
      store_info: {},
      nowTimeComputed: '',
      tab: '',
      businessMenuData: [],
      drawer: true,
      drawerRight: false,
      nowStoreId: '',
      availableStoreList: [],
      passwordDialogStatus: false,
      shiftDialogStatus: false,
      wxappQrcodeUrl: '',
      wxappQrcodeUrlType: '',
      qrcodeDialog: false
    }
  },
  meta () {
    return {
      title: this.current_title,
      titleTemplate: (title) => `${title}`,
      sy_icon: this.sy_icon,
      link: {
        material: { rel: 'icon', type: 'image/png', sizes: '96x96', href: this.sy_icon }
      }
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  watch: {
    menuData (v) {
      this.getMenuData()
    },
    currentBusinessMenuData (v) {
      this.getBusinessMenuData()
    }
  },
  computed: {
    menuData () {
      return this.$store.state.settings.menuData
    },
    currentBusinessMenuData () {
      return this.$store.state.settings.businessMenuData
    },
    storeEndTime () {
      const storeLocal = this.$q.localStorage.getItem('sspacechainstore_store_local')
      if (storeLocal && storeLocal.storeUseEndTime) {
        return this.$q_date.formatDate(storeLocal.storeUseEndTime * 1000, 'YYYY年MM月DD日')
      }
      return '错误'
    },
    mobileRegUrl () {
      const account_info = this.$q.localStorage.getItem('sspacechainstore_account_info')
      const system_local = this.$q.localStorage.getItem('sspacechainstore_system_local')
      if (account_info && system_local) {
        return system_local.systemInfo.site_url + '/m/sspacechainstore/?id=' + account_info.lib_id
      }
      return ''
    },
    current_title () {
      if (LocalStorage.getItem('sspacechainstore_apply_local')) {
        const systemLocal = LocalStorage.getItem('sspacechainstore_apply_local')
        if (systemLocal && systemLocal.copyright) {
          if (parseInt(systemLocal.copyright.sy_code) == 1) {
            return this.store_info ? this.store_info.name : ''
          } else {
            return (this.store_info ? this.store_info.name : '') + ' - Powered by HLFramework HALIN.NET'
          }
        } else {
          return ' 哈林会员管理软件-哈林集群式框架管理系统- Powered by HLFramework HALIN.NET'
        }
      }
      return ''
    }
  },
  created () {
    if (LocalStorage.getItem('sspacechainstore_apply_local')) {
      const copyright = LocalStorage.getItem('sspacechainstore_apply_local').copyright
      if (copyright && copyright.sy_icon) {
        this.sy_icon = copyright.sy_icon
        this.sy_serve_qrcode = copyright.sy_serve_qrcode
        this.sy_serve_mobile = copyright.sy_serve_mobile
      }
    }
    this.getMenuData()
    const user_info = LocalStorage.getItem('sspacechainstore_user_info')
    this.userName = user_info ? user_info.username : '未知'

    const storeInfo = this.$q.localStorage.getItem('sspacechainstore_store_local')
    if (storeInfo && storeInfo.storeInfo) {
      this.store_info = storeInfo.storeInfo
    }
    const account_info = LocalStorage.getItem('sspacechainstore_account_info')
    if (account_info && account_info.store_id) {
      this.nowStoreId = account_info.store_id.toString()
    }
    this.getAvailableStore()
  },
  mounted () {
    const that = this
    that.timer = setInterval(function () {
      that.nowTime()
    }, 1000)
    this.initWebSorket()
    this.getWxappQrcode()
    this.getMenuData()
    this.getBusinessMenuData()
  },
  methods: {
    initWebSorket () {
      this.$store.dispatch('websorket/initWebSorket')
    },
    getBusinessMenuData () {
      this.businessMenuData = LocalStorage.getItem('sspacechainstore_business_menu_navigate_local')
    },
    nowTime () {
      const that = this
      that.nowTimeComputed = that.$q_date.formatDate(new Date(), 'YYYY-MM-DD  HH:mm:ss')
    },
    getMenuData () {
      const sspacechainstore_left_menu_navigate_local = LocalStorage.getItem('sspacechainstore_left_menu_navigate_local')

      this.linksData = sspacechainstore_left_menu_navigate_local
    },
    logoutAccount () {
      this.$q
        .dialog({
          title: '退出！',
          message: '确定退出当前账号?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show({
            message: '正在保存数据,请稍后...'
          })

          removeAllLocalStorage()
          removeAllCookies()

          setTimeout(() => {
            this.$q.loading.hide()

            if (this.$route.name == 'PageIndex') {
              location.reload()
            } else {
              this.$router.push({ name: 'PageIndex' })
            }
          }, 1500)
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },

    goPage (path) {
      this.$router.push({ path: path })
    },
    updatePassword () {
      this.passwordDialogStatus = true

      this.$nextTick(() => {
        this.$refs.passwordDialogRef.updatePassword()
      })
    },
    closeUpdateDialog () {
      this.passwordDialogStatus = false
    },
    updateMenuData () {
      this.$q.loading.show({
        message: '正在更新缓存'
      })

      this.$store
        .dispatch('user/roleInfo')
        .then((res) => {
          if (res.code == 200) {
            LocalStorage.set('sspacechainstore_system_local', res.data.system_local)
            LocalStorage.set('sspacechainstore_apply_local', res.data.apply_local)
            LocalStorage.set('sspacechainstore_store_local', res.data.store_local)
            LocalStorage.set('sspacechainstore_plugins_local', res.data.plugins_local)

            const allRouter = this.getFormatRoutes(res.data.router)
            LocalStorage.set('sspacechainstore_router_local', res.data.router)
            routes[1].children = allRouter
            this.$router.addRoutes(routes)
            const businessMenu = res.data.businessMenu || []
            // 写入左侧菜单
            LocalStorage.set('sspacechainstore_left_menu_navigate_local', res.data.menu)
            this.$store.commit('settings/SET_MENUData', res.data.menu)

            LocalStorage.set('sspacechainstore_business_menu_navigate_local', businessMenu)
            this.$store.commit('settings/SET_BUSINESS_MENU', businessMenu)

            this.$q.loading.hide()

            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '更新缓存成功！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    getFormatRoutes (arr, value = null, level = 0) {
      return arr.map((item) => {
        if (item.component) {
          var obj = {
            path: item.path ? item.path : '/',
            name: item.name ? item.name : item.label,
            component: () => import('@/pages' + item.component)
          }
        } else {
          var obj = {
            path: item.path ? item.path : '/',
            name: item.name ? item.name : item.label,
            component: layout
          }
        }
        obj.meta = []
        if (item.meta) {
          obj.meta = item.meta
          obj.meta.push({
            auth: true
          })
        }
        if (item.children && item.children.length > 0) {
          obj.children = this.getFormatRoutes(item.children, value, level + 1)
        }

        return obj
      })
    },
    downloadMobileRegCode () {
      const canvas = document.getElementById('mobileRegUrlRef').getElementsByTagName('canvas')
      const a = document.createElement('a')
      a.href = canvas[0].toDataURL('img/png')
      a.download = '注册二维码'
      a.click()
    },
    getAvailableStore () {
      this.$store
        .dispatch('merchant/getRoleStoreList')
        .then((res) => {
          if (res.code == 200) {
            this.availableStoreList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    switchStoreManage () {
      const nowStoreId = parseInt(this.nowStoreId)
      if (nowStoreId > 0) {
        this.$q.loading.show({
          message: '正在切换门店,请稍后...'
        })
        this.$store
          .dispatch('settings/getData', {
            store_id: nowStoreId
          })
          .then((res) => {
            if (res.code == 200 && res.data) {
              const account_info = this.$q.localStorage.getItem('sspacechainstore_account_info')
              account_info.store_id = nowStoreId
              this.$q.localStorage.set('sspacechainstore_account_info', account_info)

              const storeLocal = this.$q.localStorage.getItem('sspacechainstore_store_local')
              storeLocal.storeInfo = res.data

              this.$q.localStorage.set('sspacechainstore_store_local', storeLocal)

              this.$q.notify({
                message: '成功',
                caption: '切换门店成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              setTimeout(() => {
                this.$q.loading.hide()
                location.reload()
              }, 1000)
            } else {
              this.$q.loading.hide()
              this.$q.notify({
                message: '失败',
                caption: '切换门店失败！',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((error) => {
            console.log('error', error)
          })
      }
    },
    getWxappQrcode () {
      this.$store
        .dispatch('settings/getWxappQrcode', {})
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.wxappQrcodeUrl = res.data.qrcodeData
            this.wxappQrcodeUrlType = res.data.type
          }
        })
        .catch((error) => {
          this.$q.notify({
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red'
          })
        })
    },
    openShiftDialog () {
      this.shiftDialogStatus = true
      this.$nextTick(() => {
        this.$refs.shiftRefs.init()
      })
    },
    downloadQrcode (url_code, img_name) {
      const blob = this.base64ToBlob('data:image/png;base64,' + url_code) // 转码
      const filename = img_name
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = filename
      a.click()
    },
    base64ToBlob (code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new window.Blob([uInt8Array], { type: contentType })
    },
    clickOpenWxappQrcode () {
      this.qrcodeDialog = true
    },
    closeDialog () {
      this.qrcodeDialog = false
    }
  }
}
</script>
<style lang="sass" scoped>
.main-page-container
  position: absolute
  left: 0
  top: 53px
  right: 0
  bottom: 0
  overflow: hidden
  padding-top: 0px !important
</style>
