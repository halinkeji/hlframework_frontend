<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink q-pa-sm full-height bg-white">
        <q-card flat bordered class="fit">
          <q-card-section horizontal class="full-height">
            <q-card-section class="col-4 q-py-xl">
              <q-card flat bordered style="height:580px;width:320px;margin:0 auto;" class="relative-position">
                <img :src="`/mobile-header-bg.png`" style="width:320;height:64px" />
                <div class="text-white text-subtitle1" style="position:absolute;top:27px; left:40%">
                  默认菜单
                </div>
                <div class="absolute-bottom row" style="margin-bottom:60px;padding-left:43px">
                  <div :class="menuData.length > 1 ? 'col-4' : 'col-6'" class="relative-position" v-for="(bit, btnKey) in menuData" :key="btnKey" v-if="menuData[btnKey]">
                    <q-list bordered class="bg-grey-1 absolute-bottom ">
                      <q-item
                        class="q-pa-none text-center "
                        :class="sumMenu.key == item.key && currentSort == item.mainKey ? 'noChange' : ''"
                        :key="normIndex"
                        v-for="(item, normIndex) in menuData[btnKey]['sub_button']"
                      >
                        <q-item-section>
                          <q-item-label lines="1" @click="changeMenu(item, btnKey, normIndex)">
                            {{ item.name }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-ripple class="q-pa-none text-center" @click="addSubMenu(btnKey)" v-if="menuData[btnKey]['sub_button'].length <= 4">
                        <q-item-section>
                          <q-item-label lines="1">
                            <q-icon name="add " size="22px" />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
                <div class="absolute-bottom" style="background:url(/mobile-header-footer.png);width:320;height:50px">
                  <div class="row text-center foot-border" style="padding-left:43px;height:50px">
                    <div
                      class="col"
                      :key="index"
                      v-for="(i, index) in menuData"
                      :class="currentSort == index ? 'noChange' : 'change active'"
                      @click="active(index, i)"
                      style="height:50px;line-height:50px"
                    >
                      {{ i.name }}
                    </div>
                    <div v-if="menuData.length <= 2" class="col change active" @click="addMainMenu()" style="height:50px;line-height:50px"><q-icon name="add " size="22px" />添加菜单</div>
                  </div>
                </div>
              </q-card>
            </q-card-section>

            <q-separator vertical />

            <q-card-section class="col-8" >
              <div class="row">
                <div class="col"><q-icon name="las la-square-full" color="primary"></q-icon> 当前菜单</div>
                <div class="col text-right text-primary" style="cursor: pointer;" @click="deleteMenu(mainKey, normIndex)">
                  删除该菜单
                </div>
              </div>

              <q-separator class="q-my-sm" />
              <div class="row q-mt-lg items-center text-center">
                <div class="col-2">
                  菜单名称
                </div>
                <div class="col-8">
                  <q-input outlined bottom-slots v-model="sumMenu.name" dense class="q-pb-none" @input="changeShowData(sumMenu, $event)">
                    <template v-slot:hint>
                      字数不超过5个汉字或8个字母
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row q-mt-lg items-center text-center">
                <div class="col-2">
                  菜单内容
                </div>
                <div class="col-10 q-gutter-md text-left">
                  <q-btn-toggle v-model="sumMenu.type" color="grey" text-color="white" toggle-color="primary" unelevated :options="options" />
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '1'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  回复内容
                </span>
                <q-separator class="q-my-sm" />
                <div class="q-mt-xl link q-px-lg">
                  [关键字]3大通用版
                </div>
                <q-separator class="q-my-sm q-mx-lg" />
                <div class="row q-col-gutter-md q-px-xl q-mt-lg">
                  <div class="col">
                    <q-list separator>
                      <q-item clickable v-ripple class="text-center">
                        <q-item-section>
                          <q-item-label><q-icon name="las la-photo-video" size="56px" class="text-grey"/></q-item-label>
                          <q-item-label>图文</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col">
                    <q-list separator>
                      <q-item clickable v-ripple class="text-center">
                        <q-item-section>
                          <q-item-label><q-icon name="las la-image" size="56px" class="text-grey"/></q-item-label>
                          <q-item-label>图片</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col">
                    <q-list separator>
                      <q-item clickable v-ripple class="text-center">
                        <q-item-section>
                          <q-item-label><q-icon name="las la-volume-up" size="56px" class="text-grey"/></q-item-label>
                          <q-item-label>语音</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col">
                    <q-list separator>
                      <q-item clickable v-ripple class="text-center">
                        <q-item-section>
                          <q-item-label><q-icon name="las la-video" size="56px" class="text-grey"/></q-item-label>
                          <q-item-label>视频</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div class="col">
                    <q-list separator>
                      <q-item clickable v-ripple class="text-center">
                        <q-item-section>
                          <q-item-label><q-icon name="las la-crosshairs" size="56px" class="text-grey"/></q-item-label>
                          <q-item-label>触发关键字</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == 'view'">
                <q-icon name="las la-square-full" color="primary"></q-icon> 跳转网页
                <span class="q-ml-lg text-grey">
                  订阅者点击该子菜单会跳转到以下链接
                </span>
                <q-separator class="q-my-sm" />
                <div class="row items-center text-center">
                  <div class="col-2">
                    跳转链接
                  </div>
                  <div class="col-8">
                    <q-input outlined bottom-slots v-model="sumMenu.url" dense class="q-pb-none" @input="changeContentData(sumMenu, $event)">
                      <template v-slot:hint>
                        指定点击此菜单时要跳转的链接（注：链接需加http://）
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="q-mt-lg" v-if="sumMenu.type == 'miniprogram'">
                <q-icon name="las la-square-full" color="primary"></q-icon> 跳转网页
                <span class="q-ml-lg text-grey">
                  订阅者点击该子菜单会跳转到以下链接
                </span>
                <q-separator class="q-my-sm" />

                <div class="row items-center q-mt-lg text-center">
                  <div class="col-2">
                    小程序的页面路径
                  </div>
                  <div class="col-8">
                    <q-input outlined bottom-slots v-model="sumMenu.appid" dense class="q-pb-none" @input="changeContentData(sumMenu, $event)">
                      <template v-slot:hint>
                        小程序的appid（仅认证公众号可配置）
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row items-center q-mt-lg text-center">
                  <div class="col-2">
                    小程序的页面路径
                  </div>
                 <div class="col-8">
                    <q-input outlined bottom-slots v-model="sumMenu.pagepath" dense class="q-pb-none" @input="changeContentData(sumMenu, $event)">
                      <template v-slot:hint>
                       小程序的页面路径
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row items-center q-mt-lg text-center">
                  <div class="col-2">
                    备用网页
                  </div>
                  <div class="col-8">
                    <q-input outlined bottom-slots v-model="sumMenu.url" dense class="q-pb-none" @input="changeContentData(sumMenu, $event)">
                      <template v-slot:hint>
                        旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。
                      </template>
                    </q-input>
                  </div>
                </div>

              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '3'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  扫码
                </span>
                <span class="q-ml-lg text-grey">
                  菜单内容为扫码，那么点击这个菜单是，手机扫描二维码
                </span>
                <q-separator class="q-my-sm" />
                <div class="row q-px-xl flex-center q-pt-xl q-mt-lg">
                  <q-list separator>
                    <q-item clickable v-ripple class="text-center">
                      <q-item-section>
                        <q-item-label><q-icon name="las la-crosshairs" size="56px" class="text-grey"/></q-item-label>
                        <q-item-label>触发关键字</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '4'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  扫码（等待信息）
                </span>
                <span class="q-ml-lg text-grey">
                  菜单内容为扫码，那么点击这个菜单是，手机扫描二维码
                </span>
                <q-separator class="q-my-sm" />
                <div class="row q-px-xl flex-center q-pt-xl q-mt-lg">
                  <q-list separator>
                    <q-item clickable v-ripple class="text-center">
                      <q-item-section>
                        <q-item-label><q-icon name="las la-crosshairs" size="56px" class="text-grey"/></q-item-label>
                        <q-item-label>触发关键字</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '5'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  地理位置
                </span>
                <span class="q-ml-lg text-grey">
                  菜单内容为地理位置，那么点击这个菜单时，系统发送当前地理位置
                </span>
                <q-separator class="q-my-sm" />
                <div class="row q-px-xl flex-center q-pt-xl q-mt-lg">
                  <q-list separator>
                    <q-item clickable v-ripple class="text-center">
                      <q-item-section>
                        <q-item-label><q-icon name="las la-crosshairs" size="56px" class="text-grey"/></q-item-label>
                        <q-item-label>触发关键字</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '6'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  拍照发图
                </span>
                <span class="q-ml-lg text-grey">
                  菜单内容为系统拍照发图/拍照或者相册发图，那么点击这个菜单是，系统拍照
                </span>
                <q-separator class="q-my-sm" />
                <div class="row q-px-xl flex-center q-pt-xl q-mt-lg">
                  <q-list separator>
                    <q-item clickable v-ripple class="text-center">
                      <q-item-section>
                        <q-item-label><q-icon name="las la-crosshairs" size="56px" class="text-grey"/></q-item-label>
                        <q-item-label>触发关键字</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '7'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  相册发图
                </span>
                <span class="q-ml-lg text-grey">
                  菜单内容为微信相册发图，那么点击这个菜单是，选择图片发送
                </span>
                <q-separator class="q-my-sm" />
                <div class="row q-px-xl flex-center q-pt-xl q-mt-lg">
                  <q-list separator>
                    <q-item clickable v-ripple class="text-center">
                      <q-item-section>
                        <q-item-label><q-icon name="las la-crosshairs" size="56px" class="text-grey"/></q-item-label>
                        <q-item-label>触发关键字</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div class="q-mt-lg" v-if="sumMenu.type == '8'">
                <span class="q-pl-md" style="border-left:2px solid #3296fa">
                  关联小程序
                </span>
                <span class="q-ml-lg text-grey">
                  点击该菜单跳转到关联的小程序
                </span>
                <q-separator class="q-my-sm" />
                <div class="row q-mt-lg">
                  <div class="col-2">
                    APPID
                  </div>
                  <div class="col-8">
                    <q-input outlined bottom-slots v-model="idText" dense class="q-pb-none" placeholder="请确保小程序与公众号已关联，填写小程序的APPID">
                      <template v-slot:hint>
                        如何获取
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row q-mt-xl">
                  <div class="col-2">
                    页面
                  </div>
                  <div class="col-8">
                    <q-input outlined bottom-slots v-model="idText" dense class="q-pb-none" placeholder="请填写跳转页面的小程序访问路径">
                      <template v-slot:hint>
                        填写指引
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row q-mt-xl">
                  <div class="col-2">
                    APPID
                  </div>
                  <div class="col-8">
                    <q-input outlined bottom-slots v-model="idText" dense class="q-pb-none" placeholder="写入要跳转的链接">
                      <template v-slot:hint>
                        旧版微信客户端不支持小程序，用户点击菜单时会打开该网页
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center">
        <q-btn unelevated color="primary" label="保存" v-if="authorityMeta('save')" class="q-px-xl" @click="saveMenu()" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'customMenu',
  data () {
    return {
      menuData: [],
      currentSort: 3,
      group: '1',
      idText: '',
      options: [
        // {
        //   label: "发送消息",
        //   value: "1"
        // },
        {
          label: '跳转网页',
          value: 'view'
        },
        {
          label: '小程序',
          value: 'miniprogram'
        }
        // {
        //   label: "扫码",
        //   value: "3"
        // },
        // {
        //   label: "扫码（等待信息）",
        //   value: "4"
        // },
        // {
        //   label: "地理位置",
        //   value: "5"
        // },
        // {
        //   label: "拍照发图",
        //   value: "6"
        // },
        // {
        //   label: "拍照相册",
        //   value: "7"
        // },
        // {
        //   label: "相册发图",
        //   value: "8"
        // }
      ],
      sumMenu: {},
      normIndex: '',
      mainKey: 0
    }
  },
  mounted () {
    this.getItemData()
  },
  created () {},
  computed: {},
  methods: {
    changeShowData (data, $event) {
      data.name = $event
    },

    changeContentData (data, $event) {
      data.url = $event
    },

    active (index, item) {
      this.currentSort = index
      this.sumMenu = item
      this.mainKey = index
    },

    changeMenu (menu, mainKey, normIndex) {
      this.currentSort = mainKey
      this.mainKey = mainKey
      this.normIndex = normIndex
      this.sumMenu = menu
    },

    addMainMenu () {
      const menuArray = this.menuData
      const newlayout = {
        name: '菜单名称',
        type: 'view',
        url: '',
        sub_button: []
      }
      menuArray.push(newlayout)
      this.currentSort = menuArray.length - 1
      this.sumMenu = newlayout
    },

    addSubMenu (mainKey) {
      const sub_menu = {
        name: '子菜单名称',
        type: 'view',
        url: '',
        sub_button: [],
        key: this.menuData[mainKey].sub_button.length == 0 ? 0 : this.menuData[mainKey].sub_button.length,
        mainKey
      }
      this.menuData[mainKey].sub_button.push(sub_menu)

      this.sumMenu = sub_menu
    },

    deleteMenu (mainKey, itemKey) {
      if (itemKey) {
        setTimeout(() => {
          this.menuData[mainKey].sub_button.splice(itemKey, 1)
        }, 100)
      } else {
        setTimeout(() => {
          this.menuData.splice(mainKey, 1)
        }, 100)
      }
      this.sumMenu = {}
    },

    saveMenu () {
      this.addSidebar = false
      const obj = {
        ...this.menuData
      }
      this.$store
        .dispatch('wechatMenu/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '自定义菜单修改成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getItemData()
          } else {
            this.$q.notify({
              message: '保存失败',
              caption: res.data.errmsg.errmsg,
              icon: 'ion-close-circle-outline',
              color: 'red',
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
            position: 'top-right'
          })
        })
    },

    getItemData () {
      this.$store
        .dispatch('wechatMenu/getItemData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.menuData = res.data.data ? JSON.parse(res.data.data) : {}
          }
        })
        .catch((error) => {})
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

<style>
.change {
  border-right: 1px solid #e6e3e3;
  color: #979393;
  cursor: pointer;
}
.noChange {
  border: 1px solid rgb(48, 164, 218);
  color: rgb(48, 164, 218);
  cursor: pointer;
}
.active:hover {
  color: rgb(27, 26, 26);
  cursor: pointer;
}
.link:hover {
  color: #3296fa;
  cursor: pointer;
}
.foot-border {
  border-top: 1px solid #e6e3e3;
}
</style>
