<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent position="right" full-height>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-pa-sm q-pb-md">
          <div class="text-center full-width">新建预约</div>
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll;" class="fit full-height">
            <q-form ref="addReserveFormRef" class="row full-width">
              <q-card flat bordered class="full-width">
                <q-card-section>
                  <div class="text-subtitle2">
                    选择餐区
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="row q-pa-sm q-col-gutter-sm items-center ">
                  <div class="col-4  text-center">
                    <q-btn
                      :outline="!(-1 == desk_type_id)"
                      :unelevated="-1 == desk_type_id"
                      rounded
                      color="green-9"
                      class="q-px-xs text-subtitle2 q-mr-sm full-width"
                      label="到店分配"
                      @click="changeDeskType({ id: -1 })"
                    />
                  </div>
                  <div class="col-4  text-center" :key="'desk-type-' + key" v-for="(item, key) in deskTypeDataList">
                    <q-btn
                      :outline="!(item.id == desk_type_id)"
                      :unelevated="item.id == desk_type_id"
                      rounded
                      color="green-9"
                      class="q-px-xs text-subtitle2 q-mr-sm full-width"
                      :label="item.dt_name"
                      @click="changeDeskType(item)"
                    />
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="full-width q-mt-sm" v-if="deskDataList && deskDataList.length > 0">
                <q-card-section>
                  <div class="text-subtitle2">
                    选择桌号
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="row q-pa-sm q-col-gutter-sm ">
                  <div class="col-4 text-center" v-for="(item, key) in deskDataList" :key="'desk' + key">
                    <q-btn
                      :outline="!(item.id == reserveRecordForm.drr_desk_id)"
                      :unelevated="item.id == reserveRecordForm.drr_desk_id"
                      rounded
                      color="green-9"
                      class="q-px-md text-subtitle2 q-mr-sm full-width"
                      @click="changeDesk(item)"
                      :disable="!item.lockStatus"
                    >
                      {{ item.dp_name }}
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="full-width q-mt-sm">
                <q-card-section>
                  <div class="text-subtitle2">
                    选择到店日期
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="row q-pa-none q-col-gutter-sm items-center">
                  <q-scroller
                      v-model="reserve_date"
                      view="date"
                      no-footer
                      text-color="white"
                      color="green-9"
                      inner-text-color="white"
                      inner-color="green-9"
                      style="height: 200px;"
                      locale="zh-hans"
                    ></q-scroller>
                </q-card-section>
              </q-card>

               <q-card flat bordered class="full-width q-mt-sm">
                <q-card-section>
                  <div class="text-subtitle2">
                    选择到店时间
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="row q-pa-sm q-col-gutter-sm">
                  <div class="col-4 text-center" v-for="(item, key) in timePeriod" :key="'desk' + key">
                    <q-btn
                    :outline="!(item.start == reserveRecordForm.drr_start_date)"
                    :unelevated="item.start == reserveRecordForm.drr_start_date"
                    rounded
                    color="green-9"
                    class="q-px-md text-subtitle2 q-mr-sm full-width"
                    @click="changeTimePeriod(item)"
                  >
                    {{ item.start }}
                  </q-btn>
                  </div>

                </q-card-section>
              </q-card>

              <q-card flat bordered class="full-width q-mt-sm">
                <q-card-section>
                  <div class="text-subtitle2">
                    预约人信息
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="row q-pa-sm q-col-gutter-sm">

                  <div class="col-12">
                    <q-input outlined bottom-slots v-model="reserveRecordForm.drr_start_date" disable dense label="预约时间" />
                  </div>

                  <div class="col-12">
                    <q-input outlined v-model="reserveRecordForm.drr_people_name" :rules="[(val) => !!val || '请输入姓名']" dense label="姓名" />
                  </div>

                  <div class="col-12">
                    <q-input
                      outlined
                      v-model="reserveRecordForm.drr_people_mobile"
                      :rules="[(val) => !!val || '请输入联系电话']"
                      dense
                      label="联系电话"
                    />
                  </div>

                  <div class="col-12">
                    <q-input outlined v-model="reserveRecordForm.drr_remark" type="textarea" :rows="3" dense label="备注" />
                  </div>
                </q-card-section>
              </q-card>
            </q-form>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddReserve',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      desk_type_id: -1,
      reserveRecordForm: {
        drr_desk_id: -1,
        drr_start_date: '',
        drr_end_date: '',
        drr_people_name: '',
        drr_people_mobile: '',
        drr_status: 2
      },
      typeData: {
        gt_name: '',
        gt_sort: '0',
        gt_description: ''
      },
      libInStoreList: [],
      selectStoreData: [],
      deskTypeDataList: [],
      reserveConfigInfo: [],
      limitDatePeriod: [],
      reserve_date: '',
      deskDataList: [],
      timePeriod: [],
      reserveRecordId: 0
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (reserveDate, reserveTime) {
      this.reserve_date = reserveDate
      this.reserveRecordForm.drr_start_date = reserveTime
      this.showDialog = true
      this.getReserveConfig()
    },
    edit (reserveRecordId) {
      if (reserveRecordId > 0) {
        this.reserveRecordId = reserveRecordId
        this.$nextTick(() => {
          this.getReserveRecordInfo()
        })
      }
    },

    getReserveRecordInfo () {
      const params = {
        id: this.reserveRecordId
      }
      this.$store
        .dispatch('reserveorder/getRecordInfo', params)
        .then((res) => {
          if (res.code == 200) {
            this.showDialog = true

            this.reserve_date = this.$q_date.formatDate(res.data.drr_start_date * 1000, 'YYYY-MM-DD')

            this.reserveRecordForm = res.data ? res.data : {}
            this.reserveRecordForm.drr_start_date = this.$q_date.formatDate(res.data.drr_start_date * 1000, 'HH:mm')

            this.getReserveConfig()
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

    getReserveConfig () {
      const params = {}
      this.$store
        .dispatch('reserveorder/getConfig', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskTypeDataList = res.data ? res.data.deskTypeDataList : []
            this.reserveConfigInfo = res.data ? res.data.reserveConfigInfo : {}

            if (this.reserveConfigInfo && this.reserveConfigInfo.drc_time_period && this.reserveConfigInfo.drc_time_period.length > 0) {
              this.timePeriod = this.reserveConfigInfo.drc_time_period
              // this.desk_type_id = this.deskTypeDataList[0].id
              // this.$nextTick(() => {
              //   this.getReserveDeskPosition()
              // })
            }
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

    getReserveDeskPosition () {
      const params = {
        desk_type_id: this.desk_type_id,
        reserve_date: this.reserve_date,
        reserve_time: this.reserveRecordForm.drr_start_date
      }
      this.$store
        .dispatch('reserveorder/getReserveDeskPosition', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskDataList = res.data ? res.data : []
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
      this.$refs.addReserveFormRef.validate().then((success) => {
        if (success) {
          if (!this.reserveRecordForm.drr_start_date || !this.reserveRecordForm.drr_start_date) {
            this.$q.notify({
              message: '错误',
              caption: '请选择到店时间段',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            return false
          }

          if (!this.reserve_date) {
            this.$q.notify({
              message: '错误',
              caption: '请选择到店日期',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            return false
          }

          if (parseInt(this.desk_type_id) > 0) {
            if (parseInt(this.reserveRecordForm.drr_desk_id) <= 0) {
              this.$q.notify({
                message: '错误',
                caption: '请选择指定桌号',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })

              return false
            }
          }

          this.addButtonDisabled = true
          const params = {
            reserve_date: this.reserve_date,
            ...this.reserveRecordForm,
            drr_desk_type_id: this.desk_type_id
          }
          this.$store
            .dispatch('reserveorder/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '预约成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.hideNowPage()
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
              this.addButtonDisabled = false
            })
            .catch((err) => {
              this.addButtonDisabled = false
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
      this.addButtonDisabled = false
      this.showDialog = false
      this.$emit('dataList')
    },
    changeDeskType (item) {
      this.desk_type_id = item.id
      this.reserveRecordForm.drr_desk_id = -1
      if (this.desk_type_id > 0) {
        this.$nextTick(() => {
          this.getReserveDeskPosition()
        })
      }
    },
    changeDatePeriod (item) {
      this.reserve_date = item.timeStamp
      this.$nextTick(() => {
        this.getReserveDeskPosition()
      })
    },
    changeDesk (item) {
      this.reserveRecordForm.drr_desk_id = item.id
    },
    changeTimePeriod (item) {
      this.reserveRecordForm.drr_start_date = item.start
    }
  }
}
</script>
