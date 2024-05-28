<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-input outlined dense v-model="invoice" label="请输入单据号" />
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense v-model="foodName" label="请输入菜品名称" />
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined readonly dense v-model="startTime" label="开始时间">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm">
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
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
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
                    <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm">
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
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearBtn" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="入库" :to="{ name: 'addFoodErpIn' }" class="q-px-md" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham erp-in-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'InRecord',
  components: {},
  data () {
    return {
      invoice: '',
      foodName: '',
      startTime: '',
      endTime: '',
      context: '',
      recordList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'fei_invoice_code',
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }

        },
        {
          headerName: '名称',
          field: 'fed_goods_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '主规格',
          field: 'fed_spec_mian_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '子规格',
          field: 'fed_spec_son_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '入库价',
          field: 'fed_purchase_price',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '数量',
          field: 'fed_quantity',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '小计',
          field: 'fed_subtotal_amount',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '备注',
          field: 'fed_remarks',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '订单金额',
          width: this.nowpx(0.11) + 'px',
          field: 'fei_invoice_code',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.fei_subtotal_amount
          }

        },
        {
          headerName: '入库总数',
          width: this.nowpx(0.11) + 'px',
          field: 'fei_invoice_code',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.fei_total_number
          }

        },
        {
          headerName: '时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.15) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const params = {
        invoice: this.invoice,
        foodName: this.foodName,
        startTime: startTime,
        endTime: endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fooderp/getInListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.recordList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.invoice = ''
      this.foodName = ''
      this.startTime = ''
      this.endTime = ''
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    rowSpan (params) {
      const fields = ['fei_invoice_code']
      const data = this.recordList
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
    }
  }
}
</script>

<style>
.erp-in-table .cell-span-erp-in {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
