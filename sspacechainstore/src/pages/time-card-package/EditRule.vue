<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" full-height persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.4 + 'px',
        'min-width': this.$q.screen.width * 0.4 + 'px',
        height: this.$q.screen.height * 0.9 + 'px',
      }"
      class="fit column no-wrap"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">{{ chargePackageData.id > 0 ? '修改' : '新增' }}时间卡</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="full-height">
        <q-scroll-area class="fit">
          <q-form ref="chargePackageRef" class="row q-col-gutter-sm">
            <div class="col-12">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label>状态</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="positive" v-model="chargePackageData.tcp_status" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12">
              <q-input outlined dense v-model="chargePackageData.tcp_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
            </div>

             <div class="col-12">
              <q-input outlined dense v-model="chargePackageData.tcp_regular_minutes" label="时长（分钟）" lazy-rules :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']" />
            </div>

            <div class="col-12">
              <q-input
                outlined
                dense
                v-model="chargePackageData.tcp_sell_price"
                label="售价"
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的价格']"
              />
            </div>

            <div class="col-6">
               <hl-upload
                :multiple="false"
                :currentAttach="chargePackageData.coverImage"
                @input="(val)=>{ $nextTick(()=>{ chargePackageData.tcp_cover_image = val })}"
                currentDescription="建议尺寸比例4:3"
                currentTitle="套餐封面"
              />

            </div>

            <div class="col-12">
              <q-card flat bordered>
                <q-card-section class="q-pa-none">
                  <q-item class="bg-grey-2">
                    <q-item-section>
                      <q-item-label>选择时间规则</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-radio v-model="chargePackageData.tcp_expire_type" val="1" label="永久有效" />
                        <q-radio v-model="chargePackageData.tcp_expire_type" val="2" label="指定时间" />
                        <q-radio v-model="chargePackageData.tcp_expire_type" val="3" label="固定时段" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-separator />

                <q-card-section v-if="parseInt(chargePackageData.tcp_expire_type) == 2">
                  <q-item>
                    <q-item-section>
                      <q-input
                        outlined
                        bottom-slots
                        v-model="chargePackageData.tcp_relative_time_number"
                        dense
                        lazy-rules
                        :rules="[(val) => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(val) || '请输入非负两位以内小数的数字']"
                        label="从充时开始以后"
                      >
                      </q-input>
                    </q-item-section>
                    <q-item-section>
                      <q-select
                        outlined
                        dense
                        bottom-slots
                        v-model="chargePackageData.tcp_relative_time_cycle"
                        :options="timeType"
                        label="内有效"
                        emit-value
                        map-options
                      />
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-card-section v-if="parseInt(chargePackageData.tcp_expire_type) == 3">
                  <q-item>
                    <q-item-section>
                      <q-input outlined v-model="chargePackageData.tcp_regular_start_time" label="开始时间" dense readonly lazy-rules reactive-rules>
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                              <q-date v-model="chargePackageData.tcp_regular_start_time" mask="YYYY-MM-DD HH:mm:ss" today-btn>
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
                              <q-time v-model="chargePackageData.tcp_regular_start_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定" color="primary" flat />
                                </div>
                              </q-time>
                            </q-menu>
                          </q-icon>
                        </template>
                      </q-input>
                    </q-item-section>

                    <q-item-section>
                      <q-input outlined v-model="chargePackageData.tcp_regular_end_time" label="结束时间" dense readonly lazy-rules reactive-rules>
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                              <q-date v-model="chargePackageData.tcp_regular_end_time" mask="YYYY-MM-DD HH:mm:ss" today-btn>
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
                              <q-time v-model="chargePackageData.tcp_regular_end_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定" color="primary" flat />
                                </div>
                              </q-time>
                            </q-menu>
                          </q-icon>
                        </template>
                      </q-input>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12">
              <hl-editor
                @change="
                  (v) => {
                    chargePackageData.tcp_description = v;
                  }
                "
                :content="chargePackageData.tcp_description"
                :minHeight="$q.screen.height * 0.4"
                titleText="说明"
              ></hl-editor>
            </div>
          </q-form>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-center row q-gutter-sm">
        <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData"> 保存 </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddChargePackage',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      chargePackageData: {
        tcp_name: '',
        tcp_status: '1',
        tcp_is_member_price: 1,
        tcp_sell_price: '',
        tcp_member_price_set: '',
        tcp_expire_type: '1',
        tcp_regular_hours: '',
        tcp_time_period_start: '',
        tcp_time_period_end: '',
        tcp_description: '',
        tcp_regular_minutes: ''
      },

      roomGroupId: 0,

      chargeRuleListData: [],
      timeType: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '天', value: '5' },
        { label: '小时', value: '6' }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      this.getChargeRuleList()
      this.roomGroupId = id
      if (id > 0) {
        this.getItem()
      }
    },

    // 获取计费模式
    getChargeRuleList () {
      const params = {}
      this.$store
        .dispatch('chargeRule/getChargeRuleList', params)
        .then((res) => {
          if (res.code == 200) {
            this.chargeRuleListData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    getItem () {
      this.$store
        .dispatch('timeCardPackage/getChargePackageItem', this.roomGroupId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.chargePackageData = res.data

            if (parseInt(this.chargePackageData.tcp_expire_type) == 3) {
              this.chargePackageData.tcp_regular_start_time = this.$q_date.formatDate(res.data.tcp_regular_start_time * 1000, 'YYYY-MM-DD  HH:mm:ss')
              this.chargePackageData.tcp_regular_end_time = this.$q_date.formatDate(res.data.tcp_regular_end_time * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
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
    },

    setData () {
      this.$refs.chargePackageRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          if (parseInt(this.chargePackageData.tcp_expire_type) == 3) {
            this.chargePackageData.tcp_regular_start_time = this.$q_date.formatDate(this.chargePackageData.tcp_regular_start_time, 'X')
            this.chargePackageData.tcp_regular_end_time = this.$q_date.formatDate(this.chargePackageData.tcp_regular_end_time, 'X')
          }

          const params = {
            ...this.chargePackageData
          }
          this.$store
            .dispatch('timeCardPackage/saveChargePackage', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.chargePackageData.id > 0 ? '修改' : '新增'}` + '时间卡成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
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
    },

    hideNowPage () {
      this.chargePackageData = {
        id: '',
        tcp_name: '',
        tcp_status: '1',
        tcp_is_member_price: 1,
        tcp_sell_price: '',
        tcp_member_price_set: '',
        tcp_expire_type: '1',
        tcp_regular_hours: '',
        tcp_time_period_start: '',
        tcp_time_period_end: '',
        tcp_description: ''
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
