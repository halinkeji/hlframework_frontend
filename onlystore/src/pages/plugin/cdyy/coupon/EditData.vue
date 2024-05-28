<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}优惠券</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="couponFormDataRef" class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="couponForm.cc_title"
                  label="名称"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '名称不能为空']"
                />
              </div>
              <div class="col-12">
                <div class="q-pa-xs">
                  <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary q-mr-sm" />卡券设置</div>
                </div>
                <q-separator />
                <div class="col-12 row q-col-gutter-sm q-mt-sm">
                  <div class="col-4">
                    <q-select
                      outlined
                      label="优惠券类型"
                      v-model="couponForm.cc_type"
                      option-label="label"
                      option-value="value"
                      map-options
                      emit-value
                      dense
                      :options="$store.state.cdyy.couponTypeData"
                      bottom-slots
                    />
                  </div>
                  <div class="col-4" v-if="parseInt(couponForm.cc_type) == 3">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_amount"
                      label="免除金额"
                      lazy-rules
                      :rules="[(val) => parseInt(val) > 0 || '请输入大于0的正整数']"
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_type) == 2">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_amount"
                      label="免除分钟"
                      lazy-rules
                      :rules="[(val) => parseInt(val) > 0 || '请输入大于0的正整数']"
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_type) == 4">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_amount"
                      label="多次全免次数"
                      lazy-rules
                      :rules="[(val) => parseInt(val) > 0 || '请输入大于0的正整数']"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="q-pa-xs">
                  <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary q-mr-sm" />发送设置</div>
                </div>
                <q-separator />
                <div class="col-12 row q-col-gutter-sm q-mt-sm">
                  <div class="col-4">
                    <q-select
                      outlined
                      label="选择发送属性"
                      v-model="couponForm.cc_attribute"
                      option-label="label"
                      option-value="value"
                      map-options
                      emit-value
                      dense
                      :options="$store.state.cdyy.attributeTypeData"
                      bottom-slots
                      @input="couponForm.cc_attribute_rule = ''"
                    />
                  </div>

                  <div class="col-4">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_number"
                      label="发送张数"
                      lazy-rules
                      :rules="[(val) => parseInt(val) > 0 || '请输入大于0的正整数']"
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_attribute) == 1">
                    <q-select
                      outlined
                      label="选择绑定卡密套餐"
                      v-model="couponForm.cc_attribute_rule"
                      option-label="pkp_name"
                      option-value="id"
                      map-options
                      emit-value
                      dense
                      :options="kmjhPackageList"
                      bottom-slots
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_attribute) == 2">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_attribute_rule"
                      label="满消费金额"
                      lazy-rules
                      :rules="[(val) => formatAmount(val) > 0 || '请输入大于0的金额']"
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_attribute) == 3">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_attribute_rule"
                      label="满充值金额"
                      lazy-rules
                      :rules="[(val) => formatAmount(val) > 0 || '请输入大于0的金额']"
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_attribute) == 4">
                    <q-select
                      outlined
                      label="选择绑定级别"
                      v-model="couponForm.cc_attribute_rule"
                      option-label="mcl_level_name"
                      option-value="id"
                      map-options
                      emit-value
                      dense
                      :options="levelDataList"
                      bottom-slots
                    />
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_attribute) == 5">
                    <q-input
                      outlined
                      dense
                      v-model="couponForm.cc_attribute_rule"
                      label="所需积分"
                      lazy-rules
                      :rules="[(val) => formatAmount(val) > 0 || '请输入大于0的积分']"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="q-pa-xs">
                  <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary q-mr-sm" />到期时间设置</div>
                </div>
                <q-separator />
                <div class="col-12 row q-col-gutter-sm q-mt-sm">
                  <div class="col-4">
                    <q-select
                      outlined
                      label="时间类型"
                      v-model="couponForm.cc_time_type"
                      option-label="label"
                      option-value="value"
                      map-options
                      emit-value
                      dense
                      :options="$store.state.cdyy.limitOptions"
                      bottom-slots
                      @input="changeTimeType"
                    />
                  </div>
                  <div class="col-4" v-if="parseInt(couponForm.cc_time_type) == 2">
                    <q-input
                      outlined
                      v-model="couponForm.cc_time_one"
                      label="开始时间"
                      dense
                      lazy-rules
                      :error="false"
                      readonly
                    >
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="couponForm.cc_time_one" mask="YYYY-MM-DD HH:mm:ss" today-btn>
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
                            <q-time v-model="couponForm.cc_time_one" mask="YYYY-MM-DD HH:mm:ss" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_time_type) == 2">
                    <q-input outlined v-model="couponForm.cc_time_two" label="结束时间" dense lazy-rules :error="false"  readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="couponForm.cc_time_two" mask="YYYY-MM-DD HH:mm:ss" today-btn>
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
                            <q-time v-model="couponForm.cc_time_two" mask="YYYY-MM-DD HH:mm:ss" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_time_type) == 1">
                    <q-input  v-model="couponForm.cc_time_one" outlined label="即日起:" dense @change="changeStartTime">
                    </q-input>
                  </div>

                  <div class="col-4" v-if="parseInt(couponForm.cc_time_type) == 1">
                    <q-select
                      outlined
                      dense
                      emit-value
                      map-options
                      v-model="couponForm.cc_time_two"
                      :options="$store.state.cdyy.timeOptions"
                      label="内有效"
                      placeholder="选择范围"
                    >
                    </q-select>
                  </div>
                </div>
              </div>
            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EditData',
  data () {
    return {
      dialogStatus: false,
      dataId: 0,

      couponForm: {
        cc_title: '',
        cc_type: '1',
        cc_attribute: '1',
        cc_amount: '',
        cc_number: '',
        cc_attribute_rule: '',

        cc_time_type: '1',
        cc_time_one: '',
        cc_time_two: ''
      },
      levelDataList: [],
      kmjhPackageList: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    changeTimeType () {
      this.couponForm.cc_time_one = ''
      this.couponForm.cc_time_two = ''
    },
    init (id) {
      this.dialogStatus = true
      this.dataId = id
      this.getItem()
    },
    getItem () {
      this.$store
        .dispatch('cdyy/getCouponItem', {
          coupon_id: this.dataId
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data && res.data.couponForm) {
              this.couponForm = res.data && res.data.couponForm ? res.data.couponForm : {}
            }

            this.levelDataList = res.data && res.data.levelDataList ? res.data.levelDataList : []

            this.kmjhPackageList = res.data && res.data.kmjhPackageList ? res.data.kmjhPackageList : []
          }
        })
    },

    saveData () {
      this.$refs.couponFormDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.couponForm,
            id: this.dataId
          }
          this.$store
            .dispatch('cdyy/setCouponData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.dialogStatus = false
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '错误',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
