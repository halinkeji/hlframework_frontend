<template>
  <q-page class="q-ma-sm">
    <q-card flat>
      <q-form ref="reqlyData" class="my-form">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-lg-6">
              <label for="gt_sort"> 规则名称 </label>
              <q-input
                outlined
                dense
                no-error-icon
                v-model.trim="reqlyData.name"
                placeholder="请输入规则名称"
                :rules="[val => (val && val.length > 0) || '请输入规则名称']"
              />
              <p>
                您可以给这组触发关键字规则起一个名字, 方便下次修改和查看
              </p>
            </div>
            <div class="col-12 col-lg-6">
              <label for="status"> 是否开启 </label>
              <div class="row">
                <div class="col-2">
                  <q-radio v-model="reqlyData.status" val="1" label="开启" />
                </div>
                <div class="col-2">
                  <q-radio v-model="reqlyData.status" val="2" label="关闭" />
                </div>
              </div>
            </div>
            <div class="col-12  col-lg-8">
              <div class="row">
                <div>
                  <label for="gt_name"> 回复优先级 </label>
                  <q-input
                    outlined
                    dense
                    no-error-icon
                    v-model.trim="reqlyData.displayorder"
                    placeholder="请输入回复优先级"
                    :rules="[
                      val => (val && val.length > 0) || '请设置回复优先级'
                    ]"
                  />
                  <p>
                    规则优先级，越大则越靠前，最大不得超过254
                  </p>
                </div>
              </div>
            </div>
            <div class="col-12  col-lg-6"></div>
          </div>

          <div class="row q-mt-md q-ml-xs">
            <q-btn-group>
              <q-btn
                color="primary"
                label="添加关键字"
                @click="addSpecification"
                unelevated
                icon="las la-plus-square"
              />
              <q-separator dark vertical />
            </q-btn-group>
          </div>

          <div
            class="row"
            v-for="(normItem, normIndex) in layoutItem"
            :key="normIndex"
          >
            <div class="col-md-6 col-12">
              <q-input
                v-model="normItem.content"
                outlined
                bottom-slots
                dense
                label="添加关键字"
                class="q-mt-md"
              >
                <!-- <template v-slot:append>
                  <q-btn
                    color="white"

                    unelevated
                    @click="addSubSpecification(normIndex)"
                    text-color="grey-8"
                    icon="las la-plus-square"
                  />
                </template> -->
                <template v-slot:append>
                  <div class="q-pl-none">
                    <q-icon
                      @click="deleteSpecification(normIndex)"
                      class="text-h6"
                      name="delete "
                    >
                    </q-icon>
                  </div>
                </template>
              </q-input>
            </div>
            <div class="col-5"></div>
          </div>
        </q-card-section>
        <div class="row q-gutter-sm q-mt-lg">
          <q-card flat bordered class="col-12 col-md-12">
            <q-tabs
              v-model="tab"
              class="bg-white q-mt-sm"
              active-color="primary"
              indicator-color="primary"
              align="left"
              content-class="text-grey-9"
              narrow-indicator
              dense
            >
              <q-tab name="mails" label="内容" />
              <q-tab name="image" label="图片" />
              <q-tab name="news" label="图文" />
              <q-tab name="movies" label="视频" />
              <q-tab name="voice" label="语音" />
              <q-tab name="api" label="自定义接口" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="mails">
                <q-input outlined label="内容" dense />
              </q-tab-panel>
              <q-tab-panel name="image">
                <div>
                  <q-img
                    @click="clickImage()"
                    :src="reqlyData.images"
                    width="100px"
                    height="100px"
                  >
                    <template v-if="!reqlyData.images">
                      <div
                        class="absolute-full flex flex-center bg-grey-3  text-dark"
                      >
                        暂无图片
                      </div>
                    </template>
                  </q-img>
                  <div class="q-pa-md">
                    <upload-img
                      v-if="uploadImgStatus"
                      @imageData="getImageData"
                      :multiple="false"
                      @closeUpload="closeUpload"
                    ></upload-img>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="news">
                <q-input outlined label="" dense />
              </q-tab-panel>

              <q-tab-panel name="movies">
                <q-input outlined label="" dense />
              </q-tab-panel>

              <q-tab-panel name="voice">
                <q-input outlined label="" dense />
              </q-tab-panel>
              <q-tab-panel name="api">
                <q-input outlined label="输入自定义接口" dense />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
        <div class="row q-mt-md">
          <q-space />
          <q-btn
            unelevated
            color="primary"
            @click="saveBut()"
            label="提交"
          />

          <q-btn
            class="q-ml-sm"
            unelevated
            color="grey"
            :to="{ name: 'wechatreply' }"
            label="返回"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>
<script>
export default {
  name: 'AddType',
  data () {
    return {
      uploadImgStatus: false,
      tab: 'mails',
      layoutItem: [],
      reqlyData: {
        name: '',
        displayorder: '',
        status: '0',
        module: 'reply',
        containtype: 'news'
      },
      images: '/',
      stop: false,
      imageData: false,
      mode: [
        { title: '可用', id: '1' },
        { title: '不可用', id: '2' }
      ]
    }
  },

  mounted () {},
  computed: {},
  created () {
    if (!this.$route.params.pid) {
      this.gt_pid = 0
    } else {
      this.gt_pid = this.$route.params.pid
    }
    if (this.$route.params.id > 0) {
      this.$store
        .dispatch('wechatRule/getItemData', this.$route.params.id)
        .then(res => {
          if (res.code == 200) {
            {
              this.reqlyData = res.data
              this.layoutItem = res.data.keyword
            }
          }
        })
    }
  },
  methods: {
    saveBut () {
      this.stop = true
      this.$refs.reqlyData.validate().then(success => {
        if (success) {
          const obj = {
            id: this.$route.params.id,
            ...this.reqlyData,
            layoutItem: this.layoutItem
          }
          this.$store
            .dispatch('wechatRule/setData', obj)
            .then(res => {
              if (res.code == 200) {
                if (this.$route.params.id > 0) {
                  this.$q.notify({
                    message: '修改自动回复信息成功',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'green'
                  })
                } else {
                  this.$q.notify({
                    message: '新增自动回复成功',
                    color: 'green',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
                this.$router.push({ name: 'wechatreply' })
              }
            })
            .catch(error => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    getImageData (v) {
      this.uploadImgStatus = false
      v.forEach(item => {
        const that = this
        this.reqlyData.gt_pictureUrl = item.path
      })
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    clickImage () {
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    // 添加
    addSpecification () {
      const layoutArray = this.layoutItem
      const newlayout = {
        content: '',
        layoutItem: []
      }
      layoutArray.push(newlayout)
    },
    // 添加
    addSubSpecification (mainKey) {
      this.layoutItem[mainKey].layoutItem.push({
        itemValue: ''
      })
    },
    // 删除
    deleteSpecification (mainKey) {
      setTimeout(() => {
        this.layoutItem.splice(mainKey, 1)
        setTimeout(() => {
          this.refreshSpecification()
        }, 100)
      }, 100)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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

<style lang="scss">
.hl_typr_image_err .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #e8f0fc;
  color: #909399;
  font-size: 14px;
}
</style>
