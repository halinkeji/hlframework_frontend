<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="q-gutter-x-xs row col-shrink bg-white q-px-xs q-pb-md">
        <q-input class=" col-12 col-md-2 q-mt-sm" outlined v-model="searchQuery" label="销货单据号" dense />
        <q-select class=" q-mt-sm col-12 col-md-2" outlined option-value="id" option-label="gs_supplierName" emit-value map-options v-model="supplierId" :options="supplierList" dense label="供货商" />
        <div class="col-12 col-md-2 q-mt-sm q-mr-xs">
          <q-input outlined v-model="startTime" label="开始时间" dense square readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
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
        <div class="col-12 col-md-2 q-mt-sm q-mr-xs">
          <q-input outlined v-model="endTime" label="结束时间" dense square readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
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
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getArrearsList()" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="clearBut()" />
        <q-btn color="primary" class=" q-mt-sm  " unelevated @click="exprotCsv" label="导出Csv文件" :disable="receiptList.length == 0" />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-repayment-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :gridOptions="gridOptions"
          :rowData="receiptList"
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
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'arrears',
  data () {
    return {
      supplierList: [],
      supplierId: '',
      startTime: '',
      endTime: '',
      gridOptions: {},
      context: null,
      receiptList: [],
      columnDefs: [
        {
          headerName: '购货单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.21) + 'px'
        },
        {
          headerName: '供货商名称',
          width: this.nowpx(0.21) + 'px',

          valueGetter: (p) => {
            return p.data.supplier ? p.data.supplier.gs_supplierName : ''
          }
        },
        {
          field: 'gii_foldClause',
          headerName: '欠款金额',
          width: this.nowpx(0.21) + 'px'
        },
        {
          headerName: '购货时间',

          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.21) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      searchQuery: ''
    }
  },

  mounted () {},
  created () {
    this.getArrearsList()
    this.getSupplierList()
  },
  computed: {},
  methods: {
    getSupplierList () {
      this.$store
        .dispatch('supplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    exprotCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-付款单记录'
      })
    },
    // 获取列表,搜索
    getArrearsList () {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
      const obj = {
        searchQuery: this.searchQuery,
        pageIndex: this.page.pageIndex,
        inventoryType: 1,
        pSize: this.page.pSize,
        supplierId: this.supplierId,
        startTime: startTime,
        endTime: endTime
      }
      this.$store
        .dispatch('repayment/getInvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.receiptList = res.data ? res.data.list : []

            this.setTopTabel(this.receiptList)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
        })
    },
    AddOtherRepay (val) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addOtherRepayRef.init(val)
      })
    },
    clearBut () {
      this.searchQuery = ''
      this.endTime = ''
      this.startTime = ''
      this.supplierId = ''
      this.getArrearsList()
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getArrearsList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getArrearsList()
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },

    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          gii_inventoryInCode: '数据合计',
          gii_foldClause: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}
          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                if (j == 'gii_foldClause') {
                  oneRowData[j] += this.formatAmount(value[j])
                }
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
    // 限制保留小数
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style>
.erp-repayment-table .cell-span-erp-repayment {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
