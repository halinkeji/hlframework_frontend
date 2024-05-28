<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-py-sm">
          <div class="text-subtitle1">新增预约</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="addReserveRef">
              <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-select
                    outlined
                    dense
                    v-model="detailData.prd_project_id"
                    option-value="id"
                    option-label="prp_name"
                    :options="typeOptions"
                    label="请选择预约项目"
                    @input="init(detailData.prd_project_id)"
                    emit-value
                    map-options
                    lazy-rules
                    :rules="[(val) => (val && !!val) || '请选择预约项目']"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    v-model="detailData.prd_people_number"
                    label="预约人数"
                    lazy-rules
                    :rules="[(val) => /^[1-9]\d*$/.test(val) || '请输入预约人数']"
                  />
                </div>

                <div class="col-6">
                  <q-input outlined dense v-model="detailData.prd_people_name" label="预约人姓名" />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    v-model="detailData.prd_people_mobile"
                    label="预约人手机号"
                    :rules="[(val) => (!val ? true : /^[1][3,4,5,7,8][0-9]{9}$/.test(val) || '请输入正确的手机号')]"
                  />
                </div>

                <div class="col-12 q-mt-xs">
                  <q-input outlined dense type="textarea" rows="2" v-model="detailData.prd_remark" label="备注" />
                </div>
              </div>

              <div class="q-mt-sm row">
                <span class="q-mt-sm">预约时间段</span>
                <div v-for="(item, key) in reserveData.reserveTime">
                  <q-radio v-model="detailData.prd_time_id == item.id ? item.id : detailData.prd_time_id" :val="item.id" @input="getReserve(item)">
                    <span>
                      {{ $q_date.formatDate(new Date(item.rpt_time_start * 1000), 'HH:mm') }}
                      -
                      {{ $q_date.formatDate(new Date(item.rpt_time_end * 1000), 'HH:mm') }}
                    </span>
                  </q-radio>
                </div>
              </div>
              <div class="q-mt-sm">
                <div class="q-mt-sm q-mb-sm">预约日期<q-chip color="teal" dense size="xs" class="q-px-sm q-ml-sm"></q-chip>为可预约日期</div>
                <q-date
                  v-model="reserveDate"
                  minimal
                  :events="reserveData.events"
                  :options="reserveOptions"
                  @input="judgmentDate"
                  class="full-width"
                  flat
                  bordered
                />
              </div>
            </q-form>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>
    <hl-checkout-plugin
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="openCheckoutPageIf"
    ></hl-checkout-plugin>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddReserve',
  data () {
    return {
      reserveDate: '',
      dateValue: '',
      showDialog: true,
      addButtonDisabled: false,
      detailData: {
        prd_project_id: '',
        prd_time_id: '',
        prd_member_id: '',
        prd_people_number: '',
        prd_date: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_status: '2',
        prd_pay_status: '1',
        prd_people_name: '',
        prd_people_mobile: '',
        prd_remark: ''
      },
      reserveData: {},
      typeOptions: [],
      openCheckoutPageIf: false
    }
  },
  mounted () {},
  created () {
    this.getReserveDataList()
  },
  computed: {},
  methods: {
    reserveOptions (date) {
      const today = this.$q_date.formatDate(new Date(), 'YYYY/MM/DD')
      return date >= today
    },
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.detailData.prd_member_id = val.id
        }
      }
    },
    getReserve (item) {
      if (this.detailData.prd_date) {
        this.dateValue = this.$q_date.formatDate(this.detailData.prd_date * 1000, 'YYYY/MM/DD')
      } else {
        this.dateValue = this.$q_date.formatDate(new Date(), 'YYYY/MM/DD')
      }
      this.detailData.prd_time_id = item.id
      this.detailData.prd_time_start =
        new Date(
          this.dateValue + ' ' + new Date(item.rpt_time_start * 1000).getHours() + ':' + new Date(item.rpt_time_start * 1000).getMinutes()
        ).getTime() / 1000
      this.detailData.prd_time_end =
        new Date(
          this.dateValue + ' ' + new Date(item.rpt_time_end * 1000).getHours() + ':' + new Date(item.rpt_time_end * 1000).getMinutes()
        ).getTime() / 1000
    },
    getReserveDataList () {
      this.$store
        .dispatch('reserve/getReserveProjectList')
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
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('reserve/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.reserveData = res.data ? res.data : {}
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '获取预约项目失败',
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
    setData () {
      this.$refs.addReserveRef.validate().then((success) => {
        if (success) {
          const startTime = this.detailData.prd_time_start
          if (this.reserveData.reserveTime.length > 0 && !startTime) {
            this.$q.notify({
              message: '注意',
              caption: '请选择预约时间段！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top',
              color: 'red'
            })
            return false
          }
          const reserveDate = this.detailData.prd_date
          if (!reserveDate) {
            this.$q.notify({
              message: '注意',
              caption: '请选择预约日期！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          const endTime = this.detailData.prd_time_end
          if (endTime < new Date().getTime() / 1000) {
            this.$q.notify({
              message: '注意',
              caption: '该预约时间段不在可预约时间范围内!',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top',
              color: 'red'
            })
            return false
          }

          const obj = {
            ...this.detailData
          }
          this.noNoticeBuy(obj)
        }
      })
    },

    noNoticeBuy (obj) {
      this.$store
        .dispatch('reserve/verifyReserveLimit', obj)
        .then((res) => {
          if (res.code == 200) {
            if (this.formatAmount(this.reserveData.prp_price) > 0) {
              this.paySelfhelpRefuel(obj)
            } else {
              this.setReserveDetail(obj)
            }
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
    },

    setReserveDetail (obj) {
      this.addButtonDisabled = true
      this.$store
        .dispatch('reserve/setDetailData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '提示',
              caption: '预约已提交',
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
    },

    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },

    paySuccessCallBack (v) {
      this.openCheckoutPageIf = false
      this.$store
        .dispatch('reserve/settleOrder', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '预约成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.showDialog = false
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '支付失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '操作失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },

    paySelfhelpRefuel (obj) {
      this.openCheckoutPageIf = true

      const return_param = obj
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('reservePlugin', this.reserveData.prp_price, parseInt(this.detailData.prd_member_id), return_param)
      })

      return false
    },

    judgmentDate (value, reason, details) {
      if (this.reserveData.events) {
        const dateData = []
        this.reserveData.events.forEach(function (item) {
          const date = new Date(item).getTime() / 1000
          dateData.push(date)
        })
        const today = new Date()
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)
        if (dateData.indexOf(new Date(value).getTime() / 1000) > -1 && new Date(value).getTime() >= new Date(today).getTime()) {
          if (this.reserveData.prp_today_limit == 2 && new Date(value).toDateString() === new Date().toDateString()) {
            this.$q.notify({
              message: '当天不可预约',
              timeout: 500,
              position: 'top',
              color: 'red'
            })
            return false
          }
          this.detailData.prd_date = new Date(value).getTime() / 1000
          this.dateValue = value

          const time_start = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
          const time_end = parseInt(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1).getTime() / 1000)

          if (this.reserveData.reserveTime.length == 0 && !this.detailData.prd_time_end) {
            this.detailData.prd_time_start =
              new Date(this.dateValue + ' ' + new Date(time_start * 1000).getHours() + ':' + new Date(time_start * 1000).getMinutes()).getTime() /
              1000
            this.detailData.prd_time_end =
              new Date(this.dateValue + ' ' + new Date(time_end * 1000).getHours() + ':' + new Date(time_end * 1000).getMinutes()).getTime() / 1000
          } else if (this.detailData.prd_time_start) {
            this.detailData.prd_time_start =
              new Date(
                this.dateValue +
                  ' ' +
                  new Date(this.detailData.prd_time_start * 1000).getHours() +
                  ':' +
                  new Date(this.detailData.prd_time_start * 1000).getMinutes()
              ).getTime() / 1000
            this.detailData.prd_time_end =
              new Date(
                this.dateValue +
                  ' ' +
                  new Date(this.detailData.prd_time_end * 1000).getHours() +
                  ':' +
                  new Date(this.detailData.prd_time_end * 1000).getMinutes()
              ).getTime() / 1000
          }
        } else {
          this.detailData.prd_date = ''
          this.$q.notify({
            message: '该时间不在可预约时间范围内!',
            timeout: 500,
            position: 'top',
            color: 'red'
          })
        }
      }
    },
    hideNowPage () {
      this.$emit('dataList')
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
