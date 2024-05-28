<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        场馆设置
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white">
        <div style="overflow-y: scroll" class="fit full-height">
          <q-form ref="cdSetFormRef" class="row">
            <div class="col-12">
              <q-item>
                <q-item-section avatar>
                  <q-item-label> 当前场馆状态 </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label> <q-option-group v-model="cdyySetForm.set_status" :options="statusOption" color="primary" inline /></q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-6 q-px-sm">
              <q-input outlined label="停车场系统应用appKey" v-model="cdyySetForm.tcpark_app_key" dense />
            </div>

            <div class="col-6 q-px-sm">
                 <q-input outlined label="停车场系统应用appSecret" v-model="cdyySetForm.tcpark_app_secret" dense />
            </div>

            <div class="col-12 q-pa-sm">
              <q-banner class="bg-primary text-white">
                添加使用时间段时，必须符合每天设置的时间段为从早到晚的规则（24小时制1-24），每个时间段的开始时间必须大于上一时间段的结束时间，当前时间段的结束时间大于开始时间
              </q-banner>
            </div>
            <div class="row col-12   ">
              <div class="col-6 q-px-sm">
                <q-card flat bordered class="full-width q-mb-sm" :key="`card-${key}`" v-for="(item, key) in cdyySetForm.set_business_time">
                  <q-card-section horizontal>
                    <q-card-section class="row items-center">
                      <div>
                        {{ weekText[key] }}
                      </div>
                      <q-space />
                    </q-card-section>

                    <q-separator vertical />

                    <q-card-section class="full-width">
                      <div v-for="(i, k) in item">
                        <q-item>
                          <q-item-section>
                            <q-input
                              outlined
                              dense
                              label="开始时间"
                              :rules="[
                                (val) => verifyStartTimePeriodOnly(key, k, val) || '开始时间不符合规则',
                                (val) => (val && val.length > 0) || '开始时间不能为空',
                              ]"
                              v-model="i.start"
                              readonly
                            >
                              <template v-slot:append>
                                <q-icon color="grey" v-if="i.start" @click="i.start = ''" name="cancel"></q-icon>
                                <q-icon name="access_time" class="cursor-pointer">
                                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-time v-model="i.start" mask="HH:mm" format24h>
                                      <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="确定" color="primary" flat />
                                      </div>
                                    </q-time>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </q-item-section>
                          <q-item-section>
                            <q-input
                              outlined
                              dense
                              label="结束时间"
                              :rules="[
                                (val) => verifyEndTimePeriodOnly(key, k, val) || '结束时间不符合规则',
                                (val) => (val && val.length > 0) || '结束时间不能为空',
                              ]"
                              v-model="i.end"
                              readonly
                            >
                              <template v-slot:append>
                                <q-icon color="grey" v-if="i.end" @click="i.end = ''" name="cancel"></q-icon>
                                <q-icon name="access_time" class="cursor-pointer">
                                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-time v-model="i.end" mask="HH:mm" format24h>
                                      <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="确定" color="primary" flat />
                                      </div>
                                    </q-time>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </q-item-section>

                          <q-item-section side>
                            <q-btn color="red" @click="delTimePeriodValue(key, k)" unelevated label="删除" />
                          </q-item-section>
                        </q-item>
                      </div>
                      <div class="text-center"><q-btn color="primary" @click="addTimeArr(key)" unelevated label="新增时间段" /></div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-6 q-px-sm">
                <q-card flat bordered class="full-width">
                  <q-card-section class="items-center">
                    <div>退款时间段</div>
                    <div class="text-caption">退款比例填100时为全额退款</div>
                    <q-space />
                  </q-card-section>

                  <q-separator vertical />

                  <q-card-section class="full-width">
                    <div v-for="(item, key) in cdyySetForm.set_refund_time">
                      <q-item>
                        <q-item-section>
                          <q-input
                            outlined
                            dense
                            label="开始小时"
                            :rules="[(val) => (val && val.length > 0) || '开始小时不能为空']"
                            v-model="item.start"
                          >
                          </q-input>
                        </q-item-section>
                        <q-item-section>
                          <q-input
                            outlined
                            dense
                            label="结束小时"
                            :rules="[(val) => (val && val.length > 0) || '结束小时不能为空']"
                            v-model="item.end"
                          >
                          </q-input>
                        </q-item-section>

                        <q-item-section>
                          <q-input
                            outlined
                            dense
                            label="退款比例"
                            :rules="[(val) => (val && val.length > 0) || '退款比例不能为空']"
                            v-model="item.ratio"
                          >
                            <template v-slot:append> % </template>
                          </q-input>
                        </q-item-section>

                        <q-item-section side top>
                          <q-btn color="red" @click="delRefundTimePeriodValue(k)" unelevated label="删除" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="text-center"><q-btn color="primary" @click="addRefundTimeArr" unelevated label="新增时间段" /></div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <div class="col-12 q-px-sm">
              <hl-editor
              @change="
                (v) => {
                  cdyySetForm.set_reserve_notice = v;
                }
              "
              :content="cdyySetForm.set_reserve_notice"
              class="fit q-mt-sm"
              titleText="预定须知"
              :minHeight="$q.screen.height * 0.4"
            ></hl-editor>
            </div>

          </q-form>
        </div>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" v-if="authorityMeta('save')" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'cdyySet',
  components: {},
  data () {
    return {
      cdyySetForm: {
        set_business_time: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: []
        },
        set_reserve_notice: '',
        set_status: '1',
        set_refund_time: [],
        tcpark_app_key: '',
        tcpark_app_secret: ''

      },
      statusOption: [
        {
          label: '营业',
          value: '1'
        },
        {
          label: '休息',
          value: '2'
        },
        {
          label: '不开放',
          value: '3'
        }
      ],

      business_time: {},
      weekText: {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日'
      }
    }
  },
  mounted () {},
  created () {
    this.getItem()
  },
  computed: {},
  methods: {
    addTimeArr (val) {
      this.cdyySetForm.set_business_time[val].push({
        start: '',
        end: ''
      })
      return false
    },
    addRefundTimeArr () {
      this.cdyySetForm.set_refund_time.push({
        start: '',
        end: '',
        ratio: ''
      })
      return false
    },
    delRefundTimePeriodValue (key) {
      this.cdyySetForm.set_refund_time.splice(key, 1)
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('cdyy/getItem').then((res) => {
        if (res.code == 200 && res.data) {
          this.cdyySetForm = res.data
            ? res.data
            : {
                set_business_time: {
                  1: [],
                  2: [],
                  3: [],
                  4: [],
                  5: [],
                  6: [],
                  7: []
                },
                set_reserve_notice: '',
                set_status: '1'
              }
          // this.setBusinessTime(this.cdyySetForm)
        }
      })
    },

    delTimePeriodValue (week, time) {
      this.cdyySetForm.set_business_time[week].splice(time, 1)
    },

    verifyStartTimePeriodOnly (week, key, val) {
      if (this.cdyySetForm.set_business_time[week] && key > 0) {
        if (this.cdyySetForm.set_business_time[week] && this.cdyySetForm.set_business_time[week][key - 1]) {
          if (!this.cdyySetForm.set_business_time[week][key - 1].end) {
            return false
          }
        }
        return this.compareDate(val, this.cdyySetForm.set_business_time[week][key - 1].end)
      }

      return true
    },

    verifyEndTimePeriodOnly (week, key, val) {
      if (this.cdyySetForm.set_business_time[week]) {
        if (!this.cdyySetForm.set_business_time[week][key].start) {
          return false
        }
        return this.compareDateTwo(val, this.cdyySetForm.set_business_time[week][key].start)
      }

      return true
    },

    compareDate (t1, t2) {
      const date = new Date()
      const a = t1.split(':')
      const b = t2.split(':')
      return date.setHours(a[0], a[1]) >= date.setHours(b[0], b[1])
    },

    compareDateTwo (t1, t2) {
      const date = new Date()
      const a = t1.split(':')
      const b = t2.split(':')
      return date.setHours(a[0], a[1]) > date.setHours(b[0], b[1])
    },

    // 提交
    saveData () {
      this.$refs.cdSetFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.cdyySetForm
          }
          this.$store
            .dispatch('cdyy/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '保存成功',
                  color: 'green'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
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
