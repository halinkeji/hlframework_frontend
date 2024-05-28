<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-tabs v-model="tabKey" active-color="primary" dense indicator-color="primary" @input="changeTab" inline-label align="left" :breakpoint="0">
          <q-tab name="home" label="首页" icon="home" />
          <q-tab name="my" label="我的" icon="person" />
        </q-tabs>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white ">
        <div class="row fit ">
          <div class="col-6 q-px-xs row justify-center">
            <div class="col-6 q-pa-sm" v-if="tabKey == 'home'">
              <q-card flat bordered class="q-pb-md">
                <div class="text-center q-py-sm">
                  【首页】
                </div>
                <q-separator class="q-mb-sm" />
                <div class="row text-center">
                  <div class="col-3 q-mt-xs" v-for="(item, key) in currentPageConfig.home.body">
                    <q-icon :name="item.icon" size="26px" color="blue-9" />
                    <div class="text-caption text-grey-7 q-mt-sm">{{ item.label }}</div>
                  </div>
                </div>
              </q-card>
            </div>
            <div class="col-6 q-pa-sm" v-if="tabKey == 'my'">
              <q-card flat bordered>
                <div class="text-center q-py-sm">
                  【我的】
                </div>
                <q-separator />
                <q-list separator>
                  <q-item v-for="(item, key) in currentPageConfig.my.body" :key="key">
                    <q-item-section side>
                      <q-icon :name="item.icon" color="blue-9" size="20px" />
                    </q-item-section>
                    <q-item-section>{{ item.label }}</q-item-section>
                    <q-item-section side>
                      <div class="row items-center">
                        <q-icon name="las la-angle-right" size="12px" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </div>
          <div class="col-6 q-px-xs row full-height q-col-gutter-sm">
            <q-scroll-area class="fit full-height ">
              <q-list padding class="rounded-borders full-width">
                <q-item clickable :key="key" :v-ripple="true" v-for="(item, index, key) in bodyConfigData">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" color="primary" />
                  </q-item-section>
                  <!-- <q-item-section side>
                  <q-checkbox label="状态" v-model="item.status" :true-value="1" :false-value="0" />
                </q-item-section> -->
                  <q-item-section side>
                    <q-item-label lines="1"><q-input outlined dense v-model="item.label" label="名称"/></q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label lines="1"><q-input outlined dense v-model="item.icon" label="图标"/></q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      round
                      :color="currentPageCache.indexOf(item.router_name) > -1 ? 'negative' : 'primary'"
                      unelevated
                      @click="selectMenu(item)"
                      :icon="currentPageCache.indexOf(item.router_name) > -1 ? 'las la-minus-circle' : 'las la-plus-circle'"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
        <q-btn unelevated color="primary" label="保存" v-if="authorityMeta('save')" class="q-px-xl" @click="saveMenu()" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'customMenu',
  data() {
    return {
      headerConfigData: [],
      bodyConfigData: [],
      footConfigData: [],
      currentPageConfig: {
        home: {
          header: [],
          body: [],
        },
        my: {
          header: [],
          body: [],
        },
      },
      currentPageCache: [],
      configKey: 'customizePage',
      tabKey: 'home',
      defaultPageConfig: {
        home: {
          header: [],
          body: [],
        },
        my: {
          header: [],
          body: [],
        },
      },
    }
  },
  mounted() {
    this.getConfig()
  },
  created() {},
  computed: {},
  methods: {
    selectMenu(item) {
      if (this.currentPageCache.indexOf(item.router_name) > -1) {
        this.currentPageConfig[this.tabKey].body.splice(this.currentPageCache.indexOf(item.router_name), 1)
      } else {
        this.currentPageConfig[this.tabKey].body.push(item)
      }
      this.changeTab()
    },

    changeTab() {
      this.currentPageCache = []
      for (var i = 0; i < this.currentPageConfig[this.tabKey].body.length; i++) {
        this.currentPageCache.push(this.currentPageConfig[this.tabKey].body[i].router_name)
      }
    },

    saveMenu() {
      this.addSidebar = false
      const obj = {
        key: this.configKey,
        value: this.currentPageConfig,
      }
      this.$store
        .dispatch('wechatCustomize/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '自定义菜单修改成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
            })
            this.getConfig()
          } else {
            this.$q.notify({
              message: '保存失败',
              caption: res.data.errmsg.errmsg,
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right',
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right',
          })
        })
    },

    getConfig() {
      this.$store
        .dispatch('wechatCustomize/getItem', { key: this.configKey })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.headerConfigData = res.data && res.data.header_config ? res.data.header_config : []
            this.bodyConfigData = res.data && res.data.body_config ? res.data.body_config : []
            this.footConfigData = res.data && res.data.foot_config ? res.data.foot_config : []
            this.currentPageConfig = res.data && res.data.diy_config ? res.data.diy_config : this.defaultPageConfig
            this.changeTab()
          }
        })
        .catch((error) => {})
    },

    authorityMeta(key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
  },
}
</script>
