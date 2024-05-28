<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs">
      <q-space />
      <q-btn color="primary" unelevated label="添加开支记录" :disable="checkDateArr && checkDateArr.length > 0 ? false : true" @click="showPopup(1)" />
      <q-btn
        color="positive"
        unelevated
        label="添加收入记录"
        :disable="checkDateArr && checkDateArr.length > 0 ? false : true"
        @click="showPopup(2)"
      />
      <q-btn color="warning" unelevated label="选择当前月" @click="checkNowMoth" />
      <q-btn color="grey" unelevated label="取消全部选择" @click="checkDateArr = []" />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <q-scroll-area class="fit full-height row">
        <div class="row">
          <div class="col-2">
            <q-scroller
              v-model="calendarDate"
              view="date"
              no-footer
              text-color="white"
              color="primary"
              inner-text-color="white"
              inner-color="primary"
              style="height: 200px"
              locale="zh-hans"
              no-day
              @input="changeMoth"
            ></q-scroller>
          </div>
          <div class="col-10">
            <q-calendar
              :show-month-label="false"
              @mouseup:day2="onClickDay2"
              v-model="calendarDate"
              view="month"
              bordered
              :day-height="150"
              class="full-height"
              locale="zh-hans"
              :no-active-date="false"
              :hide-outside-days="true"
            >
              <template #day-btn="{ timestamp }">
                <div class="absolute-top-left q-pa-sm text-weight-bold q-px-sm">
                  {{ timestamp.month }}月{{ timestamp.day }}日
                  <q-icon
                    size="sm"
                    color="primary"
                    v-if="checkDateArr.indexOf(timestamp.date) > -1"
                    @click="checkDateBtn(timestamp.date)"
                    name="check_circle"
                    class="cursor-pointer"
                  ></q-icon>

                  <q-icon
                    size="sm"
                    color="primary"
                    v-else
                    @click="checkDateBtn(timestamp.date)"
                    name="check_circle_outline"
                    class="cursor-pointer"
                  ></q-icon>
                </div>
              </template>

              <template #day="{ timestamp }">

                <q-scroll-area class="full-width q-pb-md q-pt-xs" style="height: 130px">
                  <q-list separator dense class="full-width items-center">
                    <q-item separator v-for="(item, key) in recordListData" :key="`item-${key}`" v-if="timestamp.date == $q_date.formatDate(item.pkr_create_time * 1000, 'YYYY-MM-DD')">
                      <q-item-section>
                        <q-item-label>

                          <q-badge v-if="parseInt(item.pkr_status) == 1" color="red" :label="item.pkr_item_name" />
                          <q-badge v-if="parseInt(item.pkr_status) == 2" color="primary"  :label="item.pkr_item_name" />
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-btn flat round @click="deleteRecord(item)" class="z-max" size="sm" dense color="red" icon="delete_forever" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </template>
            </q-calendar>
          </div>
        </div>
      </q-scroll-area>
    </div>

    <add-kzls-record ref="addRef" :type="activeName" v-if="addPoppupStatus" @dataList="getList" />
  </div>
</template>
<script>
import RecordAgChip from './RecordAgChip'
import RecordAgOperate from './RecordAgOperate'
import AddKzlsRecord from './AddKzlsRecord'

export default {
  name: 'KzlsRecord',
  props: ['activeName'],
  components: {
    RecordAgChip,
    RecordAgOperate,
    AddKzlsRecord
  },
  data () {
    return {
      calendarDate: '',
      recordListData: [

      ],
      checkDateArr: [],
      addPoppupStatus: false,
      starMothDate: '',
      endMothDate: ''
    }
  },
  created () {
    this.changeMoth()
  },
  methods: {
    checkNowMoth () {
      this.checkDateArr = this.formatEveryDay(this.starMothDate, this.endMothDate)
    },
    changeMoth () {
      this.starMothDate = this.$q_date.formatDate(this.getStartMothTime(this.calendarDate), 'YYYY-MM-DD')
      this.endMothDate = this.$q_date.formatDate(this.getEndMothTime(this.calendarDate), 'YYYY-MM-DD')
      this.$nextTick(() => {
        this.getList()
      })
    },
    getStartMothTime (nowMoth) {
      const date = new Date(nowMoth)
      date.setDate(1) // 将当前时间的日期设置成第一天
      const year = date.getFullYear() // 得到当前年份
      let month = date.getMonth() + 1 // 得到当前月份（0-11月份，+1是当前月份）
      month = month > 10 ? month : '0' + month // 补零
      const day = date.getDate() // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了

      return new Date(year + '-' + month + '-' + day) // 这里传入的是字符串
    },
    getEndMothTime (nowMoth) {
      const date = new Date(nowMoth)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      // 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
      const nextMonthFirthDay = new Date(year, month, 1) // 下个月的第一天

      const oneDay = 1000 * 60 * 60 * 24 // 一天的时间毫秒数
      const endDay = new Date(nextMonthFirthDay - oneDay)
      const day = endDay.getDate() // 本月最后一天

      // 这里传入的是字符串格式的时间，返回的是传入字符串的时间
      return new Date(year + '-' + month + '-' + day)
    },

    formatEveryDay (start, end) {
      const dateList = []
      const startTime = this.getDate(start)
      const endTime = this.getDate(end)

      while (endTime.getTime() - startTime.getTime() >= 0) {
        const year = startTime.getFullYear()
        const month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1
        const day = startTime.getDate().toString().length == 1 ? '0' + startTime.getDate() : startTime.getDate()
        dateList.push(year + '-' + month + '-' + day)
        startTime.setDate(startTime.getDate() + 1)
      }
      return dateList
    },

    getDate (datestr) {
      const temp = datestr.split('-')
      const date = new Date(temp[0], temp[1] - 1, temp[2])
      return date
    },

    onClickResource2 (resource) {
      console.log('resource', resource)
    },

    onClickResourceHeader2 (data) {
      console.log('click:resource:header2:', data)
    },

    onResourceExpanded (data) {
      console.log('expanded: ', data)
    },
    onModelChanged () {},
    onClickDayHeader2 () {},
    onClickResourceDay2 (timestamp) {
      console.log('timestamp', timestamp)
    },
    onClickDay2 (data) {
      // const dateIndex = this.checkDateArr.indexOf(data.scope.timestamp.date)
      // if (dateIndex > -1) {
      //   this.checkDateArr.splice(dateIndex, 1)
      // } else {
      //   this.checkDateArr.push(data.scope.timestamp.date)
      // }
      console.log('data', data.scope.timestamp.date)
    },
    checkDateBtn (date) {
      console.log('date', date)
      const dateIndex = this.checkDateArr.indexOf(date)
      if (dateIndex > -1) {
        this.checkDateArr.splice(dateIndex, 1)
      } else {
        this.checkDateArr.push(date)
      }
    },

    // 查询开支记录
    getList () {
      this.addPoppupStatus = false
      const obj = {}
      obj.starMothDate = this.starMothDate
      obj.endMothDate = this.endMothDate

      this.$store
        .dispatch('commonKzls/getRecordListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.recordListData = res.data ? res.data : []
            // this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    },

    // 显示弹窗方法
    showPopup (val) {
      this.addPoppupStatus = true

      this.$nextTick(() => {
        this.$refs.addRef.init(val, this.checkDateArr)
      })
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    deleteRecord (item) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${item.pkr_item_name}"的开支记录吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: item.id
          }
          this.$store.dispatch('commonKzls/delRecordAll', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除开支记录!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              // this.params.context.getList()
            }
          })
        })
    }
  }
}
</script>
