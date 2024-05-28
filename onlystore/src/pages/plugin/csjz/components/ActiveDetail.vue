<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row  q-gutter-x-sm">
          <q-input class="col-12 col-md-2 q-mt-sm" label="可搜索手机号，真实姓名" outlined v-model="searchData" dense />
          <div class="col-12 col-md-2 q-mt-sm ">
            <q-input outlined v-model="startTime" readonly label="开始时间" dense>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-menu>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-menu>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2 q-mt-sm ">
            <q-input readonly outlined v-model="endTime" label="结束时间" dense>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-menu>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-menu>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
          <q-btn @click="clearBut" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />

          <q-btn class="col-12 col-md-1 q-mt-sm" unelevated color="grey" :to="{ name: 'csjz' }" label="返回" />

           <q-btn @click="exportBut"  color="red" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="导出" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="ticketPrinterListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
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
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
    <view-details v-if="isViewDetails" ref="viewDetails"></view-details>
  </q-page>
</template>

<script>
import AgDetailOperator from './AgDetailOperator'
import ViewDetails from './ViewDetails'
export default {
  name: 'ActiveDetail',
  components: { ViewDetails, AgDetailOperator },
  data () {
    return {
      startTime: '',
      endTime: '',
      dataListSelections: [],
      localeText: this.$ag_grid_localeText,
      context: null,
      components: { AgDetailOperator },
      ticketPrinterListData: [],
      columnDefs: [
        {
          filter: false,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.045) + 'px'
        },
        {
          headerName: '单据号',
          field: 'invoice.sc_invoiceCode',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '捐赠类型',
          width: this.nowpx(0.2) + 'px',
          valueGetter (p) {
            if (parseInt(p.data.pco_donate_type) == 1) {
              return '捐款'
            }
            if (parseInt(p.data.pco_donate_type) == 2) {
              return '捐物资'
            }
          }
        },
        {
          headerName: '捐赠金额',
          width: this.nowpx(0.2) + 'px',
          field: 'pco_donate_price'
        },
        {
          headerName: '捐赠类型',
          width: this.nowpx(0.2) + 'px',
          valueGetter (p) {
            if (p.data.pco_donate_property == 'personal') {
              return '个人'
            }
            if (p.data.pco_donate_property == 'company') {
              return '单位/企业'
            }
          }
        },
        {
          headerName: '个人/单位/名称',
          field: 'pco_real_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '手机号',
          field: 'pco_mobile',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '备注',
          field: 'pco_remark',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          width: this.nowpx(0.3) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'AgDetailOperator',
          width: this.nowpx(0.2) + 'px'
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
      searchData: '',
      isViewDetails: false,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
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
      const obj = {
        activeId: this.$route.query.id,
        startTime: startTime,
        endTime: endTime,
        text: this.searchData,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('csjz/getDetailList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.ticketPrinterListData = res.data.list
            }
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

    clearBut () {
      this.searchData = ''
      this.startTime = ''
      this.endTime = ''
      this.dataListSelections = []
      this.getList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
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
    viewBut (val) {
      this.isViewDetails = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.viewDetails.getViewData(val)
        }, 200)
      })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `批量确认 ${this.dataListSelections.length} 条订单吗`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecordBatch()
        })
    },
    deleteRecordBatch () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('csjz/sendStatus', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功确认 ' + res.data + '记录'
            })
            this.getList()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
      }
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYY年MM月DD日')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-捐赠记录'
      })
    }
  }
}
</script>
