<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.9 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="addProjectRef">
        <q-card-section class="row items-center q-pa-none q-mb-lg">
          <div class="text-h6 q-pr-lg">{{ reserveData.id > 0 ? '修改' : '新增' }}预约项目</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="q-mt-lg row">
          <div class="col-12 col-md-6 q-pr-sm">
            <q-input
              outlined
              dense
              v-model="reserveData.prp_name"
              label="项目名称"
              lazy-rules
              :rules="[(val) => (val && !!val) || '请输入项目名称']"
            />
          </div>
          <div class="col-12 col-md-6 q-pr-sm q-pl-sm">
            <q-select
              outlined
              dense
              v-model="reserveData.prp_type_id"
              option-value="id"
              option-label="prt_name"
              :options="typeOptions"
              label="请选择预约分类"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => (val && !!val) || '请选择预约分类']"
            />
          </div>
        </div>
        <div class="q-mt-xs row">
          <div class="col-12 col-md-6 q-pr-sm">
            <q-input
              outlined
              dense
              v-model="reserveData.prp_price"
              label="预约价格"
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入预约价格']"
            />
          </div>
          <div class="col-12 col-md-6 q-pr-sm q-pl-sm">
            <q-input
              outlined
              dense
              v-model="reserveData.prp_people_number"
              label="预约人数"
              lazy-rules
              :rules="[(val) => /^[1-9]\d*$/.test(val) || '请输入预约人数']"
            />
          </div>
        </div>
        <div>截止时间</div>
        <div class="q-mt-xs row">
          <div class="col-6 row justify-between q-pr-sm">
            <q-input outlined readonly dense v-model="time_start" class="col-6" label="开始日期">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="time_start" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="time_start" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input outlined readonly dense label="结束日期" v-model="time_end" class="col-6">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="time_end" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="time_end" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6 q-pr-sm q-pl-sm">
            <q-input
              outlined
              dense
              v-model="reserveData.prp_sort"
              label="排序"
              lazy-rules
              :rules="[(val) => /^[0-9]\d*$/.test(val) || '请输入排序']"
            />
          </div>
        </div>
        <div class="q-mt-xs row">
          <div class="col-12 col-md-6 q-pr-sm">
            <q-select
              outlined
              dense
              v-model="reserveData.prp_today_limit"
              option-label="label"
              :options="todayOptions"
              label="当日限制"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-6 q-px-sm">
            <q-select
              outlined
              dense
              v-model="reserveData.prp_status"
              option-label="label"
              :options="statusOptions"
              label="预约状态"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="q-mt-lg row">
          <div class="col-12 col-md-6 q-pr-sm">
            <q-input
              class="q-mb-xs"
              outlined
              dense
              v-model="reserveData.prp_cancel_hour"
              label="撤销时间"
              lazy-rules
              :rules="[(val) => /^[0-9]\d*$/.test(val) || '撤销时间格式不对']"
            />
            <span class="text-red"
              >本设置为了会员在预约的时候撤销时间做限制；该文本框填写单位为 ‘小时’ ，例如填写 3 ，那么会员在预约成功之后的 3
              小时内可以撤销，过时间不可撤销！（0或不填为不限制）</span
            >
          </div>
          <div class="col-12 col-md-6 q-px-sm">
            <q-select
              outlined
              dense
              v-model="reserveData.prp_user_id"
              option-value="id"
              option-label="username"
              :options="userOptions"
              label="请选择预约员工"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="q-mt-md row">
          <span>可预约时间</span>
          <q-option-group v-model="week_limit" :options="weekOptions" color="primary" inline class="q-ml-sm" type="checkbox" dense />
        </div>
        <div class="q-mt-md row">
          <span class="q-mr-md">预约时间段</span>
          <div class="col-11">
            <q-btn color="primary" label="新增规则" unelevated @click="addRule" />
            <div class="row q-mt-md">
              <div class="row col-12 q-mb-md" v-for="(item, mainKey) in reserveTime">
                <div class="col-6 row">
                  <q-input outlined readonly dense v-model="item.rpt_time_start" class="col-5" label="开始时间">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="item.rpt_time_start" mask="HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="关闭" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span class="q-mt-sm q-mx-sm">至</span>
                  <q-input outlined readonly dense v-model="item.rpt_time_end" class="col-5" label="结束时间">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="item.rpt_time_end" mask="HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="关闭" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-4">
                  <q-input outlined dense v-model="item.rpt_limit_people_number" :rules="[(val) => /^[0-9]\d*$/.test(val) || '请输入限制人数']">
                    <template v-slot:prepend>
                      <span class="text-subtitle2">预约限制人数</span>
                      <q-separator dark color="grey" class="q-mx-sm" vertical />
                    </template>
                  </q-input>
                </div>
                <div class="q-ml-lg">
                  <q-btn @click="delRule(item, mainKey)" color="red" label="删除" unelevated style="height: 40px" class="q-px-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="q-mt-lg row">
          <div class="col-6 q-pr-sm row">
            <hl-upload
              :multiple="false"
              :currentAttach="reserveData.coverImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    reserveData.prp_cover_image = val;
                  });
                }
              "
              currentTitle="封面图"
              currentDescription="建议尺寸1:1"
            />
          </div>
          <div class="q-mb-lg col-6 row">
            <hl-upload
              :multiple="true"
              :maxTotal="5"
              :currentAttach="reserveData.loopImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    reserveData.prp_loop_image = val;
                  });
                }
              "
              currentTitle="轮播详情"
              currentDescription="尺寸建议宽度为640"
            />
          </div>
        </div>
        <div class="q-mt-xs q-pr-md row">
          <hl-editor
            class="col-11 q-ml-sm"
            :content="reserveData.prp_detail"
            @change="
              (content) => {
                reserveData.prp_detail = content;
              }
            "
            titleText="详情"
            :minHeight="$q.screen.height * 0.4"
          ></hl-editor>
        </div>
        <div align="right" class="q-mt-md">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddReserveProject',
  data () {
    return {
      match: false,
      persistent: true,
      multiple: false,
      showDialog: true,
      addButtonDisabled: false,
      time_start: '',
      time_end: '',
      week_limit: [],
      reserveData: {
        prp_user_id: '',
        prp_sort: '0',
        prp_name: '',
        prp_type_id: '',
        prp_price: '',
        prp_people_number: '',
        prp_time_start: '',
        prp_time_end: '',
        prp_today_limit: '1',
        prp_status: '1',
        prp_cancel_hour: '0',
        prp_week_limit: [],
        prp_cover_image: '',
        prp_loop_image: {},
        prp_detail: ''
      },
      todayOptions: [
        { label: '可预约当天', value: '1' },
        { label: '不可预约当天', value: '2' }
      ],
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '禁用', value: '-1' }
      ],
      typeOptions: [],
      reserveTime: [],
      userOptions: [],
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
  mounted () {},
  created () {
    this.getReserveTypeList()
    this.getUserList()
  },
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('reserve/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.reserveData = res.data ? res.data : this.reserveData
              this.week_limit = res.data.prp_week_limit.split(',')
              this.reserveData.prp_loop_image = res.data.prp_loop_image ? this.reserveData.prp_loop_image.split(',') : {}
              this.time_start = this.$q_date.formatDate(res.data.prp_time_start * 1000, 'YYYY-MM-DD HH:mm:ss')
              this.time_end = this.$q_date.formatDate(res.data.prp_time_end * 1000, 'YYYY-MM-DD HH:mm:ss')
              if (res.data.reserveTime) {
                this.reserveTime = res.data.reserveTime.map((item) => {
                  return {
                    id: item.id,
                    rpt_limit_people_number: item.rpt_limit_people_number,
                    rpt_time_start: this.$q_date.formatDate(item.rpt_time_start * 1000, 'HH:mm'),
                    rpt_time_end: this.$q_date.formatDate(item.rpt_time_end * 1000, 'HH:mm')
                  }
                })
              }
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
      }
    },
    getReserveTypeList () {
      this.$store
        .dispatch('reserve/getReserveTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.typeOptions = res.data ? res.data : []
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
    getUserList () {
      this.$store
        .dispatch('user/getUserAllData')
        .then((res) => {
          if (res.code == 200) {
            this.userOptions = res.data ? res.data : []
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
          const startTime = this.$q_date.formatDate(this.time_start, 'X')
          const endTime = this.$q_date.formatDate(this.time_end, 'X')
          if (!startTime) {
            this.$q.notify({
              message: '注意',
              caption: '请选择开始时间！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          if (!endTime) {
            this.$q.notify({
              message: '注意',
              caption: '请选择结束时间！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }

          if (startTime >= endTime) {
            this.$q.notify({
              message: '注意',
              caption: '开始时间不能大于等于结束时间！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.addButtonDisabled = false
            return false
          }
          this.reserveData.prp_time_end = endTime
          this.reserveData.prp_time_start = startTime
          this.reserveData.prp_week_limit = this.week_limit

          const data = {
            ...this.reserveData,
            reserveTime: this.reserveTime
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('reserve/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.reserveData.id > 0 ? '修改' : '新增'}` + '预约项目成功',
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
      this.reserveTime.push({
        rpt_time_start: '',
        rpt_time_end: '',
        rpt_limit_people_number: ''
      })
    },
    delRule (item, mainKey) {
      this.reserveTime.splice(mainKey, 1)
      this.$q.notify({
        message: '成功',
        caption: '删除成功',
        color: 'green',
        icon: 'ion-checkmark-circle-outline',
        timeout: 500,
        position: 'top-right'
      })
      if (item.id > 0) {
        const obj = {
          id: item.id
        }
        this.$store
          .dispatch('reserve/delTime', obj)
          .then((res) => {})
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
    },

    // 关闭
    closeUpload (v) {
      this.uploadImgStatus = false
    },

    hideNowPage () {
      this.addButtonDisabled = false
      this.$emit('dataList')
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
