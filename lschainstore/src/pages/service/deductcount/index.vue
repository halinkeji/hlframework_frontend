<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-px-xs " :class="activeName == 'CountDelayRecord' ? 'q-pb-md' : 'q-pb-xl'">
         <div class="q-pr-sm">
          <hl-card-reading @readError="refreshBut" ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
        </div>
        <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="deductCountList" label="计次消费"> </q-tab>
          <!-- <q-tab name="CountDelayRecord" label="延期记录"> </q-tab> -->
        </q-tabs>
      </div>
      <div class="col-shrink  bg-white q-px-xs full-height bg-grey-2" v-if="activeName == 'deductCountList'">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="deductCountList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :localeText="localeText"
          :context="context"
          :suppressCellSelection="true"
        ></ag-grid-vue>
      </div>

      <div class="col-shrink  bg-white full-height bg-grey-2" v-if="activeName == 'CountDelayRecord'">
        <count-delay-record :memberId="memberId" class="fit"></count-delay-record>
      </div>

      <div class="col-shrink bg-white q-py-md" v-if="activeName == 'deductCountList'">
        <div class="row  q-gutter-md">
          <div class="col-6 col-md-3 q-pa-xs">
            本次扣除:
            <span class="text-h4 text-orange"> {{ deductCounts }}</span>
          </div>
          <div class="col-6 col-md-3 q-pa-xs">
            总次数:
            <span class="text-h4 text-orange"> {{ totalCount }}</span>
          </div>
          <div class="col-12 col-md-2 q-pa-xs flex flex-center">
            <q-checkbox dense v-model="printInvoiceStatus" label="打印小票" color="blue-8" />
            <q-btn round flat icon="ion-help-circle" color="warning">
              <q-tooltip content-class="bg-red" :offset="[10, 10]">
                <q-icon name="ion-warning"> </q-icon>请读卡查询会员计次消费项目<br />
                <q-icon name="ion-warning"> </q-icon>点击表格内，扣除次数列编辑扣除的次数<br />
                <q-icon name="ion-warning"> </q-icon>勾选打印小票选项，小票打印机将打印计次消费小票
              </q-tooltip>
            </q-btn>
          </div>
          <q-space />

          <q-btn unelevated color="amber-8" class="q-px-xl" @click="refreshBut()" :disable="memberId == 0" label="重置" icon="ion-refresh" />

          <q-btn unelevated color="red-6" class="q-px-xl q-mr-sm" label="扣次" @click="deductionBut()" :disable="deductCounts > 0 ? false : true" icon="las la-minus-circle" />
        </div>
      </div>
      <hl-local-printer ref="localPrinterRef" />

      <count-set-edit ref="integralSetEdit" @setSuccess="getListData"></count-set-edit>
    </div>
  </q-page>
