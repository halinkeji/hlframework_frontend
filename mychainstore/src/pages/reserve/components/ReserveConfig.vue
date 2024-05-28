<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white ">
      <q-scroll-area class="fit full-height">
        <q-form ref="addProjectRef" class="row q-col-gutter-md">
          <div class="col-12 col-md-4 ">
            <q-select
              outlined
              dense
              v-model="reserveData.prp_today_limit"
              option-label="label"
              :options="todayOptions"
              label="当日限制"
              emit-value
              map-options
              class="q-mb-md"
            />
            <q-select
              outlined
              dense
              v-model="reserveData.prp_status"
              option-label="label"
              :options="statusOptions"
              label="预约状态"
              emit-value
              map-options
              class="q-mb-md"
            />
            <q-input
              outlined
              dense
              hint="本设置为了会员在预约的时候撤销时间做限制；该文本框填写单位为 ‘小时’ ，例如填写 3 ，那么会员在预约成功之后的 3 小时内可以撤销，过时间不可撤销！（0或不填为不限制）"
              v-model="reserveData.prp_cancel_hour"
              label="撤销时间"
              lazy-rules
              :rules="[(val) => /^[0-9]\d*$/.test(val) || '撤销时间格式不对']"
            >
            </q-input>

            <q-card flat bordered class="q-mt-lg">
              <q-card-section class="text-subtile2 row items-center">
                服务时间点设置 <q-space />
                <q-btn color="primary" label="新增时间点" unelevated @click="addRule" />
              </q-card-section>
              <q-separator />

              <q-card-section class="text-subtile2 row items-center">
                <div class="full-width  q-mb-md row q-col-gutter-sm" v-for="(item, key) in reserveData.prp_period">
                  <q-input
                    outlined
                    readonly
                    dense
                    class="col"
                    v-model="item.time_hour_minute"
                    label="开始时间"
                    :rules="[(val) => !!val || '请选择时间']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="item.time_hour_minute" mask="HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="关闭" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input
                    outlined
                    dense
                    class="col"
                    v-model="item.limit_people_number"
                    label="可预约人数"
                    :rules="[(val) => !!val || '请输入可预约人数']"
                  >
                    <template v-slot:append>
                      <q-btn @click="delRule(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section class="text-subtile2 row items-center">
                撤销原因 <q-space />
                <q-btn color="primary" label="新增" unelevated @click="addCancelReason" />
              </q-card-section>
              <q-separator />

              <q-card-section class="text-subtile2 row items-center">
                <div class="full-width  q-mb-md row q-col-gutter-sm" v-for="(item, key) in reserveData.prp_cancel_reason">

                  <q-input
                    outlined
                    dense
                    class="col"
                    v-model="item.reason"
                    label="原因"
                    :rules="[(val) => !!val || '请输入原因']"
                  >
                    <template v-slot:append>
                      <q-btn @click="delCancelReason(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section class="text-subtile2 row items-center">
                快捷短语 <q-space />
                <q-btn color="primary" label="新增" unelevated @click="addFastPhrase" />
              </q-card-section>
              <q-separator />

              <q-card-section class="text-subtile2 row items-center">
                <div class="full-width  q-mb-md row q-col-gutter-sm" v-for="(item, key) in reserveData.prp_fast_phrase">
                  <q-input
                    outlined
                    dense
                    class="col"
                    v-model="item.phrase"
                    label="快捷短语"
                    :rules="[(val) => !!val || '请输入可快捷短语']"
                  >
                    <template v-slot:append>
                      <q-btn @click="delFastPhrase(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-form>
      </q-scroll-area>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" class="q-px-xl" label="保存" :disable="addButtonDisabled" @click="setData" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReserveConfig',
  data () {
    return {
      addButtonDisabled: false,
      time_start: '',
      time_end: '',
      week_limit: [],
      reserveData: {
        prp_period: [],
        prp_user_id: '',
        prp_people_number: '',
        prp_time_start: '',
        prp_time_end: '',
        prp_today_limit: '1',
        prp_status: '1',
        prp_cancel_hour: '0',
        prp_detail: '',
        prp_fast_phrase: [],
        prp_cancel_reason: []
      },
      todayOptions: [
        { label: '可预约当天', value: '1' },
        { label: '不可预约当天', value: '2' }
      ],
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '禁用', value: '-1' }
      ]
    }
  },
  mounted () {},
  created () {
    this.getConfigItem()
  },
  computed: {},
  methods: {
    getConfigItem () {
      this.addButtonDisabled = false
      this.$store
        .dispatch('reserve/getItemData')
        .then((res) => {
          if (res.code == 200) {
            this.reserveData = res.data
              ? res.data
              : {
                  prp_period: [],
                  prp_user_id: '',
                  prp_people_number: '',
                  prp_time_start: '',
                  prp_time_end: '',
                  prp_today_limit: '1',
                  prp_status: '1',
                  prp_cancel_hour: '0',
                  prp_detail: '',
                  prp_fast_phrase: [],
                  prp_cancel_reason: []
                }
            this.reserveData.prp_period = res.data && res.data.prp_period ? res.data.prp_period : []
            this.reserveData.prp_fast_phrase = res.data && res.data.prp_fast_phrase ? res.data.prp_fast_phrase : []
            this.reserveData.prp_cancel_reason = res.data && res.data.prp_cancel_reason ? res.data.prp_cancel_reason : []
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
            id: this.reserveData.id,
            ...this.reserveData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('reserve/setData', data)
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
    // 新增规则
    addRule () {
      this.reserveData.prp_period.push({
        time_hour_minute: '',
        limit_people_number: ''
      })
    },

    delRule (key) {
      if (this.reserveData && this.reserveData.prp_period && this.reserveData.prp_period.length > 0) {
        this.reserveData.prp_period.splice(key, 1)
      }
    },
    addFastPhrase () {
      this.reserveData.prp_fast_phrase.push({
        phrase: ''
      })
    },

    delFastPhrase (key) {
      if (this.reserveData && this.reserveData.prp_fast_phrase && this.reserveData.prp_fast_phrase.length > 0) {
        this.reserveData.prp_fast_phrase.splice(key, 1)
      }
    },
    addCancelReason () {
      this.reserveData.prp_cancel_reason.push({
        reason: ''
      })
    },

    delCancelReason (key) {
      if (this.reserveData && this.reserveData.prp_cancel_reason && this.reserveData.prp_cancel_reason.length > 0) {
        this.reserveData.prp_cancel_reason.splice(key, 1)
      }
    }
  }
}
</script>
