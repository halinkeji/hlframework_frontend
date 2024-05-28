<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        慈善活动
      </div>

      <div class="col-shrink q-pa-sm full-height bg-grey-2">
        <div style="overflow-y: scroll;" class="fit full-height">
          <q-card flat bordered class="q-pa-md q-my-sm" square>
            <q-form ref="csjzDataRef" class="q-gutter-md">
              <!-- 第一行 -->
              <div class="row">
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="请输入活动名称"
                  outlined
                  v-model="subData.pca_name"
                  dense
                  :rules="[(val) => !!val || '活动名称是必须的']"
                />
                <q-select
                  v-model="subData.pca_status"
                  outlined
                  dense
                  label="活动状态"
                  :options="activeStatus"
                  option-value="value"
                  option-label="label"
                  :error="false"
                  emit-value
                  map-options
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                />
              </div>

              <!-- 第三行 -->
              <div class="row">
                <div class="col-12 col-md-6 q-mt-sm q-pr-md">
                  <q-input outlined v-model="startTime" label="活动开始时间" dense square readonly :rules="[(val) => !!val || '请输入活动开始时间']">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6 q-mt-sm q-pr-md">
                  <q-input outlined v-model="endTime" label="活动结束时间" dense square readonly :rules="[(val) => !!val || '请输入活动开始时间']">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-menu>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                          <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <!-- 第四行 -->
              <div class="row">
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="虚拟捐赠人数"
                  outlined
                  v-model="subData.pca_fake_buy_count"
                  dense
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请填写正确的伪购数量']"
                />
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="虚拟浏览量"
                  outlined
                  v-model="subData.pca_fake_look"
                  dense
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请填写正确的伪浏览量']"
                />
              </div>
              <!-- 第五行 -->
              <div class="row">
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="总限捐人数"
                  outlined
                  v-model="subData.pca_limit_buy_count"
                  dense
                  :rules="[(val) => !!val || '总限捐人数是必填项', (val) => /^[0-9]*[1-9][0-9]*$/.test(val) || '总限捐人数只能是大于0的正整数']"
                />
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="单人限捐"
                  outlined
                  v-model="subData.pca_one_limit"
                  dense
                  :rules="[(val) => !!val || '单人限捐是必填项', (val) => /^[0-9]*[1-9][0-9]*$/.test(val) || '单人限捐只能是大于0的正整数']"
                />
              </div>

              <div class="row">
                <div class="col-12 col-md-4 q-px-xs">
                  <q-input outlined v-model="subData.pca_background" label="背景颜色" :error="false" dense>
                    <template v-slot:prepend>
                      <q-icon name="ion-color-palette" class="cursor-pointer">
                        <q-menu>
                          <q-color v-model="subData.pca_background" class="q-ml-md full-width"> </q-color>
                        </q-menu>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4 q-px-xs">
                  <q-input
                    class="col-12 col-md-6 q-pr-md"
                    label="移动端左侧按钮文字"
                    outlined
                    v-model="subData.pca_left_button_text"
                    dense
                    :rules="[(val) => !!val || '移动端左侧按钮文字是必须的']"
                  />
                </div>
                <div class="col-12 col-md-4 q-px-xs">
                  <q-input
                    class="col-12 col-md-6 q-pr-md"
                    label="移动端右侧按钮文字"
                    outlined
                    v-model="subData.pca_right_button_text"
                    dense
                    :rules="[(val) => !!val || '移动端右侧按钮文字是必须的']"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-2">
                  <div class="row">
                    <q-img
                      class="q-mt-sm q-ml-md"
                      :src="`${$q.localStorage.getItem('onlystore_system_local').attach_url}` + subData.pca_cover_image"
                      width="100px"
                      height="100px"
                    >
                      <template v-if="!subData.pca_cover_image">
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
                        @click="subData.pca_cover_image = ''"
                      >
                      </q-btn>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                          <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                        </div>
                      </template>
                    </q-img>
                  </div>
                  <div class="q-mt-sm q-ml-lg">
                    <div class="text-caption text-grey">宣传图 建议尺寸比例1:1</div>
                    <q-btn unelevated color="primary" @click="clickImage('pca_cover_image')" label="上传图片" />
                  </div>
                </div>
                <div class="col-2">
                  <div class="row">
                    <q-img
                      class="q-mt-sm q-ml-md"
                      :src="`${$q.localStorage.getItem('onlystore_system_local').attach_url}` + subData.pca_cert_bg"
                      width="100px"
                      height="100px"
                    >
                      <template v-if="!subData.pca_cert_bg">
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
                        @click="subData.pca_cert_bg = ''"
                      >
                      </q-btn>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                          <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                        </div>
                      </template>
                    </q-img>
                  </div>
                  <div class="q-mt-sm q-ml-lg">
                    <div class="text-caption text-grey">证书背景图 建议尺寸比例1:4</div>
                    <q-btn unelevated color="primary" @click="clickImage('pca_cert_bg')" label="上传图片" />
                  </div>
                </div>
                <div class="col-2">
                  <div class="row">
                    <q-img
                      class="q-mt-sm q-ml-md"
                      :src="`${$q.localStorage.getItem('onlystore_system_local').attach_url}` + subData.pca_cert_publicity"
                      width="100px"
                      height="100px"
                    >
                      <template v-if="!subData.pca_cert_publicity">
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
                        @click="subData.pca_cert_publicity = ''"
                      >
                      </q-btn>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                          <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                        </div>
                      </template>
                    </q-img>
                  </div>
                  <div class="q-mt-sm q-ml-lg">
                    <div class="text-caption text-grey">证书宣传语 建议尺寸比例3:1</div>
                    <q-btn unelevated color="primary" @click="clickImage('pca_cert_publicity')" label="上传图片" />
                  </div>
                </div>
                <div class="col-2">
                  <div class="row">
                    <q-img
                      class="q-mt-sm q-ml-md"
                      :src="`${$q.localStorage.getItem('onlystore_system_local').attach_url}` + subData.pca_cert_seal"
                      width="100px"
                      height="100px"
                    >
                      <template v-if="!subData.pca_cert_seal">
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
                        @click="subData.pca_cert_seal = ''"
                      >
                      </q-btn>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                          <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                        </div>
                      </template>
                    </q-img>
                  </div>
                  <div class="q-mt-sm q-ml-lg">
                    <div class="text-caption text-grey">证书公章 建议尺寸比例1:1</div>
                    <q-btn unelevated color="primary" @click="clickImage('pca_cert_seal')" label="上传图片" />
                  </div>
                </div>
                <div class="col-2">
                  <div class="row">
                    <q-img
                      class="q-mt-sm q-ml-md"
                      :src="`${$q.localStorage.getItem('onlystore_system_local').attach_url}` + subData.pca_cert_title"
                      width="100px"
                      height="100px"
                    >
                      <template v-if="!subData.pca_cert_title">
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
                        @click="subData.pca_cert_title = ''"
                      >
                      </q-btn>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                          <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                        </div>
                      </template>
                    </q-img>
                  </div>
                  <div class="q-mt-sm q-ml-lg">
                    <div class="text-caption text-grey">活动单位名称 建议尺寸比例2:1</div>
                    <q-btn unelevated color="primary" @click="clickImage('pca_cert_title')" label="上传图片" />
                  </div>
                </div>
              </div>
              <upload-img v-if="uploadImgStatus" @imageData="getImageData" :multiple="multiple" @closeUpload="closeUpload"></upload-img>
              <!-- 第六行 -->
              <div class="row">
                <div class="col-12 col-md-6 q-mt-sm q-pr-md">
                  <q-input
                    outlined
                    label="摘要"
                    rows="2"
                    type="textarea"
                    v-model="subData.pca_summary"
                    dense
                    :rules="[(val) => !!val || '摘要是必须的']"
                  />
                </div>
                <div class="col-12 col-md-6 q-mt-sm q-pr-md row"></div>
              </div>

              <!-- 第七行 -->
              <div class="q-pr-md q-mt-sm">

                <hl-editor
                  @change="
                    (v) => {
                      subData.pca_activity_content = v;
                    }
                  "
                  :content="subData.pca_activity_content"
                  titleText="活动介绍"
                   :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>

              <div class="q-mb-xs">

                <hl-editor
                  @change="
                    (v) => {
                      subData.pca_publicize_content = v;
                    }
                  "
                  :content="subData.pca_publicize_content"
                  titleText="宣传介绍"
                   :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>
            </q-form>
          </q-card>
        </div>
      </div>
      <div class="col-shrink bg-white row q-pb-md q-gutter-sm text-center">
        <q-btn unelevated class="q-px-xl" color="primary" @click="saveData" label="提交" />
        <q-btn class="q-px-xl" unelevated color="grey" :to="{ name: 'csjz' }" label="返回" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AddActive',
  components: {},
  data () {
    return {
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponIdData: [],
      startTime: '',
      endTime: '',
      activeName: '1',
      subData: {
        pca_name: '',
        pca_status: '1',
        pca_confirm_order: '1',
        pca_price: '',
        pca_limit_buy_count: 1,
        pca_one_limit: 1,
        pca_fake_look: 0,
        pca_fake_buy_count: 0,
        pca_start_time: '',
        pca_end_time: '',
        pca_background: '#ffffff',
        pca_summary: '',
        pca_cover_image: '',
        pca_left_button_text: '',
        pca_right_button_text: ''
      },
      multiple: false,
      uploadImgStatus: false,
      activeStatus: [
        {
          value: '1',
          label: '开启'
        },
        {
          value: '0',
          label: '关闭'
        }
      ],
      setFiled: ''
    }
  },

  mounted () {},
  created () {
    if (this.$route.query.id) {
      this.getItem()
    }
  },
  computed: {},
  methods: {
    //   获取单条
    getItem () {
      this.$store.dispatch('csjz/getItemData', this.$route.query.id).then((res) => {
        if (res.code == 200) {
          const data = res.data
          this.startTime = this.$q_date.formatDate(data.pca_start_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          this.endTime = this.$q_date.formatDate(data.pca_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          this.subData = data
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.csjzDataRef.validate().then((success) => {
        if (success) {
          if (!this.subData.pca_publicize_content) {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: '请输入宣传介绍',
              color: 'red'
            })
            this.activeName = '1'
            return ''
          } else if (!this.subData.pca_activity_content) {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: '请输入活动介绍',
              color: 'red'
            })
            this.activeName = '1'
            return ''
          }
          const subData = this.subData
          subData.pca_end_time = this.endTime
          subData.pca_start_time = this.startTime
          subData.pca_end_time = subData.pca_end_time ? this.$q_date.formatDate(subData.pca_end_time, 'X') : Math.ceil(new Date().getTime() / 1000)
          subData.pca_start_time = subData.pca_start_time
            ? this.$q_date.formatDate(subData.pca_start_time, 'X')
            : Math.ceil(new Date().getTime() / 1000)
          const obj = {
            id: this.$route.query.id,
            ...subData,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            TimingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('csjz/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}活动信息成功`,
                  color: 'green'
                })
                this.$router.push({ name: 'csjz' })
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
        }
      })
    },
    delImage () {
      this.subData.pca_cover_image = ''
    },

    // 图片上传
    getImageData (v) {
      this.uploadImgStatus = false
      const that = this
      _.forEach(v, function (value, key) {
        that.subData[that.setFiled] = value.path
      })
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    clickImage (filed) {
      this.setFiled = filed
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
