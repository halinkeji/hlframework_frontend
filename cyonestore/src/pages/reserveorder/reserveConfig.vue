<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white">
      <div style="overflow-y: scroll;" class="fit full-height">
        <q-form ref="configRef" class="row q-col-gutter-sm">
          <div class="col-3">
            <q-select
              outlined
              dense
              v-model="reserveData.drc_status"
              option-label="label"
              :options="statusOptions"
              label="预约状态"
              emit-value
              map-options
            />
          </div>

          <div class="col-3">
            <q-select
              outlined
              dense
              v-model="reserveData.drc_today_limit"
              option-label="label"
              :options="todayOptions"
              label="当日限制"
              emit-value
              map-options
            />
          </div>

          <div class="col-3">
            <q-input
              outlined
              dense
              v-model="reserveData.drc_cancel_hour"
              label="撤销时间"
              lazy-rules
              :rules="[(val) => /^[0-9]\d*$/.test(val) || '撤销时间格式不对']"
            />
            <span class="text-red "
              >本设置为了会员在预约的时候撤销时间做限制；该文本框填写单位为 ‘小时’ ，例如填写 3
              ，那么会员在预约到店时间的前3小时内不可撤销！（0或不填为不限制）</span
            >
          </div>

          <div class="col-3">
            <span>可预约星期</span>
            <q-option-group
              v-model="reserveData.drc_week_limit"
              :options="weekOptions"
              color="primary"
              inline
              class="q-mt-sm"
              type="checkbox"
              dense
            />
          </div>
          <div class="col-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">可预约时间段</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-item :key="'time' + key" v-for="(item, key) in reserveData.drc_time_period">
                  <q-item-section>
                    <q-input outlined readonly dense v-model="item.start" label="开始时间">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="item.start" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                  <!--
                  <q-item-section>
                    <q-input outlined readonly dense label="结束时间" v-model="item.end">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="item.end" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section> -->

                  <q-item-section side>
                    <q-btn unelevated color="negative" @click="removeTimePeriod(key)" round icon="las la-trash-alt"></q-btn>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn unelevated color="primary" @click="pushTimePeriod" class="q-px-sm">新增时间段</q-btn>
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">特殊需求</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-item :key="'time' + key" v-for="(item, key) in reserveData.drc_special_demand">
                  <q-item-section>
                    <q-input outlined  dense v-model="item.value" label="需求项">
                    </q-input>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn unelevated color="negative" @click="removeSpecialDemand(key)" round icon="las la-trash-alt"></q-btn>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn unelevated color="primary" @click="pushSpecialDemand" class="q-px-sm">新增需求</q-btn>
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-4">
            <hl-upload
              :multiple="true"
              :maxTotal="5"
              :currentAttach="reserveData.loopImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    reserveData.drc_loop_image = val;
                  });
                }
              "
              currentDescription="预约轮播图:尺寸建议宽度为600*350,最多为5张"
            />
          </div>

          <div class="col-12 q-px-sm">
            <hl-editor
              :content="reserveData.drc_description"
              @change="
                (content) => {
                  reserveData.drc_description = content;
                }
              "
              :minHeight="$q.screen.height * 0.4"
              titleText="详情说明"
            ></hl-editor>
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn unelevated label="保存" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'reserveConfig',
  data () {
    return {
      match: false,
      persistent: true,
      multiple: false,
      addButtonDisabled: false,
      reserveData: {
        drc_today_limit: '1',
        drc_status: '1',
        drc_cancel_hour: '0',
        drc_week_limit: [],
        drc_loop_image: [],
        drc_description: '',
        drc_time_period: [],
        drc_special_demand: []
      },
      todayOptions: [
        { label: '可预当天', value: '1' },
        { label: '不可预约当天', value: '2' }
      ],
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '禁用', value: '-1' }
      ],
      weekOptions: [
        {
          label: '星期一',
          value: '1'
        },
        {
          label: '星期二',
          value: '2'
        },
        {
          label: '星期三',
          value: '3'
        },
        {
          label: '星期四',
          value: '4'
        },
        {
          label: '星期五',
          value: '5'
        },
        {
          label: '星期六',
          value: '6'
        },
        {
          label: '星期日',
          value: '7'
        }
      ]
    }
  },
  created () {
    this.getReserveConfigData()
  },
  mounted () {},
  computed: {},
  methods: {
    getReserveConfigData () {
      this.$store
        .dispatch('reserveorder/getListData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.reserveData = res.data ? res.data : {}
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
          const params = {
            ...this.reserveData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('reserveorder/setConfigData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getReserveConfigData()
                this.addButtonDisabled = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisable = false
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

    pushTimePeriod () {
      this.reserveData.drc_time_period.push({
        start: '',
        end: ''
      })
    },

    pushSpecialDemand () {
      this.reserveData.drc_special_demand.push({
        value: ''
      })
    },

    removeTimePeriod (key) {
      this.reserveData.drc_time_period.splice(key, 1)
    },
    removeSpecialDemand (key) {
      this.reserveData.drc_special_demand.splice(key, 1)
    }
  }
}
</script>
