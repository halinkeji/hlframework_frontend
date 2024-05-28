<template>
  <q-page class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础设置
      </div>
      <div class="col-shrink full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-card flat class="q-pa-md">
            <q-form ref="configRef">
              <div class="row">
                <div class="q-pl-md col-5">
                  <div>
                    <q-select outlined dense v-model="configData.pmc_level" :options="levelOptions" label="分佣层级" emit-value map-options />
                  </div>
                  <div class="q-mt-xs q-ml-sm">
                    <div v-if="configData.pmc_level == -1" class="text-red">分佣层级关闭时， 分佣系统为不可用状态。关闭之后不产生佣金</div>
                    <div class="text-grey" v-else>
                      恭喜您，您的商城分佣体系为
                      <span v-if="configData.pmc_level == 1">一级分佣，</span>
                      <span v-else-if="configData.pmc_level == 2">二级分佣，</span>
                      <span v-else-if="configData.pmc_level == 3">三级分佣，</span>
                      默认佣金比例请到【分佣等级】进行设置
                    </div>
                  </div>
                  <div class="q-mt-xs" v-if="configData.pmc_level > 0">
                    <q-input outlined v-model="configData.pmc_one_name" dense label="自定义一级名称" />
                  </div>

                  <div class="q-mt-xs" v-if="configData.pmc_level > 1">
                    <q-input outlined v-model="configData.pmc_two_name" dense label="自定义二级名称" />
                  </div>
                  <div class="q-mt-xs" v-if="configData.pmc_level > 2">
                    <q-input outlined v-model="configData.pmc_three_name" dense label="自定义三级名称" />
                  </div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      clearable
                      v-model="configData.pmc_form_id"
                      :options="formFieldOptions"
                      label="请选择申请分佣商关联表单"
                      option-value="id"
                      option-label="pff_form_name"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-sm">
                    <q-select outlined dense v-model="configData.pmc_is_check" :options="checkOptions" label="是否需要审核" emit-value map-options />
                  </div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      v-model="configData.pmc_upgrade_method"
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
                      v-model="configData.pmc_in_buy_status"
                      :options="buyStatusOptions"
                      label="内购状态"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-xs q-ml-sm text-grey">开启分佣内购，分佣商自己购买商品，享受一级佣金，上级享受二级佣金，上上级享受三级佣金</div>
                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      v-model="configData.pmc_settlement_mode"
                      :options="settlementModeOptions"
                      label="结算方式"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-sm" v-if="configData.pmc_settlement_mode == 2">
                    <q-input
                      outlined
                      dense
                      v-model="configData.pmc_settlement_days"
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
                      @input="(val)=>{ $nextTick(()=>{ configData.pmc_cover_image = val })}"
                    />

                    <div class="q-mt-sm text-grey">申请分佣商页面展示的图片,尺寸建议宽度为750*250</div>

                  </div>
                  <div class="q-mt-sm">
                    <hl-upload
                      :multiple="false"
                      :currentAttach="configData.posterImage"
                      @input="(val)=>{ $nextTick(()=>{ configData.pmc_poster = val })}"
                    />

                    <div class="q-mt-sm text-grey">
                      <span> 推广二维码的海报,尺寸建议宽度为600*800</span>
                      <span class="q-pl-md text-caption text-grey">
                        <q-icon name="help_outline" size="16px">
                          <q-tooltip content-class="bg-white shadow-4">
                            <div>
                              <q-img src="/m/oneyouka/plugin/poster.png" width="200px" height="400px" />
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
        <q-btn unelevated label="保存" class="q-px-lg" color="primary" @click="setData" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'marketConfig',
  components: {},
  data () {
    return {
      multiple: false,

      configData: {
        pmc_form_id: '',
        pmc_is_check: -1,
        pmc_level: -1,
        pmc_upgrade_method: 1,
        pmc_in_buy_status: -1,
        pmc_settlement_mode: 1,
        pmc_settlement_days: '',
        pmc_cover_image: '',
        pmc_poster: '',
        pmc_one_name: '一级',
        pmc_two_name: '二级',
        pmc_three_name: '三级'
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
        .dispatch('market/getConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : this.configData
            this.configData.pmc_level = res.data ? parseInt(res.data.pmc_level) : ''
            this.configData.pmc_upgrade_method = res.data ? parseInt(res.data.pmc_upgrade_method) : ''
            this.configData.pmc_in_buy_status = res.data ? parseInt(res.data.pmc_in_buy_status) : ''
            this.configData.pmc_settlement_mode = res.data ? parseInt(res.data.pmc_settlement_mode) : ''
            this.configData.pmc_is_check = res.data ? parseInt(res.data.pmc_is_check) : ''
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
          if (!this.configData.pmc_cover_image) {
            this.$q.notify({
              message: '提示',
              caption: '请设置申请分佣商页面展示的图片',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          if (!this.configData.pmc_poster) {
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
            .dispatch('market/setConfigData', data)
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
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    }

  }
}
</script>
