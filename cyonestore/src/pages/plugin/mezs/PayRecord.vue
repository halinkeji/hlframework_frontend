<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-x-xs">
      <div class="col-12 col-md-2 q-mr-sm ">
        <q-input label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
      </div>
      <div class="col-12 col-md-2 q-mr-sm">
        <q-input outlined dense label="开始时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
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
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2 q-mr-sm">
        <q-input outlined dense label="结束时间" v-model="endTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
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
                <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2  q-mr-sm">
        <q-input label="请输入会员卡号|电话号|姓名" outlined v-model="searchFrom.memberText" dense />
      </div>
      <q-btn @click="getList" color="primary" class=" col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
      <q-btn @click="resetButton" color="warning" class=" col-12 col-md-1 q-mr-sm" unelevated label="重置" />
      <q-btn @click="exportBut" color="red" class=" col-12 col-md-1 q-mr-sm" unelevated label="导出" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="payRecordData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        @gridReady="onFirstDataRendered"
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
  </div>
</template>

<script>
import AgInvoiceOperating from 'src/pages/set/invoice/components/AgInvoiceOperating.vue'
export default {
  name: 'PayRecord',
  components: { AgInvoiceOperating },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      payRecordData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: '赠送套餐',
          field: 'package.pmp_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '消费方式',
          field: 'sc_consumeTypeName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'sc_memberName',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'sc_memberCardNum',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '消费单据号',
          field: 'sc_invoiceCode',
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '实付金额',
          field: 'pmr_real_pay_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.pmr_real_pay_amount
          }
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(
              p.data.updated_at * 1000,
              'YYYY-MM-DD HH:mm:ss'
            )
          }
        },
        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          field: 'goo_price',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgInvoiceOperating',
          width: this.nowpx(0.07) + 'px'
        }
      ],
      defaultColDef: {
        rowDragManaged: true
      },
      gridOptions: {},
      searchQuery: '',
      startTime: '',
      endTime: '',
      searchFrom: {
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: ''
      }
    }
  },

  created () {
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    resetButton () {
      this.searchFrom = {
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: '',
        memberText: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.getList()
    },
    getList () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime

      const obj = {
        ...this.searchFrom,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('mezs/getRecordList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.payRecordData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
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
    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
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
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-满额赠送记录'
      })
    }
  }
}
</script>

<style></style>
