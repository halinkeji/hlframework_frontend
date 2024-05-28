<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white">
      <div style="overflow-y: scroll;" class="fit full-height">
        <q-form ref="addProjectRef" class="row q-pa-sm q-gutter-sm">
          <div class="col-7">
            <q-input outlined label="注册链接" dense v-model="regUrl" readonly lazy-rules>
              <template v-slot:append>
                <q-btn round color="primary" dense flat @click="copyRegUrl(regUrl)" icon="las la-copy" />
              </template>
            </q-input>
          </div>

          <div class="col-7">
            <q-input outlined label="联系电话" dense v-model="configData.pic_phone_number" lazy-rules />
          </div>

          <div class="col-7">
            <q-input outlined label="注册页title" dense v-model="configData.pic_page_reg" lazy-rules />
          </div>
          <div class="col-7">
            <q-input outlined label="登录页title" dense v-model="configData.pic_page_login" lazy-rules />
          </div>
          <div class="col-7">
            <q-input outlined label="授权页title" dense v-model="configData.pic_page_auth" lazy-rules />
          </div>
          <div class="col-7">
            <q-input outlined label="信息编辑页title" dense v-model="configData.pic_page_edit" lazy-rules />
          </div>
          <div class="col-7">
            <q-input outlined label="勾选展示页title" dense v-model="configData.pic_page_role" lazy-rules />
          </div>

          <div class="col-7">
            <q-input outlined label="二维码下载页title" dense v-model="configData.pic_page_code" lazy-rules />
          </div>

          <div class="col-7">
            <q-input outlined label="信息展示页title" dense v-model="configData.pic_page_show" lazy-rules />
          </div>

          <div class="col-12 row">
            <div class="col-2 text-left">
              <div class="text-caption">提示图片</div>
              <q-img :src="configData.pic_picture" width="100px" height="100px">
                <template v-if="!configData.pic_picture">
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
                <q-btn
                  round
                  size="md"
                  color="red"
                  v-else
                  :ripple="false"
                  flat
                  class="absolute-top-right"
                  icon="delete_forever"
                  @click="configData.pic_picture = ''"
                ></q-btn>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
              </q-img>
              <div class="q-mt-sm">
                <q-btn unelevated color="primary" @click="clickImage('pic_picture')" label="上传图片" />
              </div>
            </div>
            <div class="col-2 text-left">
              <div class="text-caption">Logo</div>
              <q-img :src="configData.pic_logo" width="100px" height="100px">
                <template v-if="!configData.pic_logo">
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
                <q-btn
                  round
                  size="md"
                  color="red"
                  v-else
                  :ripple="false"
                  flat
                  class="absolute-top-right"
                  icon="delete_forever"
                  @click="configData.pic_logo = ''"
                ></q-btn>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
              </q-img>
              <div class="q-mt-sm">
                <q-btn unelevated color="primary" @click="clickImage('pic_logo')" label="上传图片" />
              </div>
            </div>
            <div class="col-2 text-left">
              <div class="text-caption">注册页图片</div>
              <q-img :src="configData.pic_reg_img" width="100px" height="100px">
                <template v-if="!configData.pic_reg_img">
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
                <q-btn
                  round
                  size="md"
                  color="red"
                  v-else
                  :ripple="false"
                  flat
                  class="absolute-top-right"
                  icon="delete_forever"
                  @click="configData.pic_reg_img = ''"
                ></q-btn>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
              </q-img>
              <div class="q-mt-sm">
                <q-btn unelevated color="primary" @click="clickImage('pic_reg_img')" label="上传图片" />
              </div>
            </div>
            <div class="col-2 text-left">
              <div class="text-caption">登录页图片</div>
              <q-img :src="configData.pic_login_img" width="100px" height="100px">
                <template v-if="!configData.pic_login_img">
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
                <q-btn
                  round
                  size="md"
                  color="red"
                  v-else
                  :ripple="false"
                  flat
                  class="absolute-top-right"
                  icon="delete_forever"
                  @click="configData.pic_login_img = ''"
                ></q-btn>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                    <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                  </div>
                </template>
              </q-img>
              <div class="q-mt-sm">
                <q-btn unelevated color="primary" @click="clickImage('pic_login_img')" label="上传图片" />
              </div>
            </div>
          </div>

          <div class="col-8">
            <hl-editor
              @change="
                (v) => {
                  configData.pic_serve_caption = v;
                }
              "
              :content="configData.pic_serve_caption"
              :minHeight="$q.screen.height * 0.4"
              titleText="服务说明"
            ></hl-editor>
          </div>

        </q-form>
      </div>
    </div>
    <upload-img v-if="uploadImgStatus" @imageData="getImageData" @closeUpload="closeUpload"></upload-img>
    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" class="q-px-xl" label="保存" :disable="addButtonDisabled" @click="setData" />
    </div>
  </div>
</template>
<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'InfoqrConfig',
  data () {
    return {
      addButtonDisabled: false,
      time_start: '',
      time_end: '',
      week_limit: [],
      configData: {
        pic_status: '1',
        pic_phone_number: '',
        pic_serve_caption: '',
        pic_open_field: [],
        pic_picture: '',
        pic_logo: '',
        pic_reg_img: '',
        pic_login_img: '',
        pic_page_reg: '',
        pic_page_login: '',
        pic_page_auth: '',
        pic_page_edit: '',
        pic_page_role: '',
        pic_page_code: '',
        pic_page_show: ''
      },
      uploadImgStatus: false,
      imgField: ''
    }
  },
  mounted () {},
  created () {
    this.getConfigItem()
  },
  computed: {
    regUrl () {
      return 'http://q.otlichina.com/'
    }
  },
  methods: {
    delImage () {
      this.configData.pic_picture = ''
    },
    clickImage (filed) {
      this.imgField = filed
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    getConfigItem () {
      this.addButtonDisabled = false
      this.$store
        .dispatch('infoqr/getItemData')
        .then((res) => {
          if (res.code == 200) {
            this.configData =
              res.data && res.data.id
                ? res.data
                : {
                    pic_status: '1',
                    pic_phone_number: '',
                    pic_serve_caption: '',
                    pic_open_field: [],
                    pic_picture: '',
                    pic_logo: '',
                    pic_reg_img: '',
                    pic_login_img: ''
                  }
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    setData () {
      this.$refs.addProjectRef.validate().then((success) => {
        if (success) {
          const data = {
            id: this.configData.id,
            ...this.configData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('infoqr/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存配置成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getConfigItem()
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
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    copyRegUrl (val) {
      copyToClipboard(val)
        .then(() => {
          this.$q.notify({
            message: '成功',
            caption: '复制成功',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green'
          })
        })
        .catch(() => {
          // fail
        })
    },
    getImageData (v) {
      const that = this
      this.uploadImgStatus = false
      that.configData[this.imgField] = v[0].base_url
    },
    closeUpload (v) {
      this.imgField = ''
      this.uploadImgStatus = false
    }
  }
}
</script>
