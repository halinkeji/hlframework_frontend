<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">新建预约</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
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
                  <div class="col-4  text-center" :key="'desk-type-' + key" v-for="(item, key) in deskTypeDataList">
                    <q-btn
                    :outline="!(item.id == desk_type_id)"
                    :unelevated="item.id == desk_type_id"
                    rounded
                    color="primary"
                    class="q-px-xs text-subtitle2 q-mr-sm full-width"
                    :label="item.dt_name"
                    @click="changeDeskType(item)"
                  />
                  </div>

                </q-card-section>
              </q-card>

              <q-card flat bordered class="full-width q-mt-sm">
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
                    color="primary"
                    class="q-px-md text-subtitle2 q-mr-sm full-width"
                     @click="changeDesk(item)"
                  >
                    <div class="row">
                      <div>
                        {{ item.dp_name }}
                      </div>
                    </div>
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

                <q-card-section class="row q-pa-sm q-col-gutter-sm items-center">
                  <div class="col-4 text-center"  :key="'limit-date-' + key" v-for="(item, key) in limitDatePeriod">
                    <q-btn
                    :outline="!(item.timeStamp == reserve_date)"
                    :unelevated="item.timeStamp == reserve_date"
                    rounded
                    color="primary"
                    class="q-px-md text-subtitle2 q-mr-sm full-width"
                    @click="changeDatePeriod(item)"
                  >
                    <div class="row">
                      <div>{{ item.date }}<br />{{ item.week }}</div>
                    </div>
                  </q-btn>
                  </div>
                </q-card-section>
              </q-card>

               <q-card flat bordered class="full-width q-mt-sm">
                <q-card-section>
                  <div class="text-subtitle2">
                    选择到店时间段
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="row q-pa-sm q-col-gutter-sm">
                  <div class="col-4 text-center" v-for="(item, key) in timePeriod" :key="'desk' + key">
                    <q-btn
                    :outline="!(item.start == reserveRecordForm.drr_start_date && item.end == reserveRecordForm.drr_end_date)"
                    :unelevated="item.start == reserveRecordForm.drr_start_date && item.end == reserveRecordForm.drr_end_date"
                    rounded
                    color="primary"
                    class="q-px-md text-subtitle2 q-mr-sm full-width"
                    :disable="!item.lockStatus"
                    @click="changeTimePeriod(item)"
                  >
                    <div class="row">
                      <div>{{ item.start }} - {{ item.end }}</div>
                    </div>
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
                   <q-input outlined v-model="reserveRecordForm.drr_people_name" :rules="[(val) => !!val || '请输入姓名']" dense label="姓名" />
                 </div>

                 <div class="col-12">
                  <q-input outlined v-model="reserveRecordForm.drr_people_mobile" :rules="[(val) => !!val || '请输入联系电话']" dense label="联系电话" />
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
      desk_type_id: 0,
      reserveRecordForm: {
        drr_desk_id: '',
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
      timePeriod: []
    }
  },
  created () {

  },
  mounted () {},
  computed: {

  },
  methods: {
    init () {
      this.showDialog = true
      this.getReserveConfig()
    },
    getReserveConfig () {
      const params = {}
      this.$store
        .dispatch('reserveorder/getConfig', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskTypeDataList = res.data ? res.data.deskTypeDataList : []
            this.reserveConfigInfo = res.data ? res.data.reserveConfigInfo : {}
            this.limitDatePeriod = res.data ? res.data.limitDatePeriod : []
            if (this.deskTypeDataList && this.deskTypeDataList.length > 0 && this.limitDatePeriod && this.limitDatePeriod.length > 0) {
              this.desk_type_id = this.deskTypeDataList[0].id
              this.reserve_date = this.limitDatePeriod[0].timeStamp
              this.$nextTick(() => {
                this.getReserveDeskPosition()
              })
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
      this.reserveRecordForm.drr_start_date = ''
      this.reserveRecordForm.drr_end_date = ''
      this.reserveRecordForm.drr_desk_id = ''

      const params = {
        desk_type_id: this.desk_type_id,
        reserve_date: this.reserve_date
      }
      this.$store
        .dispatch('reserveorder/getReserveDeskPosition', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskDataList = res.data ? res.data : []
            if (this.deskDataList && this.deskDataList.length > 0) {
              this.reserveRecordForm.drr_desk_id = this.deskDataList[0].id

              this.timePeriod = this.deskDataList[0].time_period

              // if (this.timePeriod && this.timePeriod.length > 0) {
              //   this.reserveRecordForm.drr_start_date = this.timePeriod[0].start
              //   this.reserveRecordForm.drr_end_date = this.timePeriod[0].end
              // }
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

          this.addButtonDisabled = true
          const params = {
            reserve_date: this.reserve_date,
            ...this.reserveRecordForm
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
      this.$nextTick(() => {
        this.getReserveDeskPosition()
      })
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
      this.reserveRecordForm.drr_end_date = item.end
    }
  }
}
</script>
