<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.9) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.9) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-card-section class="row items-center q-pa-sm">
            <div class="text-h6">调拨记录</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </q-card-section>
          <div class="col-shrink bg-white q-px-xs q-pb-lg q-gutter-x-xs row">
            <div  class=" col-12 col-md-2">
 <q-input clearable outlined v-model="inquireForm.text" label="商品名称/条码" dense />

            </div>
               <div  class=" col-12 col-md-2">
            <q-select
            outlined
            v-model="inquireForm.inModel"
            option-value="id"
            option-label="title"
            :options="statusOptions"
            dense
            label="变更类型"
            emit-value
            map-options
            clearable
          />
   </div>

      <div  class=" col-12 col-md-2">
<q-input outlined v-model="inquireForm.startTime" label="开始时间" dense  readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-date v-model="inquireForm.startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon color="grey" v-if="inquireForm.startTime" @click="inquireForm.startTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-time v-model="inquireForm.startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
</div>

 <div  class=" col-12 col-md-2">
           <q-input outlined v-model="inquireForm.endTime" label="结束时间" dense  readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-date v-model="inquireForm.endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon color="grey" v-if="inquireForm.endTime" @click="inquireForm.endTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy  transition-show="scale" transition-hide="scale">
                  <q-time v-model="inquireForm.endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
            <q-btn color="warning" @click="resetCondition" unelevated label="重置" />
          </div>
        </div>

        <div class="col-shrink full-height bg-grey-2 q-px-xs">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="specificationNewsData"
            rowSelection="multiple"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="40"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCharts="true"
            :enableRangeSelection="true"
            :enableCellTextSelection="true"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :rowMultiSelectWithClick="true"
            :localeText="localeText"
            :context="context"
            @rowSelected="rowSelectedAg"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
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
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'depotDetail',
  data () {
    return {
      depotId: 0,
      addStoreSidebar: false,
      columnDefs: [
        // {
        //   checkboxSelection: true,
        //   headerCheckboxSelectionFilteredOnly: true,
        //   headerCheckboxSelection: true,
        //   width: this.nowpx(0.03) + 'px'
        // },
        {
          headerName: '商品名称',
          field: 'dtd_goods_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.24) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '条码',
          field: 'dtd_goods_code',
          filter: false
        },
        {
          headerName: '仓库',
          field: 'dtd_goods_code',
          filter: false,
          valueGetter: (p) => {
            if (p.data.dtd_in_depot == this.depotId) {
              return p.data.outDepot ? p.data.outDepot.ed_name : ''
            }
            if (p.data.dtd_out_depot == this.depotId) {
              return p.data.inDepot ? p.data.inDepot.ed_name : ''
            }
          }
        },
        {
          headerName: '变更类型',
          field: 'dtd_goods_code',
          filter: false,
          valueGetter: (p) => {
            if (p.data.dtd_in_depot == this.depotId) {
              return '调入'
            } else if (p.data.dtd_out_depot == this.depotId) {
              return '调出'
            }
          }
        },
        {
          headerName: '调入/调出数量',
          field: 'dtd_turn_number',
          filter: false
        },

        {
          headerName: '规格名称',
          field: 'dtd_spe_name',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '调拨价',
          field: 'dtd_goods_price',
          filter: false
        },

        {
          headerName: '调拨小计',
          field: 'dtd_total_price',
          filter: false
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: this.addDate
        },
        {
          headerName: '备注',
          field: 'dtd_goods_note',
          filter: false
        }
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      text: '',
      goodsTypeId: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      dataListSelections: [],
      gridOptions: {},
      inquireForm: {
        text: '',
        startTime: '',
        endTime: '',
        inModel: ''
      },
      statusOptions: [
        {
          id: 1,
          title: '调入'
        },
        {
          id: 2,
          title: '调出'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {

    init (id) {
      this.depotId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.getList()
      }
    },

    getList () {
      const obj = {
        depotId: this.depotId,
        ...this.inquireForm,
        ...this.page
      }
      this.$store
        .dispatch('erpdepot/getTurnListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
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

    hideNowPage () {
      this.$emit('getMethods')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
    rowSpan (params) {
      const fields = ['goo_name']
      const data = this.specificationNewsData
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    resetCondition () {
      this.inquireForm = {
        text: '',
        startTime: '',
        endTime: '',
        inModel: ''
      }

      this.$nextTick(() => {
        this.getList()
      })
    },
    addDate (p) {
      return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