</template>
<script>
import AgButton from './components/AgButton.vue'
import CountSetEdit from './CountSetEdit.vue'
import CountDelayRecord from './CountDelayRecord.vue'
export default {
  name: 'deductCount',
  components: { AgButton, CountSetEdit, CountDelayRecord },
  data () {
    return {
      printInvoiceStatus: true,
      deductCountList: [],
      activeName: 'deductCountList',
      memberId: 0,

      gridOptions: {},
      context: '',
      columnDefs: [
        {
          headerName: '消费项目',
          field: 'mrc_goodsName',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.4) + 'px',
          valueGetter: function (p) {
            return p.data.mrc_goodsName + (p.data.mrc_speName ? '-' + p.data.mrc_speName : '')
          }
        },
        {
          headerName: '可用次数',
          field: 'mrc_count',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '扣除次数',
          field: 'mrc_deductcount',
          filter: false,
          editable: true,
          width: this.nowpx(0.1) + 'px',
          onCellValueChanged: this.numberDeductions
        },
        {
          headerName: '到期时间',
          field: 'mrc_endTime',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: this.expireDate
        },
        {
          headerName: '使用规则',
          filter: false,
          valueGetter: this.rulesUse,
          width: this.nowpx(0.16) + 'px'
        }
        // {
        //   headerName: '次卡延期',
        //   filter: false,
        //   cellRendererFramework: 'AgButton',
        //   width: this.nowpx(0.1) + 'px'
        // }
      ],

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      deductCounts: 0,
      totalCount: 0
    }
  },

  mounted () {},
  created () {
    this.context = this
  },
  watch: {},
  computed: {},
  methods: {
    // 读卡
    getMemberInfo (val) {
      if (val) {
        this.deductCountList = []
        this.totalTimes = 0
        if (val.id) {
          this.memberId = val.id
          this.activeName = 'deductCountList'

          this.getListData()
        }
      }
    },
    // 获取次卡列表
    getListData () {
      const obj = {
        mId: this.memberId
      }
      this.$store
        .dispatch('deductCount/getListData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductCountList = res.data

            this.$nextTick(() => {
              this.totalCountData()
            })
          }
        })
        .catch((error) => {})
    },
    editCount (data) {
      this.$refs.integralSetEdit.openEditDialog(data)
    },
    // 扣次
    deductionBut () {
      const obj = {
        mId: this.memberId,
        printInvoiceStatus: this.printInvoiceStatus,
        deductCountList: this.deductCountList
      }
      this.$store
        .dispatch('deductCount/addinvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data.errorArray.length > 0) {
              res.data.errorArray.forEach((i, k) => {
                this.$q.notify({
                  progress: true,
                  position: 'top',
                  color: 'white',
                  textColor: 'primary',
                  message: i,
                  multiLine: true,
                  timeout: 3500
                })
              })
            } else {
              this.$q.notify({
                message: '成功',
                caption: '计次消费成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
            }
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.getListData()
            this.$nextTick(() => {
              this.totalCountData()
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '计次消费失败，请重新操作！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    totalCountData () {
      let totalCount = 0
      let deductCounts = 0
      this.deductCountList.forEach(function (item) {
        totalCount += parseInt(item.mrc_count)
        deductCounts += parseInt(item.mrc_deductcount) > 0 ? parseInt(item.mrc_deductcount) : 0
      })
      this.deductCounts = deductCounts
      this.totalCount = totalCount
    },

    expireDate (p) {
      if (parseInt(p.data.mrc_endTime) >= 2147457847) {
        return '永久有效'
      } else {
        return this.$q_date.formatDate(p.data.mrc_endTime * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    numberDeductions (p) {
      const itemsToUpdate = []
      const data = p.data
      const re = /^[0-9]*[0-9][0-9]*$/
      if (re.test(p.data.mrc_deductcount)) {
        if (parseInt(data.mrc_deductcount) >= parseInt(data.mrc_count)) {
          data.mrc_deductcount = data.mrc_count
        }
      } else {
        data.mrc_deductcount = 0
      }

      if (p.data.mrc_limitTime != 1) {
        this.$store
          .dispatch('deductCount/getLimitCount', {
            record_id: data.id,
            mrc_limitTime: data.mrc_limitTime,
            mrc_limitCount: data.mrc_limitCount,
            currentCount: data.mrc_deductcount
          })
          .then((res) => {
            if (res.code == 200 && res.data.status) {
              data.mrc_deductcount = 0
              this.$q.notify({
                message: '注意',
                caption: res.data.msg,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            }

            itemsToUpdate.push(data)

            p.api.applyTransaction({ update: itemsToUpdate })

            this.$nextTick(() => {
              this.totalCountData()
            })
          })
          .catch((error) => {
            this.$q.notify({
              message: '注意',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          })
      } else {
        itemsToUpdate.push(data)

        const res = p.api.applyTransaction({ update: itemsToUpdate })

        this.$nextTick(() => {
          this.totalCountData()
        })
      }
    },
    // 使用规则
    rulesUse (p) {
      if (parseInt(p.data.mrc_limitTime) == 1) {
        return '不限制规定时间使用次数'
      } else if (parseInt(p.data.mrc_limitTime) == 2) {
        return '使用限制为每年可使用' + p.data.mrc_limitCount + '次'
      } else if (parseInt(p.data.mrc_limitTime) == 3) {
        return '使用限制为每季度可使用' + p.data.mrc_limitCount + '次'
      } else if (parseInt(p.data.mrc_limitTime) == 4) {
        return '使用限制为每月可使用' + p.data.mrc_limitCount + '次'
      } else if (parseInt(p.data.mrc_limitTime) == 5) {
        return '使用限制为每周可使用' + p.data.mrc_limitCount + '次'
      } else {
        return '使用限制为每天可使用' + p.data.mrc_limitCount + '次'
      }
    },

    // 列表列宽自适应
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },

    // 重置
    refreshBut () {
      this.memberId = 0
      this.$refs.memberCardReading.emptyMemberCardInfo()
      this.deductCountList = []
      this.totalTimes = 0
      this.totalCount = 0
    }
  }
}
</script>
