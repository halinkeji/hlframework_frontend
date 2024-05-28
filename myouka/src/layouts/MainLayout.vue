<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          flat
          v-if="$q.screen.gt.xs"
          dense
          round
          @click="sidebarLeftOpen = !sidebarLeftOpen"
          :icon="`${sidebarLeftOpen ? 'menu_open' : 'menu'}`"
          aria-label="Menu"
          color="white"
          size="sm"
        />
        <q-btn
          flat
          v-else
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          :icon="`${leftDrawerOpen ? 'menu_open' : 'menu'}`"
          aria-label="Menu"
          color="white"
          size="sm"
        />

        {{ store_info.name }}
        <q-space />
        {{ nowTimeComputed }}
        <q-btn flat round dense @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" class="q-mr-xs">
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

        <q-btn v-if="$q.screen.gt.sm" flat round dense size="sm" icon="fas fa-mobile" class="q-mr-xs">
          <q-menu fit>
            <q-card class="full-width" flat bordered>
              <q-card-section class="text-center q-pb-xs">
                <div class="text-subtitle2">移动端注册二维码</div>
              </q-card-section>
              <q-separator inset />
              <q-card-section class="flex flex-center">
                <qrcode-vue id="mobileRegUrlRef" :value="mobileRegUrl" foreground="#027be3" :size="'200'" level="H" />
              </q-card-section>
              <q-separator inset />
              <q-card-section class="text-center q-pa-xs">
                <q-btn rounded @click="downloadMobileRegCode" color="primary" label="下 载" />
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
                    <q-img v-if="!scope.opt.logoData">
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center">x</div>
                      </template>
                    </q-img>
                    <q-img :src="`${$q.localStorage.getItem('myouka_system_local').attach_url}` + scope.opt.logoData.path">
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
                  <q-btn outline rounded color="primary" size="sm" label="进入" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-btn flat :label="userName">
          <q-avatar color="grey-1" text-color="primary" icon="las la-user" size="42px" />
          <q-menu transition-show="scale" transition-hide="scale">
            <q-list style="width: 200px">
              <q-item clickable v-ripple @click="updatePassword">
                <q-item-section avatar>
                  <q-icon color="primary" flat round name="las la-user-lock" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>修改密码</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="las la-angle-right" size="xs" color="primary" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="updateMenuData">
                <q-item-section avatar>
                  <q-icon color="primary" flat round name="lab la-buffer" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>更新缓存</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="las la-angle-right" size="xs" color="primary" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="openShiftDialog">
                <q-item-section avatar>
                  <q-icon color="primary" flat round name="swap_horiz" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>交班</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="las la-angle-right" size="xs" color="primary" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="logoutAccount">
                <q-item-section avatar>
                  <q-avatar color="negative" icon="las la-sign-out-alt" text-color="white"></q-avatar>
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
      </q-toolbar>
    </q-header>
    <upate-password ref="passwordDialogRef" @closeDialog="closeUpdateDialog" v-if="passwordDialogStatus" />
    <shift-index ref="shiftIndexRef" @closeDialog="shiftDialogStatus = false" v-if="shiftDialogStatus" />
    <q-page-container class="main-page-container">
      <div
        class="main-page-sidebar full-height"
        ref="pageSidebar"
        v-show="sidebarVisibility"
        :style="`width: ${!$q.screen.gt.xs ? 0 : !sidebarLeftOpen ? sidebarMinimize : sidebar}px`"
      >
        <div class="sidebar-body">
          <q-scroll-area class="fit">
            <hl-menu-tree v-model="sidebarLeftOpen" :menuData="linksData"></hl-menu-tree>
          </q-scroll-area>
        </div>
        <div class="sidebar-footer row items-center" v-if="$q.screen.gt.xs">
          <q-btn
            flat
            dense
            round
            @click="sidebarLeftOpen = !sidebarLeftOpen"
            :icon="`${sidebarLeftOpen ? 'format_indent_decrease' : 'format_indent_increase'}`"
            aria-label="Menu"
            color="primary"
            size="sm"
          />
        </div>
      </div>

      <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered :width="240">
        <hl-menu-tree :menuData="linksData" :minimize="true" v-model="leftDrawerOpen"></hl-menu-tree>
      </q-drawer>
      <div
        class="main-page-body bg-blue-grey-1"
        ref="pageBody"
        :style="`left: ${!$q.screen.gt.xs || !sidebarVisibility || !leftDrawerOpenAll ? 0 : !sidebarLeftOpen ? sidebarMinimize : sidebar}px`"
      >
        <div class="full-height scroll">
          <router-view />
        </div>
      </div>
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
    </q-page-container>
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
      sidebar: 240,
      sidebarMinimize: 55,
      sidebarVisibility: true,
      sidebarLeftOpen: true,
      nowTimeComputed: '',
      leftDrawerOpenAll: true,
      availableStoreList: [],
      nowStoreId: '',
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

    sidebarLeftOpen (val) {
      if (this.sidebarVisibility) {
        this.$refs.pageSidebar.setAttribute('style', 'width: ' + (val ? this.sidebar : this.sidebarMinimize) + 'px')
        this.$refs.pageBody.setAttribute('style', 'left: ' + (val ? this.sidebar : this.sidebarMinimize) + 'px')
      }
    },
    '$q.screen.gt.sm' (val) {
      if (this.sidebarVisibility) {
        this.sidebarLeftOpen = val
      }
    },
    '$q.screen.gt.xs' () {
      if (this.sidebarVisibility) {
        this.sidebarLeftOpen = false
      }
    }
  },
  computed: {
    menuData () {
      return this.$store.state.settings.menuData
    },
    storeEndTime () {
      const storeLocal = this.$q.localStorage.getItem('myouka_store_local')
      if (storeLocal && storeLocal.storeUseEndTime) {
        const storeUseEndTime = storeLocal.storeUseEndTime
        // return storeUseEndTime
        return this.$q_date.formatDate(storeUseEndTime * 1000, 'YYYY年MM月DD日')
      }
      return '错误'
    },
    mobileRegUrl () {
      const account_info = this.$q.localStorage.getItem('myouka_account_info')
      const system_local = this.$q.localStorage.getItem('myouka_system_local')
      if (account_info && system_local) {
        let url = system_local.systemInfo.site_url + '/m/myouka/?id=' + account_info.lib_id
        if (account_info.lib_id != account_info.store_id) {
          url += '&StoreId=' + account_info.store_id
        }
        return url
      }
      return ''
    },
    current_title () {
      if (LocalStorage.getItem('myouka_apply_local')) {
        const systemLocal = LocalStorage.getItem('myouka_apply_local')
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
    if (LocalStorage.getItem('myouka_apply_local')) {
      const copyright = LocalStorage.getItem('myouka_apply_local').copyright
      if (copyright && copyright.sy_icon) {
        this.sy_icon = copyright.sy_icon
        this.sy_serve_qrcode = copyright.sy_serve_qrcode
        this.sy_serve_mobile = copyright.sy_serve_mobile
      }
    }
    this.getWxappQrcode()
    this.getMenuData()
    const user_info = LocalStorage.getItem('myouka_user_info')
    this.userName = user_info ? user_info.username : '未知'

    const account_info = LocalStorage.getItem('myouka_account_info')
    if (account_info && account_info.store_id) {
      this.nowStoreId = account_info.store_id.toString()
    }

    const storeLocal = this.$q.localStorage.getItem('myouka_store_local')
    if (storeLocal && storeLocal.storeInfo) {
      this.store_info = storeLocal.storeInfo
    }

    this.getAvailableStore()
  },
  mounted () {
    const that = this
    that.timer = setInterval(function () {
      that.nowTime()
    }, 1000)
    this.getMenuData()
  },
  methods: {
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
              const account_info = this.$q.localStorage.getItem('myouka_account_info')
              account_info.store_id = nowStoreId
              this.$q.localStorage.set('myouka_account_info', account_info)

              const store_local = this.$q.localStorage.getItem('myouka_store_local')
              store_local.storeInfo = res.data
              this.$q.localStorage.set('myouka_store_local', store_local)

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

    nowTime () {
      const that = this
      that.nowTimeComputed = that.$q_date.formatDate(new Date(), 'YYYY-MM-DD  HH:mm:ss')
    },

    getMenuData () {
      const myouka_left_menu_navigate_local = LocalStorage.getItem('myouka_left_menu_navigate_local')

      this.linksData = myouka_left_menu_navigate_local
    },

    logoutAccount () {
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
            LocalStorage.set('myouka_system_local', res.data.system_local)
            LocalStorage.set('myouka_apply_local', res.data.apply_local)
            LocalStorage.set('myouka_store_local', res.data.store_local)
            LocalStorage.set('myouka_plugins_local', res.data.plugins_local)

            const allRouter = this.getFormatRoutes(res.data.router)
            LocalStorage.set('myouka_router_local', res.data.router)
            routes[1].children = allRouter

            this.$router.addRoutes(routes)
            LocalStorage.set('myouka_left_menu_navigate_local', res.data.menu)
            this.$store.commit('settings/SET_MENUData', res.data.menu)

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

    openShiftDialog () {
      this.shiftDialogStatus = true
      this.$nextTick(() => {
        this.$refs.shiftIndexRef.init()
      })
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
  top: 50px
  right: 0
  bottom: 0
  overflow: hidden
  padding-top: 0px !important
.main-page-sidebar
  position: absolute
  border-right: 1px solid #eaebec
  background-color: #fff
  & .sidebar-body
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 45px
  & .sidebar-footer
    position: absolute
    left: 0
    right: 0
    bottom: 0
    height: 45px
    padding-left: 13.5px
.main-page-body
  position: absolute
  top: 0
  right: 0
  bottom: 0

  overflow-x: hidden
</style>
<style scoped>
.storeListClass i {
  color: white;
}
</style>
