<template>
  <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-sm">
      <div class="col-12 col-md-2">
        <q-input label="请输入会员卡号|电话号|姓名" clearable outlined v-model="searchFrom.memberText" dense />
      </div>
      <div class="col-12 col-md-2">
        <q-input outlined dense label="开始时间" v-model="searchFrom.startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="searchFrom.startTime" mask="YYYY-MM-DD HH:mm:ss">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon color="grey" v-if="searchFrom.startTime" @click="searchFrom.startTime = ''" name="cancel"></q-icon>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="searchFrom.startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-input outlined dense label="结束时间" v-model="searchFrom.endTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="searchFrom.endTime" mask="YYYY-MM-DD HH:mm:ss">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon color="grey" v-if="searchFrom.endTime" @click="searchFrom.endTime = ''" name="cancel"></q-icon>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="searchFrom.endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <q-btn color="primary" unelevated label="搜索" @click="getListData" />
        <q-btn @click="resetBut()" color="warning"  unelevated label="重置" />
      <q-space />
      <q-btn color="primary" unelevated label="导入" @click="batchImport" />
       <q-btn @click="exportBut()"  color="red"  unelevated label="导出" />
    </div>

    <div class="col-shrink  bg-white q-px-xs full-height bg-grey-2">
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

    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>

    <hl-upload-components-xlxs v-if="memberUploadStatus" ref="uploadComponentsXlxsRef" @closeUpload="uploadTable"></hl-upload-components-xlxs>
  </div>
</template>
<script>
export default {
  name: 'deductCount',
  components: {},
  data () {
    return {
      printInvoiceStatus: true,
      deductCountList: [],

      searchFrom: {
        startTime: '',
        endTime: '',
        memberText: ''
      },

      gridOptions: {},
      context: '',
      columnDefs: [
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberCardNum ? p.data.mem_memberCardNum.toString() : ''
          }
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberMobile ? p.data.mem_memberMobile.toString() : ''
          }
        },
        {
          headerName: '昵称', // 列标题
          field: 'mem_memberName', // 列与数据源对应的字段
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '级别ID',
          field: 'membercardlevel_id',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '性别',
          field: 'mem_memberSex',
          valueGetter: (p) => {
            let sex = '未知'
            if (p.data.mem_memberSex == 1) {
              sex = '男'
            } else if (p.data.mem_memberSex == 2) {
              sex = '女'
            } else {
              sex = '未知'
            }
            return sex
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '身份证',
          field: 'mem_memberIdentityNum',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '出生日期',
          field: 'mem_memberBirthdayYear',
          valueGetter: (p) => {
            if (p.data.mem_memberBirthdayYear > 0) {
              return p.data.mem_memberBirthdayYear + '年' + p.data.mem_memberBirthdayMonth + '月' + p.data.mem_memberBirthdayDay + '日'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '总' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'mem_memberMoneyCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberMoneyCount ? p.data.mem_memberMoneyCount : '0.00'
          }
        },

        {
          headerName: '总' + this.$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'mem_memberPointsCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberPointsCount ? p.data.mem_memberPointsCount : '0.00'
          }
        },
        {
          headerName: '总次数',
          field: 'mem_memberNumberCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberNumberCount ? p.data.mem_memberNumberCount : '0'
          }
        },
        {
          headerName: '到期时间',
          valueGetter: (p) => {
            return p.data.mem_specifiedEndTime >= 2147457847
              ? '永久有效'
              : this.$q_date.formatDate(p.data.mem_specifiedEndTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实体卡',
          field: 'mem_isRfidCard',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '次卡项目',
          field: 'mrc_goodsName',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.2) + 'px',
          valueGetter: function (p) {
            return p.data.mrc_goodsName + (p.data.mrc_speName ? '-' + p.data.mrc_speName : '')
          }
        },
        {
          headerName: '开卡员工',
          filter: false,
          field: 'open_reward_user',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '销售员工',
          filter: false,
          field: 'consum_reward_user',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '总价值',
          filter: false,
          field: 'total_amount',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '剩余价值',
          filter: false,
          field: 'last_total_amount',
          width: this.nowpx(0.16) + 'px'
        },

        {
          headerName: '新增次数',
          field: 'rechargeCountDetail.mrc_count',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },
        {
          headerName: '使用次数',
          field: 'mrc_count',
          width: this.nowpx(0.1) + 'px',
          filter: false,
          valueGetter: function (p) {
            return p.data.rechargeCountDetail && p.data.rechargeCountDetail.mrc_count && p.data.rechargeCountDetail.mrc_count > 0
              ? parseInt(p.data.rechargeCountDetail.mrc_count - p.data.mrc_count)
              : 0
          }
        },

        {
          headerName: '剩余次数',
          field: 'mrc_count',
          width: this.nowpx(0.1) + 'px',
          filter: false
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
        },
        {
          headerName: '价格',
          filter: false,
          field: 'mrc_price',
          width: this.nowpx(0.16) + 'px'
        },

        {
          headerName: '最近消费日期',
          filter: false,
          field: 'lately_time',
          width: this.nowpx(0.16) + 'px',
          valueGetter: this.createdAt
        },
        {
          headerName: '备注',
          filter: false,
          field: 'rechargeCountDetail.mrc_note',
          width: this.nowpx(0.16) + 'px'
        }
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
      totalCount: 0,
      memberUploadStatus: false,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
    }
  },

  mounted () {},
  created () {
    this.context = this
  },
  watch: {},
  computed: {},
  methods: {
    createdAt (p) {
      if (!p.data.lately_time) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.lately_time * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    batchImport () {
      this.memberUploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.uploadComponentsXlxsRef.uploadInit('memberCountCard')
        }, 500)
      })
    },
    uploadTable () {
      this.memberUploadStatus = false
      this.$nextTick(() => {
        this.getListData()
      })
    },
    init (memberId) {
      this.memberId = memberId
      this.$nextTick(() => {
        this.getListData()
      })
    },

    // 获取次卡列表
    getListData () {
      const obj = {
        ...this.searchFrom,
        pSize: this.page.pSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('deductCount/getAllDeductCountList', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductCountList = res.data

            if (res.data) {
              this.deductCountList = res.data.list
              this.page.totalCount = parseInt(res.data.page.totalCount)
            } else {
              this.deductCountList = []
              this.page.totalCount = 0
            }
          }
        })
        .catch((error) => {})
    },
    editCount (data) {
      this.$refs.integralSetEdit.openEditDialog(data)
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getMemberListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getMemberListData()
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
        // params.api.sizeColumnsToFit()
      }
    },
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-次卡记录'
      })
    },
    resetBut () {
      this.searchFrom = {
        startTime: '',
        endTime: '',
        memberText: ''
      }
      this.deductCountList = []

      this.getListData()
    }
  }
}
</script>
