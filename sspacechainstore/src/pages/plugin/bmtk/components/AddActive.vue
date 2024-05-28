<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-mb-xs">
        <q-tabs v-model="activeName" dense indicator-color="primary" class="text-grey-8" align="left">
          <q-tab name="1" label="基础设置" />
          <q-tab name="2" label="营销设置" />
        </q-tabs>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white">
        <div style="overflow-y: scroll;" class="fit full-height">
          <q-form ref="bmtkDataRef" class="q-gutter-md">
            <div v-show="activeName == '1'">
              <!-- 第一行 -->
              <div class="row">
                <q-input class="col-12 col-md-6 q-mt-sm q-pr-md" label="请输入活动名称" outlined v-model="subData.bmt_name" dense :rules="[(val) => !!val || '活动名称是必须的']" />
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="购买价格"
                  outlined
                  v-model="subData.bmt_price"
                  dense
                  :rules="[(val) => /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/.test(val) || '请输入正确的价格']"
                />
              </div>
              <!-- 第二行 -->
              <div class="row">
                <q-select
                  v-model="subData.bmt_status"
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
                <q-select
                  v-model="subData.bmt_confirm_order"
                  outlined
                  dense
                  label="是否需要确认订单"
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
                  label="伪购数量"
                  outlined
                  v-model="subData.bmt_fake_buy_count"
                  dense
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请填写正确的伪购数量']"
                />
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="伪浏览量"
                  outlined
                  v-model="subData.bmt_fake_look"
                  dense
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请填写正确的伪浏览量']"
                />
              </div>
              <!-- 第五行 -->
              <div class="row">
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="限购次数"
                  outlined
                  v-model="subData.bmt_limit_buy_count"
                  dense
                  :rules="[(val) => !!val || '限购次数是必填项', (val) => /^[0-9]*[1-9][0-9]*$/.test(val) || '限购次数只能是大于0的正整数']"
                />
                <q-input
                  class="col-12 col-md-6 q-mt-sm q-pr-md"
                  label="单人限购"
                  outlined
                  v-model="subData.bmt_one_limit"
                  dense
                  :rules="[(val) => !!val || '单人限购是必填项', (val) => /^[0-9]*[1-9][0-9]*$/.test(val) || '单人限购只能是大于0的正整数']"
                />
              </div>
              <!-- 第六行 -->
              <div class="row">
                <div class="col-12 col-md-6 q-mt-sm q-pr-md">
                  <q-input outlined label="摘要" type="textarea" v-model="subData.bmt_summary" dense :rules="[(val) => !!val || '摘要是必须的']" />
                </div>
                <div class="col-12 col-md-6 q-mt-sm q-pr-md row">
                  <div class="col-5">
                    <hl-upload
                      :multiple="false"
                      :currentAttach="subData.coverImage"
                      @input="(val)=>{ $nextTick(()=>{ subData.bmt_cover_image = val })}"
                      currentDescription="建议尺寸比例1:1"
                      currentTitle="宣传图"
                    />
                  </div>
                  <div class="col-6">
                    <q-input outlined v-model="subData.bmt_background" label="背景颜色" :error="false" dense square>
                      <template v-slot:prepend>
                        <q-icon name="ion-color-palette" class="cursor-pointer">
                          <q-menu>
                            <q-color v-model="subData.bmt_background" class="q-ml-md full-width"> </q-color>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- 第七行 -->
              <div class="q-pr-md q-mt-sm">
                <hl-editor
                  @change="
                    (v) => {
                      subData.bmt_activity_content = v
                    }
                  "
                  :content="subData.bmt_activity_content"
                  :minHeight="$q.screen.height * 0.4"
                  titleText="活动介绍"
                ></hl-editor>
              </div>

              <div class="q-mb-xs">
                <hl-editor
                  @change="
                    (v) => {
                      subData.bmt_publicize_content = v
                    }
                  "
                  :content="subData.bmt_publicize_content"
                  :minHeight="$q.screen.height * 0.4"
                  titleText="宣传介绍"
                ></hl-editor>
              </div>
            </div>

            <div v-show="activeName == '2'">

              <hl-give-data-bind
                @setCouponData="setCouponData"
                @setGoodsCountData="setGoodsCountData"
                @setGoodsTimeData="setGoodsTimeData"
                ref="upgradeBindRef"
              />

            </div>

            <coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
            <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"></hl-select-count-group>
            <hl-select-time-group ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup"> </hl-select-time-group>
          </q-form>
        </div>
      </div>

      <div class="col-shrink bg-white q-py-sm q-gutter-sm text-center q-mt-xs">
        <q-btn unelevated class="q-px-xl" color="primary" @click="saveData" label="提交"  />
        <q-btn class="q-px-xl" unelevated color="grey" :to="{ name: 'bmtk' }" label="返回" />
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'AddActive',
  components: {

  },
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
        bmt_name: '',
        bmt_status: '1',
        bmt_confirm_order: '1',
        bmt_price: '',
        bmt_limit_buy_count: 1,
        bmt_one_limit: 1,
        bmt_fake_look: 0,
        bmt_fake_buy_count: 0,
        bmt_start_time: '',
        bmt_end_time: '',
        bmt_background: '#ffffff',
        bmt_summary: '',
        bmt_cover_image: ''
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
      ]
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
      this.$store.dispatch('bmtk/getItemData', this.$route.query.id).then((res) => {
        if (res.code == 200) {
          const data = res.data.info
          this.startTime = this.$q_date.formatDate(data.bmt_start_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          this.endTime = this.$q_date.formatDate(data.bmt_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          this.subData = data

          if (res.data && res.data.coupon && res.data.coupon.length > 0) {
            this.selectedCouponData = res.data.coupon
            this.$refs.upgradeBindRef.setBindGiveCoupon(this.selectedCouponData)
          }
          if (res.data && res.data.count && res.data.count.length > 0) {
            this.selectedCountData = res.data.count
            this.$refs.upgradeBindRef.setBindGiveGoodsCount(this.selectedCountData)
          }
          if (res.data && res.data.timing && res.data.timing.length > 0) {
            this.selectedGoodsTimingData = res.data.timing
            this.$refs.upgradeBindRef.setBindGiveGoodsTime(this.selectedGoodsTimingData)
          }
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.bmtkDataRef.validate().then((success) => {
        if (success) {
          if (!this.subData.bmt_publicize_content) {
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
          } else if (!this.subData.bmt_activity_content) {
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
          subData.bmt_end_time = this.endTime
          subData.bmt_start_time = this.startTime
          subData.bmt_end_time = subData.bmt_end_time ? this.$q_date.formatDate(subData.bmt_end_time, 'X') : Math.ceil(new Date().getTime() / 1000)
          subData.bmt_start_time = subData.bmt_start_time ? this.$q_date.formatDate(subData.bmt_start_time, 'X') : Math.ceil(new Date().getTime() / 1000)
          const obj = {
            id: this.$route.query.id,
            ...subData,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            TimingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('bmtk/setData', obj)
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
                this.$router.push({ name: 'bmtk' })
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
      this.subData.bmt_cover_image = ''
    },

    setCouponData (val) {
      this.selectedCouponData = val
    },
    setGoodsCountData (val) {
      this.selectedCountData = val
    },
    setGoodsTimeData (val) {
      this.selectedGoodsTimingData = val
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
