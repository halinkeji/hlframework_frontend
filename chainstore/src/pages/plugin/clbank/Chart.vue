<template>
  <div class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="col-shrinkq-py-sm q-px-xs row q-gutter-sm items-center">
          <div class="col-12">
            <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
          </div>
          <div class="col-12 col-md-2">
            <q-select
              outlined
              dense
              v-model="cr_unit_id"
              option-value="id"
              option-label="cu_name"
              :options="unitDataList"
              label="请选择材料"
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-2">
            <q-input outlined readonly dense v-model="startTime" label="开始时间">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale"  transition-hide="scale">
                    <q-date v-model="startTime" minimal default-view="Years" mask="YYYY-MM">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-12">
            <q-input outlined readonly dense label="结束时间" v-model="endTime">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">

                    <q-date v-model="endTime" default-view="Years" minimal mask="YYYY-MM">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-4" v-if="is_main_store">
            <q-select
              label="查询门店"
              clearable
              v-model="selectStoreData"
              use-chips
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              :options="libInStoreList"
            />
          </div>
          <q-btn unelevated color="primary" label="查询" @click="getList" />
          <q-btn unelevated color="warning" label="重置" @click="clearButton" />
        </q-card>
      </div>
      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <q-markup-table separator="cell" flat bordered>
          <thead>
            <tr>
              <th class="text-center">日期</th>
              <th class="text-center">材料</th>
              <th class="text-center">首存汇总</th>
              <th class="text-center">利息汇总</th>
              <th class="text-center">已取利息汇总</th>
              <th class="text-center">已取首存重量汇总</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in recordData">
              <td class="text-center table_td_border" v-if="showRow(key, item)" :rowspan="rowSpan(key, item)">{{ item.date_moth }}</td>
              <td class="text-center">
                <span class="text-subtile1 text-primary">{{ item.unit_label }}</span>
                （单位：{{ item.unit_unit_label }}）
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.initWeight }}</span>
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.interestCount }}</span>
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.takeInterestCount }}</span>
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.takeInitWeight }}</span>
              </td>
            </tr>

            <!-- <tr >
              <td class="text-center table_td_border" >汇总</td>
              <td class="text-center">
                <span class="text-subtile1 text-primary"></span>
                （单位：{{ item.unit_unit_label }}）
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.initWeight }}</span>
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.interestCount }}</span>
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.takeInterestCount }}</span>
              </td>
              <td class="text-center">
                <span class="text-h6 text-primary">{{ item.takeInitWeight }}</span>
              </td>
            </tr> -->
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RecordChart',
  components: {},
  data () {
    return {
      unitDataList: [],
      cr_unit_id: '',
      selectStoreData: [],
      libInStoreList: [],
      startTime: '',
      endTime: '',
      recordData: [],
      cr_member_id: ''
    }
  },
  mounted () {},
  created () {
    this.getBaseConfigData()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getBaseConfigData () {
      this.$store
        .dispatch('clbank/getBaseConfig')
        .then((res) => {
          if (res.code == 200) {
            this.unitDataList = res.data && res.data.unitDataList ? res.data.unitDataList : []
            this.ruleDataList = res.data && res.data.ruleDataList ? res.data.ruleDataList : []
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
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      // if (!this.startTime) {
      //   this.$q.notify({
      //     message: '失败',
      //     caption: '请选择开始时间',
      //     color: 'red',
      //     icon: 'ion-close-circle-outline',
      //     timeout: 500,
      //     position: 'top-right'
      //   })
      //   return false
      // }

      // if (!this.endTime) {
      //   this.$q.notify({
      //     message: '失败',
      //     caption: '请选择结束时间',
      //     color: 'red',
      //     icon: 'ion-close-circle-outline',
      //     timeout: 500,
      //     position: 'top-right'
      //   })
      //   return false
      // }

      const obj = {
        cr_member_id: this.cr_member_id,
        cr_unit_id: this.cr_unit_id,
        // cr_rule_id: this.cr_rule_id,
        startTime: this.startTime,
        endTime: this.endTime,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('clbank/getChartData', obj)
        .then((res) => {
          this.recordData = res.data ? res.data : []
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

    showRow (key, item) {
      const data = this.recordData

      const row = item
      const rowIndex = key
      const property = 'date_moth'
      const cellValue = row[property]

      if (cellValue) {
        const prevRow = data[rowIndex - 1]
        if (prevRow && prevRow[property] === cellValue) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    rowSpan (key, item) {
      const data = this.recordData

      const row = item
      const rowIndex = key
      const property = 'date_moth'
      const cellValue = row[property]

      if (cellValue) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
      return 1
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.cr_member_id = val.id
          this.$nextTick(() => {
            this.getList()
          })
        }
      }
    },
    clearButton () {
      this.memberInfo = ''

      this.startTime = ''
      this.endTime = ''
      // this.cr_rule_id = ''
      this.cr_unit_id = ''
      this.cr_member_id = ''
      // this.order_no = ''
      this.selectStoreData = []
      this.recordData = []
      this.$refs.memberCardReading.emptyMemberCardInfo()
      // this.getList()
    }

  }
}
</script>
<style scoped>
.table_td_border {
  /* border: 1px solid; */
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.12);
}
</style>
