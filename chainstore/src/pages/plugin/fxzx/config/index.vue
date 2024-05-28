<template>
  <q-page class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-mb-xs">
        <q-icon color="primary" name="las la-square-full" class="q-pr-xs" size="sm" /> <span class="text-h6">基础设置</span>
      </div>
      <div class="col-shrink full-height bg-grey-3">
        <q-scroll-area class="fit full-height">
          <q-card flat class="q-pa-md ">
            <q-form ref="configRef">
              <div class="row">
                <div class="q-pl-md col-5">
                  <div>
                    <q-select outlined dense v-model="configData.pfc_level" :options="levelOptions" label="分销层级" emit-value map-options />
                  </div>
                  <div class="q-mt-xs q-ml-sm ">
                    <div v-if="configData.pfc_level == -1" class="text-red">
                      分销层级关闭时， 分销系统为不可用状态。关闭之后不产生佣金
                    </div>
                    <div class="text-grey" v-else>
                      恭喜您，您的商城分销体系为
                      <span v-if="configData.pfc_level == 1">一级分销，</span>
                      <span v-else-if="configData.pfc_level == 2">二级分销，</span>
                      <span v-else-if="configData.pfc_level == 3">三级分销，</span>
                      默认佣金比例请到【分销等级】进行设置
                    </div>
                  </div>
                  <div class="q-mt-xs" v-if="configData.pfc_level > 0">
                    <q-input outlined v-model="configData.pfc_one_name" dense label="自定义一级名称" />
                  </div>

                  <div class="q-mt-xs" v-if="configData.pfc_level > 1">
                    <q-input outlined v-model="configData.pfc_two_name" dense label="自定义二级名称" />
                  </div>
                  <div class="q-mt-xs" v-if="configData.pfc_level > 2">
                    <q-input outlined v-model="configData.pfc_three_name" dense label="自定义三级名称" />
                  </div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      clearable
                      v-model="configData.pfc_form_id"
                      :options="formFieldOptions"
                      label="请选择申请分销商关联表单"
                      option-value="id"
                      option-label="pff_form_name"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-sm">
                    <q-select outlined dense v-model="configData.pfc_is_check" :options="checkOptions" label="是否需要审核" emit-value map-options />
                  </div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      v-model="configData.pfc_upgrade_method"
                      :options="upgradeOptions"
                      label="升级方式"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-xs q-ml-sm text-grey">
                    实时升级：当满足升级条件时立刻升级到对应的等级。
                    <div class="text-red">注:启用该设置时会占用系统大量内存导致请求超时，请谨慎设置。</div>
                  </div>
                  <div class="q-ml-sm text-grey">
                    延时升级：当满足升级条件时系统会自动升级到对应的等级，但是有一定的延时推迟。
                    <div class="text-red">注:启用该设置时需要平台开启异步队列功能。</div>
                  </div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      v-model="configData.pfc_in_buy_status"
                      :options="buyStatusOptions"
                      label="内购状态"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-xs q-ml-sm text-grey">
                    开启分销内购，分销商自己购买商品，享受一级佣金，上级享受二级佣金，上上级享受三级佣金
                  </div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      v-model="configData.pfc_settlement_mode"
                      :options="settlementModeOptions"
                      label="结算方式"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-sm" v-if="configData.pfc_settlement_mode == 2">
                    <q-input
                      outlined
                      dense
                      v-model="configData.pfc_settlement_days"
                      label="结算天数"
                      :rules="[(val) => (!val ? '请输入结算天数' : (!!val && /^[1-9]*$/.test(val)) || '请输入大于0的整数')]"
                    />
                  </div>
                  <div class="q-mt-xs q-ml-sm text-grey">
                    佣金立即到账：
                    <span>佣金立刻就会到账。</span>
                    <div class="text-red">注:如有退货等相关操作，已送的权益不可逆回</div>
                  </div>
                  <div class="q-mt-xs q-ml-sm text-grey">
                    自定义天数到账：
                    <div class="text-red">注:佣金需等待自定义天数过后方可结算。</div>
                  </div>
                  <div class="q-mt-sm">

                    <hl-upload
                      :multiple="false"
                      :currentAttach="configData.coverImage"
                      @input="(val)=>{ $nextTick(()=>{ configData.pfc_cover_image = val })}"
                      currentDescription="建议尺寸宽度为750*250"
                      currentTitle="申请分销商页面展示的图片"
                    />

                    </div>
                    <div class="q-mt-sm">
                    <hl-upload
                      :multiple="false"
                      :currentAttach="configData.posterImage"
                      @input="(val)=>{ $nextTick(()=>{ configData.pfc_poster = val })}"
                      currentTitle="推广二维码的海报"
                    />

                    <div class="q-mt-sm text-grey">
                      <span> 推广二维码的海报,尺寸建议宽度为600*800</span>
                      <span class="q-pl-md text-caption text-grey">
                        <q-icon name="help_outline" size="16px">
                          <q-tooltip content-class="bg-white shadow-4">
                            <div>
                              <q-img src="/poster.png" width="200px" height="400px" />
                            </div>
                          </q-tooltip>
                        </q-icon>
                        示例
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </q-form>
          </q-card>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
        <q-btn unelevated label="保存" class="q-px-lg" color="primary" @click="setData" v-if="authorityMeta('saveConfig')" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'fxzxConfig',
  components: {},
  data () {
    return {
      multiple: false,
      configData: {
        pfc_form_id: '',
        pfc_is_check: -1,
        pfc_level: -1,
        pfc_upgrade_method: 1,
        pfc_in_buy_status: -1,
        pfc_settlement_mode: 1,
        pfc_settlement_days: '',
        pfc_cover_image: '',
        pfc_poster: '',
        pfc_one_name: '一级',
        pfc_two_name: '二级',
        pfc_three_name: '三级'
      },
      formFieldOptions: [],
      levelOptions: [
        { label: '关闭', value: -1 },
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 }
      ],
      checkOptions: [
        { label: '需要审核', value: -1 },
        { label: '不需要审核', value: 1 }
      ],
      upgradeOptions: [
        { label: '实时升级', value: 1 },
        { label: '延时升级', value: 2 }
      ],
      buyStatusOptions: [
        { label: '关闭', value: -1 },
        { label: '开启', value: 1 }
      ],
      settlementModeOptions: [
        { label: '立即到账', value: 1 },
        { label: '自定义天数到账', value: 2 }
      ]
    }
  },
  created () {
    this.getFormFieldList()
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getFormFieldList () {
      this.$store
        .dispatch('formfield/getFormFieldFormList')
        .then((res) => {
          if (res.code == 200) {
            this.formFieldOptions = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getList () {
      this.$store
        .dispatch('fxzx/getConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : this.configData
            this.configData.pfc_level = res.data.pfc_level ? parseInt(res.data.pfc_level) : ''
            this.configData.pfc_upgrade_method = res.data.pfc_upgrade_method ? parseInt(res.data.pfc_upgrade_method) : ''
            this.configData.pfc_in_buy_status = res.data.pfc_in_buy_status ? parseInt(res.data.pfc_in_buy_status) : ''
            this.configData.pfc_settlement_mode = res.data.pfc_settlement_mode ? parseInt(res.data.pfc_settlement_mode) : ''
            this.configData.pfc_is_check = res.data.pfc_is_check ? parseInt(res.data.pfc_is_check) : ''
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setData () {
      this.$refs.configRef.validate().then((success) => {
        if (success) {
          if (!this.configData.pfc_cover_image) {
            this.$q.notify({
              message: '提示',
              caption: '请设置申请分销商页面展示的图片',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          if (!this.configData.pfc_poster) {
            this.$q.notify({
              message: '提示',
              caption: '请设置推广二维码的海报',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          const data = {
            ...this.configData
          }
          this.$store
            .dispatch('fxzx/setConfigData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    delImage (val) {
      if (val == 'show') {
        this.configData.pfc_cover_image = ''
      }
      if (val == 'poster') {
        this.configData.pfc_poster = ''
      }
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
