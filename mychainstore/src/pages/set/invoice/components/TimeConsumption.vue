<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md ">
      <div class="row">
        <div class="col-12 col-md-5 q-mr-sm" v-if="is_main_store">
          <q-select
            label="查询门店"
            use-chips
            v-model="selectStoreData"
            clearable
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
        <q-input class="col-12 col-md-3 q-mr-sm" clearable label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
        <q-input
          class="col-12 col-md-3 q-mr-sm"
          clearable
          v-if="!memberId"
          label="请输入会员卡号|电话号|姓名"
          outlined
          v-model="searchFrom.memberText"
          dense
        />
      </div>

      <div class="row q-my-sm">
        <q-input class="col-12 col-md-3 q-mr-sm" clearable label="商品名称" outlined v-model="searchFrom.goodsText" dense />
        <div class="col-12 col-md-3 q-mr-sm">
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
              <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
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
        <div class="col-12 col-md-3 q-mr-sm">
          <q-input outlined dense label="结束时间" clearable v-model="endTime" readonly>
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
              <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
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
        <q-btn @click="getDatalist()" color="primary" class="q-px-md q-mr-sm" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" class="q-px-md q-mr-sm" unelevated label="重置" />
        <q-btn @click="exportBut()" v-if="searchFrom.member_id == 0" color="red" class="q-px-md q-mr-sm" unelevated label="导出" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table time-table-view hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="invoiceListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
        :context="context"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
import AgTimeOperating from './AgTimeOperating.vue'
export default {
  name: 'TimeConsumption',
  components: {
    AgTimeOperating,
  },
  props: ['memberId'],
  data() {
    return {
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true,
      },
      context: null,
      invoiceListData: [],
      gridOptions: {},
      columnDefs: [],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0,
      },
      startTime: '',
      endTime: '',
      searchFrom: {
        userId: '',
        searchSerm: '',
        goodsText: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: '',
      },
      libInStoreList: [],
      selectStoreData: [],
    }
  },

  created() {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted() {
    let columnDefs = [
      {
        headerName: '单据号',
        field: 'sc_invoiceCode',
        filter: false,
        width: this.nowpx(0.15) + 'px',
        rowSpan: this.rowSpan,
        cellClassRules: {
          'cell-span-time-view': function(p) {
            if (p.value) {
              return true
            }
          },
        },
      },

      {
        headerName: '商品名称',
        field: 'rtd_goods_name',
        filter: false,
        width: this.nowpx(0.15) + 'px',
      },

      {
        headerName: '总时长（分钟）',
        field: 'rtd_duration_total',
        filter: false,
        width: this.nowpx(0.09) + 'px',
      },
      {
        headerName: '时间',
        field: 'created_at',
        filter: false,
        valueGetter: this.createdAt,
        width: this.nowpx(0.1) + 'px',
      },
      {
        headerName: '状态',
        field: 'created_at',
        filter: false,
        valueGetter: (p) => {
          if (parseInt(p.data.rtd_order_status) == 1) {
            return '已完成'
          } else {
            return '已撤单'
          }
        },
        width: this.nowpx(0.1) + 'px',
      },
      {
        headerName: '操作员',
        field: 'sc_invoiceCode',
        filter: false,
        width: this.nowpx(0.1) + 'px',
        rowSpan: this.rowSpan,
        cellClassRules: {
          'cell-span-time-view': function(p) {
            if (p.value) {
              return true
            }
          },
        },
        valueGetter: (p) => {
          return p.data.user && p.data.user.username ? p.data.user.username : ''
        },
      },
      {
        headerName: '备注',
        field: 'sc_note',
        filter: false,
        width: this.nowpx(0.1) + 'px',
      },
      {
        headerName: '门店',
        field: 'sc_invoiceCode',
        width: this.nowpx(0.1) + 'px',
        rowSpan: this.rowSpan,
        cellClassRules: {
          'cell-span-time-view': function(p) {
            if (p.value) {
              return true
            }
          },
        },
        pinned: 'right',
        valueGetter: (p) => {
          return p.data.store && p.data.store.name ? p.data.store.name : ''
        },
      },
      {
        headerName: '操作',
        field: 'aid',
        filter: false,
        cellRendererFramework: 'AgTimeOperating',
        width: this.nowpx(0.05) + 'px',
      },
    ]
    if (!this.memberId) {
      columnDefs.unshift({
        headerName: '会员姓名',
        field: 'sc_memberName',
        filter: false,
        checkboxSelection: false,
        headerCheckboxSelectionFilteredOnly: false,
        headerCheckboxSelection: false,
        width: this.nowpx(0.1) + 'px',
        rowSpan: this.rowSpan,
        cellClassRules: {
          'cell-span-time-view': function(p) {
            if (p.value) {
              return true
            }
          },
        },
      })
      columnDefs.unshift({
        headerName: '会员卡号',
        field: 'sc_memberCardNum',
        filter: false,
        width: this.nowpx(0.1) + 'px',
        rowSpan: this.rowSpan,
        cellClassRules: {
          'cell-span-time-view': function(p) {
            if (p.value) {
              return true
            }
          },
        },
      })
    }
    this.columnDefs = columnDefs
    this.context = this
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store']
    },
  },
  methods: {
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    // 列表自适应
    nowpx(px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    getDatalist() {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right',
        })
        return false
      }
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        member_id: this.memberId,
        rtd_recharge_type: 3,
        selectStoreData: this.selectStoreData,
      }
      this.$store
        .dispatch('invoice/getTimeData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle(val) {
      this.page.pSize = val
      this.getDatalist()
    },
    currentChangeHandle(val) {
      this.page.pageIndex = val
      this.getDatalist()
    },
    createdAt(p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    // 重置
    resetBut() {
      this.searchFrom = {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: '',
        goodsText: '',
      }
      this.selectStoreData = []
      this.startTime = ''
      this.endTime = ''
      this.getDatalist()
    },
    exportBut() {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({ fileName: date + '-计时记录' })
    },
    rowSpan(params) {
      const fields = ['sc_invoiceCode', 'sc_memberName', 'sc_memberCardNum']
      const data = this.invoiceListData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
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
    },

    countColumnData(data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}
          for (var j in i) {
            oneRowData[j] = 0

            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        return rowData
      }
    },
  },
}
</script>
<style>
.time-table-view .cell-span-time-view {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
