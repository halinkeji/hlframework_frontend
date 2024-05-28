<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-sm row">
      <div class="col-12 col-md-3">
        <q-input label="可搜索:核销码/卡号/会员昵称/会员姓名/手机号" outlined v-model="searchQuery" dense />
      </div>
      <div class="col-3" v-if="is_main_store">
        <q-select
          label="查询门店"
          use-chips
          clearable
          v-model="selectStoreData"
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
      <div class="col-12 col-md-2">
        <q-input outlined v-model="startTime" label="领取优惠券起始时间" dense readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-menu :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                <q-date v-model="startTime" mask="YYYY-MM-DD" today-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-menu>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-input outlined v-model="endTime" label="领取优惠券结束时间" dense readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-menu :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                <q-date v-model="endTime" mask="YYYY-MM-DD" today-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-menu>
            </q-icon>
          </template>
        </q-input>
      </div>
      <q-btn color="primary" unelevated label="搜索" @click="getOutCouponList" />
      <q-btn color="warning" unelevated label="重置" @click="clean" />
      <q-btn color="warning" unelevated label="导出CSV" @click="exportCsv" />
    </div>
    <div class="col-shrink q-px-xsb full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="outCouponData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="50"
        :floatingFilter="false"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :enableCellTextSelection="true"
        :localeText="localeText"
        @gridReady="onFirstDataRendered"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OutCouponList',
  data () {
    return {
      pastStartTime: '',
      pastEndTime: '',
      // end
      outCouponData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        // 表格列数据
        {
          headerName: '核销码',
          field: 'cmd_verificationCode',
          pinned: 'left',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '优惠券',
          field: 'coupon.cou_title',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'mem_memberRealName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '生效时间',
          valueGetter: (p) => {
            if (p.data.cmd_memberreceivetime) {
              return this.$q_date.formatDate(p.data.cmd_memberreceivetime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }

            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '到期时间',
          field: 'cmd_activityendtime',
          valueGetter: (p) => {
            if (p.data.cmd_activityendtime) {
              return this.$q_date.formatDate(p.data.cmd_activityendtime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }

            return ''
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      dataListSelections: [],
      memberCardLevelDatas: [],
      searchQuery: '',
      levelId: '',
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getOutCouponList()
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getOutCouponList () {
      const pastStartTime = this.$q_date.formatDate(this.pastStartTime, 'X')
      const pastEndTime = this.$q_date.formatDate(this.pastEndTime, 'X')
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        status: 4,
        pageIndex: this.page.pageIndex,
        pastStartTime: pastStartTime,
        pastEndTime: pastEndTime,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('hlCoupon/couponCheckList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.outCouponData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getOutCouponList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getOutCouponList()
    },
    clean () {
      this.searchQuery = ''
      this.pastStartTime = ''
      this.pastEndTime = ''
      this.selectStoreData = []
      this.getOutCouponList()
    },
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-卡券已过期记录'
      })
    }
  }
}
</script>
