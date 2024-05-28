<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="q-gutter-xs row">
        <div class=" col-12 col-md-2">
          <q-input  outlined v-model="search" label="单据号" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-input outlined v-model="startTime" label="开始时间" dense  readonly>
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
        <div class="col-12 col-md-2">
          <q-input outlined v-model="endTime" label="结束时间" dense  readonly>
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
        <q-btn color="primary"  unelevated label="搜索" @click="getList" />
        <q-btn color="warning"  unelevated label="重置" @click="clean" />
        <q-btn color="primary"  unelevated label="新增" v-if="authorityMeta('typeAdd')" :to="{ name: 'addOrderType' }" />
        <q-btn color="primary"  unelevated @click="exportCsv" label="导出Csv文件" :disable="goodsInListData.length == 0" />
      </div>
    </div>
    <show-log-data ref="showDataRef" v-if="showLogStatus" @dataList="showLogStatus = false"></show-log-data>

    <type-detail ref="typeDetailRef" v-if="typeDetailStatus" @dataList="typeDetailStatus = false"></type-detail>

    <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="goodsInListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :components="components"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :context="context"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
        :rowClassRules="{
          'bg-red-3 ': (params) => {
            return params.data.cep_status == 4 ? true : false
          },
        }"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :current-page="page.pageIndex"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import AgButton from './AgButton'
import AgTypeShow from './AgTypeShow'
import ShowLogData from 'pages/erp/purchase/components/ShowLogData'
import TypeDetail from './TypeDetail'
export default {
  name: 'TypeTab',
  components: {
    AgButton,
    AgTypeShow,
    TypeDetail,
    ShowLogData
  },
  data () {
    return {
      components: {
        AgButton
      },
      showLogStatus: false,
      typeDetailStatus: false,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      goodsInListData: [],
      gridOptions: {},
      startTime: '',
      endTime: '',
      columnDefs: [
        // 表格列数据
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '单据号',
          field: 'cep_order_number',
          cellRendererFramework: 'AgTypeShow',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.15) + 'px'
        },
        // {
        //   headerName: '商品分类',
        //   field: 'cel_type_name',
        //   pinned: this.pinnedComputed('left'),
        //   width: this.nowpx(0.1) + 'px'
        // },
        {
          headerName: '补货数量',
          field: 'cep_total_purchase_num'
        },
        {
          headerName: '状态',
          field: 'cep_status',
          valueGetter: (p) => {
            if (p.data.cep_status == 1) {
              return '保存'
            }
            if (p.data.cep_status == 2) {
              return '已确认'
            }
            if (p.data.cep_status == 3) {
              return '已审核'
            }
            if (p.data.cep_status == 4) {
              return '已关闭'
            }
            if (p.data.cep_status == 5) {
              return '挂起'
            }
            if (p.data.cep_status == 6) {
              return '绑定订货单'
            }
            if (p.data.cep_status == 7) {
              return '订货单生成完毕'
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货商户',
          field: 'inStore.name'
        },
        {
          headerName: '补货时间',
          field: 'created_at',
          valueGetter: this.addDate
        },
        {
          headerName: '备注',
          field: 'cep_note'
        },
        {
          headerName: '操作',
          field: 'bid',
          cellRendererFramework: 'AgButton',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.09) + 'px'
        }
      ],
      context: '',
      search: ''
    }
  },
  computed: {},
  mounted () {},
  created () {
    this.context = this
    this.getList()
  },
  methods: {
    getList () {
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
      const obj = {
        text: this.search,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        startTime: startTime,
        endTime: endTime
      }

      this.$store
        .dispatch('erpOrder/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.goodsInListData = res.data ? res.data.list : []
            // if (res.data) {
            //   this.setTopTabel(this.goodsInListData)
            // }
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-类目补货记录'
      })
    },
    addDate (p) {
      return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
    },
    clean () {
      this.search = ''
      this.endTime = ''
      this.startTime = ''
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
          giid_goodsNumber: '',
          giid_goodsCashAmount: '',
          gii_total: '',
          gii_totalPurchaseNum: '',
          gii_primarySupplement: '',
          bid: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },
    showLogData (val) {
      this.showLogStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init(val, 2)
      })
    },
    typeDetailData (val) {
      this.typeDetailStatus = true
      this.$nextTick(() => {
        this.$refs.typeDetailRef.init(val)
      })
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
                if (
                  (j == 'gii_primarySupplement' && value.bid != bid) ||
                  (j == 'gii_totalPurchaseNum' && value.bid != bid) ||
                  (j == 'gii_total' && value.bid != bid)
                ) {
                  oneRowData[j] += this.formatAmount(value[j])
                } else if (!(j == 'gii_primarySupplement' || j == 'gii_totalPurchaseNum' || j == 'gii_total')) {
                  oneRowData[j] += this.formatAmount(value[j])
                }
                bid = value.bid
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          oneRowData.bid = 0
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
.erp-in-table .cell-span-erp-in {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
