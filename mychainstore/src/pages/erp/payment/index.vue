<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="q-gutter-x-xs row col-shrink bg-white q-px-sm q-py-md">
        <div class="col">
          <q-input outlined v-model="receipt" clearable label="付款单据号/购货单据号" dense />
        </div>

        <div class="col">
          <q-select
            outlined
            option-value="id"
            clearable
            option-label="gs_supplierName"
            emit-value
            map-options
            v-model="supplierId"
            :options="supplierList"
            dense
            label="供货商"
          />
        </div>

        <div class="col">
          <q-select
            outlined
            option-value="id"
            clearable
            option-label="type"
            emit-value
            map-options
            v-model="payTypeId"
            :options="payType"
            dense
            label="付款类型"
          />
        </div>

        <div class="col" v-if="is_main_store">
            <q-select
              label="查询门店"
              v-model="selectStoreData"
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              clearable
              use-chips
              :options="libInStoreList"
              @input="getDepotList"
            />
          </div>
        <div class="col">
            <q-input outlined v-model="startTime" label="开始时间" dense readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
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
        <div class="col">
            <q-input outlined v-model="endTime" label="结束时间" dense readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
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
        <q-btn color="primary" unelevated label="搜索" @click="getReceiptList()" />
        <q-btn color="warning" unelevated label="重置" @click="clearBut()" />
        <q-btn-dropdown color="primary" unelevated v-if="authorityMeta('add')" label="新增付款">
            <q-list>
              <q-item clickable v-close-popup :to="{ name: 'addErpPayment', query: { typeId: 1 } }">
                <q-item-section>
                  <q-item-label>购货付款</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="AddOtherRepay(2)">
                <q-item-section>
                  <q-item-label>其他付款</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        <q-btn color="primary" unelevated v-if="authorityMeta('out')" @click="exprotCsv" label="导出Csv文件" :disable="receiptList.length == 0" />
     </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-payment-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="receiptList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :gridOptions="gridOptions"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="false"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
      <add-other-repay ref="addOtherRepayRef" v-if="isDialogStatus" @dataList="getReceiptList" />
    </div>
  </q-page>
</template>

<script>
import AddOtherRepay from './components/AddOtherRepay'
export default {
  name: 'payment',
  components: { AddOtherRepay },
  data () {
    return {
      supplierId: '',
      supplierList: [],
      payTypeId: '',
      payType: [
        {
          id: 1,
          type: '购货付款'
        },
        {
          id: 2,
          type: '其他付款'
        }
      ],
      gridOptions: {},
      isDialogStatus: false,

      context: null,
      receiptList: [],
      columnDefs: [
        {
          filter: false, // 是否过滤
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '付款单据号',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '供货商名称',
          field: 'receipt_code',
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.gs_supplierName
          }
        },
        {
          headerName: '购货单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '业务类型',
          valueGetter: (p) => {
            if (p.data.epr_type == 1) {
              return '购货付款'
            } else if (p.data.epr_type == 2) {
              return '其他付款'
            }
          },
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '本次还款',
          field: 'epr_pay_back',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余金额',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.epr_last_remainder - p.data.epr_pay_back)
          }
        },
        {
          headerName: '应付金额',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.epr_receivable)
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '折扣率',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.epr_discount_rate
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '实付金额',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.epr_money)
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '还款说明',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.epr_description
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '添加时间',
          field: 'receipt_code',
          pinned: this.pinnedComputed('right'),
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.11) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-payment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '门店',
          field: 'store.name'
        }
      ],
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      receipt: '',
      startTime: '',
      endTime: '',
      selectStoreData: [],
      libInStoreList: []
    }
  },

  mounted () {
    this.getReceiptList()
  },
  created () {
    this.getSupplierList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
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
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 获取列表,搜索
    getReceiptList () {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
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
      this.isDialogStatus = false
      const obj = {
        receipt: this.receipt,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        payTypeId: this.payTypeId,
        supplierId: this.supplierId,
        startTime: startTime,
        endTime: endTime,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('payment/getReceiptList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.receiptList = res.data ? res.data.list : []
            if (res.data) {
              this.setTopTabel(this.receiptList)
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
    exprotCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-付款单记录'
      })
    },
    AddOtherRepay (val) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addOtherRepayRef.init(val)
      })
    },
    clearBut () {
      this.receipt = ''
      this.endTime = ''
      this.startTime = ''
      this.payTypeId = ''
      this.supplierId = ''
      this.selectStoreData = []
      this.getReceiptList()
    },
    // 自适应
    adaptiveTable (params) {
      // params.api.sizeColumnsToFit();
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getReceiptList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getReceiptList()
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
        // params.api.sizeColumnsToFit();
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
    rowSpan (params) {
      const fields = [
        'receipt_code',
        'ecp_name'

        // "gii_note",
        // "epr_money",
        // "epr_receivable",
        // "gii_total"
      ]
      const data = this.receiptList
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
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          receipt_code: '数据合计',
          epr_receivable: '',
          epr_money: '',
          epr_pay_back: '',
          epr_last_remainder: '',
          bid: ''
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
            let bid
            if (!i[j]) {
              data.forEach((value, key) => {
                if ((j == 'epr_money' && value.bid != bid) || (j == 'epr_receivable' && value.bid != bid)) {
                  oneRowData[j] += this.formatAmount(value[j])
                } else if (!(j == 'epr_money' || j == 'epr_receivable')) {
                  oneRowData[j] += this.formatAmount(value[j])
                }
                bid = value.bid
              })
            } else {
              oneRowData[j] = this.formatAmount(i[j])
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
    }
  }
}
</script>

<style>
.erp-payment-table .cell-span-erp-payment {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
