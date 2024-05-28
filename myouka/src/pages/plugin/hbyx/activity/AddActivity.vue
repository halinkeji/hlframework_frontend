<template>
  <q-dialog @hide="hideNowPage" v-model="ruleDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pa-sm text-subtitle2">
          <div class="text-subtitle1">{{ currentRuleId ? '修改' : '新增' }}活动</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <q-separator />
        <div class="col-shrink full-height bg-white">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="ruleDataRef" class="row q-pa-sm q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="ruleData.pha_title"
                  label="标题"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => !!val || '标题不能为空']"
                />
              </div>
              <div class="col-6">
                <q-select
                  outlined
                  dense
                  v-model="ruleData.pha_status"
                  option-label="label"
                  :options="statusOptions"
                  label="状态"
                  emit-value
                  map-options
                  bottom-slots
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="ruleData.pha_desc"
                  label="简介"
                  maxlength="255"
                  lazy-rules
                  :rows="1"
                  type="textarea"
                  :rules="[(val) => !!val || '简介不能为空']"
                />
              </div>
              <div class="col-6 text-left">
                <hl-upload
                  :multiple="false"
                  :currentAttach="ruleData.coverImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        ruleData.pha_cover_image = val;
                      });
                    }
                  "
                  currentTitle="封面图"
                  urrentDescription="建议尺寸比例4:3"
                />
              </div>

              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="ruleData.pha_time_number"
                  label="请输入周期"
                  :rules="[(val) => parseInt(val) > 0 || '请输入正整数']"
                  hint="请输入正整数"
                />
              </div>

              <div class="col-6">
                <q-select
                  outlined
                  dense
                  v-model="ruleData.pha_time_cycle"
                  :options="cycleOptions"
                  label="周期类型"
                  emit-value
                  map-options
                  bottom-slots
                ></q-select>
              </div>

              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="ruleData.pha_random_amount_min"
                  label="最小随机金额"
                  :rules="[(val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的百分比格式']"
                >
                  <template v-slot:append> % </template>
                </q-input>
              </div>

              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="ruleData.pha_random_amount_max"
                  label="最大随机金额"
                  :rules="[(val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的百分比格式']"
                >
                  <template v-slot:append> % </template>
                </q-input>
              </div>

              <div class="col-12 text-red">
                【最大随机金额与最小随机金额】示例：本次活动设置最小随机金额 10
                {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneyUnit }} ，最小随机金额 30
                {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneyUnit }}。那么会员在领取时会领取到10 - 30
                {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneyUnit }}之内的随机红包。
              </div>

              <div class="col-12 q-pa-xs">
                <hl-editor
                  @change="
                    (v) => {
                      ruleData.pha_content = v;
                    }
                  "
                  :content="ruleData.pha_content"
                  class="fit"
                  titleText="详情"
                  :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>
            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" @click="saveData()" color="primary" />
          <q-btn unelevated label="关闭" type="reset" @click="hideNowPage" color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'hyryxAddRule',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      ruleData: {
        pha_title: '',
        pha_desc: '',
        pha_cover_image: '',
        pha_status: '1',
        pha_random_amount_max: '',
        pha_random_amount_min: '',
        pha_time_cycle: '1',
        pha_time_number: '',
        pha_content: ''
      },
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '-1' }
      ],
      cycleOptions: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '天', value: '5' },
        { label: '小时', value: '6' }
      ],
      memberLevelData: [],
      currentRuleId: '',
      ruleDialogStatus: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.ruleDialogStatus = true

      if (parseInt(id) > 0) {
        this.currentRuleId = id
        this.$nextTick(() => {
          this.getRuleItem()
        })
      }
    },
    getRuleItem () {
      this.$store
        .dispatch('hbyx/getActivityItem', this.currentRuleId)
        .then((res) => {
          if (res.code == 200) {
            this.ruleData = res.data ? res.data : {}
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
    },

    hideNowPage () {
      this.ruleDialogStatus = false
      this.$emit('closeDialog')
    },

    saveData () {
      this.$refs.ruleDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const obj = {
            ...this.ruleData
          }
          this.$store
            .dispatch('hbyx/setActivityData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '新增活动成功',
                  color: 'green'
                })

                this.hideNowPage()
              } else {
                this.$q.notify({
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '失败',
                  caption: res.message,
                  color: 'red'
                })
                this.addButtonDisabled = false
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

<style scoped></style>
