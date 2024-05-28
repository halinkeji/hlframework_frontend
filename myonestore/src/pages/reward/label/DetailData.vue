<template>
  <div>
    <q-dialog v-model="isShowDetail">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.9) + 'px',
          'max-width': parseInt($q.screen.width * 0.9) + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white row q-py-xs q-px-md">
            <div class="text-subtitle1">绩效详情</div>
            <q-space />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
          <div class="col-shrink bg-white row q-px-xs  q-gutter-x-sm row q-pb-md">
            <div class="col-12 col-xs-6 col-sm-2">
              <q-input outlined dense v-model="name" label="商品名称" />
            </div>
            <div class="col-12 col-md-2">
              <q-input outlined dense label="开始时间" v-model="startTime" readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm">
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
            <div class="col-12 col-md-2">
              <q-input outlined dense label="结束时间" v-model="endTime" readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm">
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
            <q-btn color="primary" unelevated @click="getLabelList" label="查询" />
            <q-btn color="warning" unelevated @click="clearBut" label="重置" />
            <q-btn color="positive" unelevated @click="exportCsv" label="导出Csv文件" :disable="labelListData.length == 0" />
          </div>

          <div class="col-shrink q-px-xs full-height">
            <ag-grid-vue
              ref="agGridTable"
              class="ag-theme-balham ag-grid-table reward-detail-table hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :rowData="labelListData"
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
            ></ag-grid-vue>
          </div>
          <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
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
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'DetailData',
  data () {
    return {
      isShowDetail: true,
      name: '',
      userId: '',
      startTime: '',
      endTime: '',
      context: '',
      gridOptions: {},
      labelListData: [],
      defaultColDef: {
        rowDragManaged: true
      },
      columnDefs: [
        {
          headerName: '单据号',
          field: 'rlr_invoice_id',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            return p.data.invoice && p.data.invoice.id ? p.data.invoice.sc_invoiceCode : ''
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-reward-detail': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '商品名称',
          field: 'rlr_goods_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品售价',
          field: 'rlr_goods_selling_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绩效类型',
          field: 'rlr_label_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绩效模式',
          field: 'rlr_label_mode',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.rlr_label_mode == 1 ? '固定金额' : '绩效比例'
          }
        },
        {
          headerName: '绩效规则',
          field: 'labelTotalPrice',
          valueGetter: function (p) {
            if (p.data.rlr_label_mode == 1) {
              return ' 固定金额' + p.data.rlr_label_single_price + '/次'
            }
            if (p.data.rlr_label_mode == 2) {
              return ' 绩效比例' + p.data.rlr_label_proportion + '%'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '次数',
          field: 'rlr_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '获得绩效',
          field: 'rlr_label_total_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绩效时间',
          field: 'rlr_invoice_id',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-reward-detail': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '订单状态',
          field: 'rlr_label_status',
          valueGetter: (p) => {
            return parseInt(p.data.rlr_label_status) == 1 ? '已生效' : '已退款'
          }
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
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.isShowDetail = true
      this.userId = id // 赋值当前查询id
      this.getLabelList()
    },
    getLabelList () {
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
        startTime: startTime,
        endTime: endTime,
        name: this.name,
        userId: this.userId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('rewardLabel/getUserLabelRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.labelListData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            if (this.labelListData.length > 0) {
              setTimeout(() => {
                this.setTopTabel(res.data.list)
              }, 200)
            }
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
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          rlr_goods_name: '数据合计',
          rlr_quantity: '',
          rlr_label_total_price: ''
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
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getLabelList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getLabelList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
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
    clearBut () {
      this.name = ''
      this.endTime = ''
      this.startTime = ''
      this.getLabelList()
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-绩效详情记录'
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    rowSpan (params) {
      const fields = ['rlr_invoice_id']
      const data = this.labelListData
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
.reward-detail-table .cell-span-reward-detail {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
