<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-px-xs full-height bg-white row" v-if="parseInt(reserveConfig.prp_status) == 1">
      <div class="col-12 col-md-10 q-pa-xs full-height">
        <q-calendar
          @change="onModelChanged"
          @click:date2="onClickDate2"
          @click:day:header2="onClickDayHeader2"
          @click:resource:day2="onClickResourceDay2"
          @click:resource:header2="onClickResourceHeader2"
          @expanded="onResourceExpanded"
          v-model="calendarDate"
          :view="calendarViewType"
          :resources="resourceData"
          bordered
          :resource-height="150"
          :interval-height="180"
          :resource-width="150"
          class="full-height"
          locale="zh-hans"
        >
          <template #scheduler-resources-header="scope">
            <div class="full-width text-center row items-center justify-center" v-if="calendarViewType == 'day-scheduler'">
              <q-btn outline round class="color_cinnabar" @click="onChangeView" padding="xs" icon="las la-angle-left" />
            </div>
          </template>
          <template #scheduler-resource="{ resource /*, index */ }">
            <div class="full-width cursor-pointer">
              <div class="text-center  ">
                <span>{{ resource.time_hour_minute }}</span>
                <br />
                <span class="text-caption">
                  {{ calendarViewType == 'day-scheduler' ? '剩余预约人数：' : '可预约人数：' }}

                  <span class="text-subtitle1 text-weight-bold">{{ reserveCount(resource) }} </span>
                </span>
              </div>

              <div
                class="text-center q-mt-sm"
                @click="onClickResource2(resource)"
                v-if="
                  calendarViewType == 'day-scheduler' &&
                    reserveCount(resource) > 0 &&
                    !(reserveConfig && reserveConfig.prp_today_limit && parseInt(reserveConfig.prp_today_limit) == 2)
                "
              >
                <q-icon size="lg" name="las la-plus-circle" class="color_cinnabar"></q-icon>
              </div>
            </div>
          </template>

          <template #scheduler-resource-day="{ timestamp, /*, index */resource }">
            <div class="q-pa-xs row q-col-gutter-sm full-height items-center" v-if="calendarViewType == 'day-scheduler'">
              <template v-for="(item, key) in currentReserveDetail">
                <div
                  class="col-2"
                  v-if="
                    resource.time_hour_minute == item.prd_time_hour + ':' + item.prd_time_minute &&
                      timestamp.day == item.prd_time_day &&
                      timestamp.month == item.prd_time_month &&
                      timestamp.year == item.prd_time_year
                  "
                >
                  <q-card class="q-pa-none" flat bordered>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar>
                          <q-icon size="lg" class="color_cinnabar" name="lar la-user-circle"></q-icon>
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.user ? item.user.pru_name : '到店分配' }}</q-item-label>
                        <q-item-label caption>{{ item.prd_people_name }}</q-item-label>
                        <q-item-label caption>{{ item.prd_people_mobile }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-space />
                    <q-card-actions class="justify-around ">
                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="las la-play-circle"
                        @click="updateStatusData(item.id, 2)"
                        v-if="parseInt(item.prd_status) == 1"
                      >
                        <q-tooltip>
                          接单
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="las la-check-circle"
                        @click="updateStatusData(item.id, 3)"
                        v-if="parseInt(item.prd_status) == 2"
                      >
                        <q-tooltip>
                          完成
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="las la-times-circle"
                        @click="updateStatusData(item.id, 4)"
                        v-if="parseInt(item.prd_status) == 1 || parseInt(item.prd_status) == 2"
                      >
                        <q-tooltip>
                          撤单
                        </q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" @click="viewReserveDetail(item)" icon="las la-eye">
                        <q-tooltip>
                          详情
                        </q-tooltip>
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
            </div>
            <div class="q-pa-xs row q-col-gutter-sm full-height items-center" v-else>
              <template v-for="(item, key) in weekReserveCountData">
                <q-list
                  class="full-width"
                  v-if="
                    resource.time_hour_minute == item.hour_minute &&
                      timestamp.day == item.day &&
                      timestamp.month == item.month &&
                      timestamp.year == item.year
                  "
                >
                  <q-item v-if="item.notAcceptQuantity > 0">
                    <q-item-section avatar>
                      <q-icon class="color_cinnabar" name="las la-bell-slash" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>未接单</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.notAcceptQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="item.waitQuantity > 0" />
                  <q-item v-if="item.waitQuantity > 0">
                    <q-item-section avatar>
                      <q-icon color="positive" name="las la-play-circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>已接单</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.waitQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="item.revokeQuantity > 0" />
                  <q-item v-if="item.revokeQuantity > 0">
                    <q-item-section avatar>
                      <q-icon color="red" name="las la-times-circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>已撤单</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.revokeQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="item.completeQuantity > 0" />
                  <q-item v-if="item.completeQuantity > 0">
                    <q-item-section avatar>
                      <q-icon color="primary" name="las la-check-circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>已完成</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-dark text-weight-bold">
                        {{ item.completeQuantity }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </div>
          </template>
        </q-calendar>
      </div>
      <div class="col-12 col-md-2  q-pa-xs q-pb-xl">
        <!-- <q-date v-model="calendarDate" mask="YYYY-MM-DD" minimal flat bordered /> -->
        <q-scroll-area class="fit full-height q-pb-md ">
          <q-scroller
            v-model="calendarDate"
            view="date"
            no-footer
            text-color="white"
            color="#B93A26"
            inner-text-color="white"
            inner-color="#B93A26"
            style="height: 200px;"
            locale="zh-hans"
          ></q-scroller>

          <q-list bordered padding v-if="currentReserveItem && currentReserveItem.id">
            <q-item-label header>预约信息</q-item-label>

            <q-item>
              <q-item-section>
                <q-item-label caption>预约日期</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">
                  {{ currentReserveItem.prd_time_year }}年{{ currentReserveItem.prd_time_month }}月{{ currentReserveItem.prd_time_day }}日
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>预约时间</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.prd_time_hour }}:{{ currentReserveItem.prd_time_minute }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="currentReserveItem.prd_member_id > 0">
              <q-item-section> <q-item-label caption>会员</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark" lines="2"
                  >{{ currentReserveItem.prd_member_name }}（{{ currentReserveItem.prd_member_card_number }}）</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>联系人</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.prd_people_name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>联系电话</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.prd_people_mobile }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section> <q-item-label caption>备注</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.prd_remark }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="parseInt(currentReserveItem.prd_status) == 4">
              <q-item-section> <q-item-label caption>取消备注</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.prd_cancel_remark }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="currentReserveItem.prd_user_id > 0">
              <q-item-section> <q-item-label caption>员工</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.user ? currentReserveItem.user.pru_name : '' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-else>
              <q-item-section> <q-item-label caption>员工</q-item-label></q-item-section>
              <q-item-section side>
                <q-item-label class="text-dark">{{ currentReserveItem.user ? currentReserveItem.user.pru_name : '到店分配' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-list separator class="full-width q-mt-md" v-if="currentReserveItem.detailItem && currentReserveItem.detailItem.length > 0">
              <q-item-label header>服务项</q-item-label>

              <q-item :key="'item-' + key" v-for="(item, key) in currentReserveItem.detailItem">
                <q-item-section>{{ item.rdi_goo_name }}</q-item-section>
                <q-item-section side>
                  <q-icon color="purple" size="xs" name="las la-check-circle"></q-icon>
                </q-item-section>
              </q-item>
            </q-list>
          </q-list>
        </q-scroll-area>

        <div class="row q-gutter-sm ">
          <div class="col" v-if="parseInt(currentReserveItem.prd_status) < 3">
            <q-btn class="full-width bg_rouge" outline @click="reserveDetailEdit(currentReserveItem)" label="修改" />
          </div>
          <div
            class="col"
            v-if="
              currentReserveItem.detailItem && currentReserveItem.detailItem.length > 0 && parseInt(currentReserveItem.prd_settle_invoice_id) <= 0
            "
          >
            <q-btn
              class="full-width bg_cinnabar text-white"
              unelevated
              :to="{ name: 'consume', query: { reserveId: currentReserveItem.id } }"
              label="去结账"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height row bg-white justify-center full-width " v-else>
      <q-card flat class="text-center">
        <q-card-section class="text-h6 text-red"> 未开启预约功能 </q-card-section>
        <q-card-section>
          <q-spinner-ball size="150px" class="color_cinnabar" />
        </q-card-section>
      </q-card>
    </div>

    <q-dialog full-height v-model="reserveDialogStatus" persistent position="right">
      <q-card
        :style="{
          width: $q.screen.width * 0.5 + 'px',
          'min-width': $q.screen.width * 0.5 + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white row q-px-sm q-pb-md">
            <div class="text-subtitle1">预约</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="clearTimeData" />
          </div>
          <div class="col-shrink q-pa-sm full-height bg-white ">
            <q-scroll-area class="fit full-height">
              <q-form ref="reserveFormRef">
                <div class="row items-start">
                  <div class="col-6 q-pa-sm row ">
                    <div class="col-12">
                      <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
                    </div>
                    <div class="col-12 q-mt-sm">
                      <q-input
                        dense
                        outlined
                        v-model="reserveDataForm.prd_people_name"
                        label="联系人"
                        :rules="[(val) => (val && !!val) || '请填写联系人']"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        dense
                        outlined
                        v-model="reserveDataForm.prd_people_mobile"
                        label="联系电话"
                        :rules="[(val) => (val && !!val) || '请填写联系电话']"
                      />
                    </div>
                    <div class="col-12">
                      <q-input dense outlined type="textarea" :rows="2" v-model="reserveDataForm.prd_remark" label="备注" />
                    </div>
                  </div>
                  <div class="col-6 q-pa-sm">
                    <div style="height:200px;" v-if="selectTimeStatus">
                      <q-scroller
                        disable
                        v-model="currentReserveTime"
                        locale="zh-hans"
                        no-footer
                        rounded-borders
                        view="date-time"
                        color="#B93A26"
                      ></q-scroller>
                    </div>
                    <div class="row q-col-gutter-sm" v-if="!selectTimeStatus">
                      <div class="col-auto" v-for="(item, key) in resourceData">
                        <q-btn
                          outline
                          rounded
                          padding="xs md"
                          @click="updateReserveTime(item)"
                          :color="
                            currentReserveItem.prd_time_hour + ':' + currentReserveItem.prd_time_minute == item.time_hour_minute
                              ? 'color_cinnabar'
                              : 'dark'
                          "
                          :label="item.time_hour_minute"
                        />
                      </div>
                    </div>
                    <div class="row q-mt-md full-width q-col-gutter-xs">
                      <div class="col-12">
                        选择员工
                      </div>
                      <div class="col-3 ">
                        <q-card
                          class="text-center  full-width"
                          :class="{ 'selected-border color_cinnabar': parseInt(reserveDataForm.prd_user_id) == 0 ? true : false }"
                          flat
                          @click="setGoodsList(null, 'all', 'change')"
                          bordered
                        >
                          <q-icon
                            size="md"
                            :class="parseInt(reserveDataForm.prd_user_id) == 0 ? 'color_cinnabar' : 'text-dark'"
                            name="las la-store-alt"
                            class="q-mt-md"
                          />
                          <q-card-section class="q-pa-sm">
                            <div class="text-subtitle2">到店分配</div>
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-3 " v-for="(item, key) in userData">
                        <q-card
                          class="text-center full-width"
                          :class="{ 'selected-border  color_cinnabar': parseInt(reserveDataForm.prd_user_id) == parseInt(item.id) ? true : false }"
                          flat
                          @click="setGoodsList(item, 'user', 'change')"
                          bordered
                        >
                          <q-avatar class="q-mt-sm" v-if="item.coverImage && item.coverImage.path" size="md">
                            <q-img :src="`${$q.localStorage.getItem('mychainstore_system_local').attach_url}` + item.coverImage.path"  :ratio="1" >
                              <template v-slot:error>
                                <q-icon
                                  size="md"
                                  :color="parseInt(reserveDataForm.prd_user_id) == parseInt(item.id) ? 'color_cinnabar' : 'text-dark'"
                                  name="las la-user-tie"
                                />
                              </template>
                            </q-img>
                          </q-avatar>
                          <q-avatar v-else>
                            <q-icon
                              size="md"
                              :color="parseInt(reserveDataForm.prd_user_id) == parseInt(item.id) ? 'color_cinnabar' : 'dark'"
                              name="las la-user-tie"
                              class="q-mt-sm"
                            />
                          </q-avatar>
                          <q-card-section class="q-pa-sm">
                            <div class="text-subtitle2">{{ item.pru_name }}</div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>

                    <q-list bordered separator class="full-width q-mt-md" v-if="goodsList && goodsList.length > 0">
                      <q-item-label header>选择服务项</q-item-label>

                      <q-item @click="checkGoodsData(item)" :key="'goods-' + key" clickable v-for="(item, key) in goodsList">
                        <q-item-section>{{ item.goo_name }}</q-item-section>
                        <q-item-section side>
                          <q-icon color="purple" name="las la-check-circle" v-if="reserveItemData.indexOf(item.id) > -1"></q-icon>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-form>
            </q-scroll-area>
          </div>
          <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
            <q-btn class="q-px-xl bg_cinnabar text-white" unelevated label="保存" @click="saveReserveDetail" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { date } from 'quasar'

export default {
  name: 'ReserveCalendar',
  components: {},
  data () {
    return {
      resourceData: [],
      reserveDataForm: {
        prd_date: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_time_year: '',
        prd_time_month: '',
        prd_time_day: '',
        prd_time_hour: '',
        prd_time_minute: '',
        prd_time_second: '',
        prd_people_name: '',
        prd_people_mobile: '',
        prd_remark: '',
        prd_user_id: '0',
        prd_status: '2'
      },
      planDate: '',
      calendarDate: '',

      reserveDialogStatus: false,
      userData: [],
      reserveConfig: {},
      goodsList: [],
      allGoodsData: [],
      reserveItemData: [],
      currentReserveTime: '',
      currentReserveDetail: [],
      currentReserveItem: {},
      selectTimeStatus: true,
      calendarViewType: 'week-scheduler',
      weekReserveCountData: [],
      limitPeopleNumber: 0
    }
  },
  mounted () {},
  created () {
    const timeStamp = Date.now()
    // this.planDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.calendarDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')

    this.getReserveConfigData()
  },
  computed: {},
  methods: {
    getWeekReserveCount (start, end) {
      this.$store
        .dispatch('reserve/getWeekReserveCount', {
          start,
          end
        })
        .then((res) => {
          if (res.code == 200) {
            this.weekReserveCountData = res.data ? res.data : []
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
    },

    reserveCount (resource) {
      if (resource && resource.limit_people_number && resource.limit_people_number > 0) {
        let count = 0

        const calendarDate = this.calendarDate

        const y = this.$q_date.formatDate(calendarDate, 'YYYY')
        const m = this.$q_date.formatDate(calendarDate, 'M')
        const d = this.$q_date.formatDate(calendarDate, 'DD')
        const currentReserveDetail = this.currentReserveDetail
        if (currentReserveDetail && currentReserveDetail.length > 0) {
          currentReserveDetail.forEach((item, key) => {
            if (d == item.prd_time_day && m == item.prd_time_month && y == item.prd_time_year) {
              if (parseInt(item.prd_status) < 4) {
                if (resource.time_hour_minute == item.prd_time_hour + ':' + item.prd_time_minute) {
                  count++
                }
              }
            }
          })
        }
        return resource.limit_people_number - count
      }
    },

    getCurrentReserveDetail () {
      this.$store
        .dispatch('reserve/getCurrentReserveDetail', {
          year: this.$q_date.formatDate(this.calendarDate, 'YYYY'),
          month: this.$q_date.formatDate(this.calendarDate, 'M'),
          day: this.$q_date.formatDate(this.calendarDate, 'DD')
        })
        .then((res) => {
          if (res.code == 200) {
            this.currentReserveDetail = res.data ? res.data : []
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
    },

    clearTimeData () {
      this.reserveDialogStatus = false
      this.reserveDataForm = {
        prd_date: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_time_year: '',
        prd_time_month: '',
        prd_time_day: '',
        prd_time_hour: '',
        prd_time_minute: '',
        prd_time_second: '',
        prd_people_name: '',
        prd_people_mobile: '',
        prd_remark: '',
        prd_user_id: '0',
        prd_status: '2'
      }
      this.currentReserveItem = {}
      this.$nextTick(() => {
        this.getCurrentReserveDetail()
      })
    },

    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.reserveDataForm.prd_member_id = val.id
          this.reserveDataForm.prd_member_name = val.mem_memberName
          this.reserveDataForm.prd_member_mobile = val.mem_memberMobile
          this.reserveDataForm.prd_member_card_number = val.mem_memberCardNum
          if (!this.reserveDataForm.prd_people_name) {
            this.reserveDataForm.prd_people_name = val.mem_memberRealName
          }
          if (!this.reserveDataForm.prd_people_mobile) {
            this.reserveDataForm.prd_people_mobile = val.mem_memberMobile
          }
        }
      }
    },

    saveReserveDetail () {
      this.$refs.reserveFormRef.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch('reserve/setDetailData', {
              ...this.reserveDataForm,
              reserveItemData: this.reserveItemData,
              limitPeopleNumber: this.limitPeopleNumber
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '提示',
                  caption: '预约已保存',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.reserveDialogStatus = false
                this.clearTimeData()
                this.getCurrentReserveDetail()
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: '保存预约记录失败',
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
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },

    checkGoodsData (item) {
      if (this.reserveItemData.indexOf(item.id) > -1) {
        this.reserveItemData.splice(this.reserveItemData.indexOf(item.id), 1)
      } else {
        this.reserveItemData.push(item.id)
      }
    },

    setGoodsList (item, type, status) {
      if (type == 'user') {
        this.reserveDataForm.prd_user_id = item.id
        if (item.goodsLinkArray && item.goodsLinkArray.length > 0) {
          this.goodsList = item.goodsLinkArray
        } else {
          this.goodsList = []
        }
      }

      if (type == 'all') {
        this.reserveDataForm.prd_user_id = 0
        this.goodsList = this.allGoodsData
      }

      if (status == 'change') {
        this.reserveItemData = []
      }
    },

    getReserveConfigData () {
      this.$store
        .dispatch('reserve/getReserveConfigData', {})
        .then((res) => {
          if (res.code == 200) {
            this.userData = res.data && res.data.userData ? res.data.userData : []
            this.reserveConfig = res.data && res.data.reserveConfig ? res.data.reserveConfig : {}
            this.allGoodsData = res.data && res.data.allGoodsData ? res.data.allGoodsData : []

            this.resourceData = this.reserveConfig && this.reserveConfig.prp_period ? this.reserveConfig.prp_period : []
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
    },

    updateStatusData (id, status) {
      const messageOne = status == 2 ? '进行接单？' : '已完成预约?'
      const message = status == 4 ? '撤回预约？' : messageOne
      this.$q
        .dialog({
          title: '提示',
          message: `确定${message}`,
          cancel: true
        })
        .onOk(() => {
          this.updateDetailData(id, {
            prd_status: status
          })
        })
    },

    updateDetailData (id, value) {
      const data = {
        id,
        ...value
      }
      this.$store
        .dispatch('reserve/setDetailData', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '提示',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getCurrentReserveDetail()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getCurrentReserveDetail()
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

    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    onModelChanged ({ start, end }) {
      if (this.calendarViewType == 'week-scheduler') {
        this.getWeekReserveCount(start.date, end.date)
      }
    },
    onClickDate2 (data) {
      console.log('click:date2:', data)
    },
    onClickDayHeader2 (data) {
      // console.log('click:day:header2:', data)
      this.calendarViewType = 'day-scheduler'
      this.$nextTick(() => {
        this.getCurrentReserveDetail()
      })
    },
    onChangeView (data) {
      // console.log('click:day:header2:', data)
      this.calendarViewType = 'week-scheduler'
    },
    onClickResourceDay2 (data, a) {
      console.log('click:resource:day2: ', data.scope.resource.limit_people_number)
    },

    reserveDetailEdit (data) {
      if (data && data.id) {
        this.reserveDialogStatus = true
        this.selectTimeStatus = false
        this.$nextTick(() => {
          this.reserveDataForm = data
          if (data && data.prd_member_id && data.prd_member_id > 0) {
            this.$refs.memberCardReading.getMemberIdReturnData(data.prd_member_id)
          }

          if (data && data.prd_user_id && data.prd_user_id > 0) {
            const userIndex = _.findIndex(this.userData, function (o) {
              return parseInt(o.id) == parseInt(data.prd_user_id)
            })
            if (userIndex > -1) {
              this.setGoodsList(this.userData[userIndex], 'user')
            } else {
              this.setGoodsList(null, 'all')
            }
          } else {
            this.setGoodsList(null, 'all')
          }

          if (data && data.detailItem && data.detailItem.length > 0) {
            this.reserveItemData = data.detailItem.map((item) => {
              return item.rdi_goods_id
            })
          }

          // this.reserveItemData
        })
      }
    },

    updateReserveTime (resource) {
      const count = this.reserveCount(resource)

      if (parseInt(count) <= 0) {
        this.$q.notify({
          message: '失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '当前时间段可预约人数已满,不可预约' + count,
          color: 'red'
        })
        return false
      } else {
        const hourMinute = resource.time_hour_minute.split(':')
        this.reserveDataForm.prd_time_hour = hourMinute[0]
        this.reserveDataForm.prd_time_minute = hourMinute[1]
      }
    },

    viewReserveDetail (data) {
      this.currentReserveItem = data
      setTimeout(() => {
        this.reserveDialogStatus = false
      }, 1000)
    },

    onClickResource2 (resource) {
      this.setGoodsList(null, 'all')

      const todayLimitStatus = !!(this.reserveConfig && this.reserveConfig.prp_today_limit && parseInt(this.reserveConfig.prp_today_limit) == 2)

      if (todayLimitStatus) {
        this.$q.notify({
          message: '失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '已设置不可预约当天',
          color: 'red'
        })
        return false
      }

      const count = this.reserveCount(resource)

      if (parseInt(count) <= 0) {
        this.$q.notify({
          message: '失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '当前时间段可预约人数已满,不可预约',
          color: 'red'
        })
        return false
      }
      this.selectTimeStatus = true
      this.reserveDialogStatus = true

      this.$nextTick(() => {
        const calendarDate = this.calendarDate
        this.limitPeopleNumber = resource.limit_people_number
        this.reserveDataForm.prd_time_year = this.$q_date.formatDate(calendarDate, 'YYYY')
        this.reserveDataForm.prd_time_month = this.$q_date.formatDate(calendarDate, 'M')
        this.reserveDataForm.prd_time_day = this.$q_date.formatDate(calendarDate, 'DD')

        if (resource && resource.time_hour_minute) {
          const hourMinute = resource.time_hour_minute.split(':')

          this.reserveDataForm.prd_time_hour = hourMinute[0]
          this.reserveDataForm.prd_time_minute = hourMinute[1]
          this.currentReserveTime =
            this.reserveDataForm.prd_time_year +
            '-' +
            this.reserveDataForm.prd_time_month +
            '-' +
            this.reserveDataForm.prd_time_day +
            ' ' +
            resource.time_hour_minute
        }

        // console.log('this.currentReserveTime', this.reserveDataForm)
      })
    },

    onClickResourceHeader2 (data) {
      console.log('click:resource:header2:', data)
    },

    onResourceExpanded (data) {
      console.log('expanded: ', data)
    }
  }
}
</script>

<style lang="sass">
.calendar-container
  position: relative

.my-event
  width: 100%
  position: absolute
  font-size: 12px

.full-width
  left: 0
  width: 100%

.left-side
  left: 0
  width: 49.75%

.right-side
  left: 50.25%
  width: 49.75%

.selected-border
  border: 1px solid #B93A26

.my-resource-header
  display: flex
  flex-direction: row
  flex: 1
  justify-content: center
  align-items: center
  position: relative
  font-size: 10px
  font-weight: 700
</style>
