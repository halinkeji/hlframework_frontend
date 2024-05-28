<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs
          v-model="activeName"
          class="bg-white "
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab name="1" v-if="authorityMeta('transferTab')">
            <span> 促销方案 </span>
          </q-tab>
          <q-tab name="2" v-if="authorityMeta('outTab')">
            <span> 促销档期 </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '1'">
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
            <q-input class="col-12 col-md-2 " outlined v-model="search" label="方案名称" dense />
            <q-input class="col-12 col-md-2 " outlined v-model="number" label="方案编号" dense />
            <div class="col-12 col-md-2  q-mr-xs">
              <q-input outlined v-model="startTime" label="开始时间" dense readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy @before-show="startTime" transition-show="scale" transition-hide="scale">
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
                    <q-popup-proxy @before-show="startTime" transition-show="scale" transition-hide="scale">
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
            <div class="col-12 col-md-2  q-mr-xs">
              <q-input outlined v-model="endTime" label="结束时间" dense readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy @before-show="endTime" transition-show="scale" transition-hide="scale">
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
                    <q-popup-proxy @before-show="endTime" transition-show="scale" transition-hide="scale">
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
            <div class="col-12 col-md-3 q-mr-xs">
              <q-btn color="primary" unelevated label="搜索" @click="getList" />
              <q-btn color="warning" class="q-mx-sm" unelevated label="重置" @click="clean" />
              <q-btn color="primary" unelevated label="新增" v-if="authorityMeta('add')" :to="{ name: 'addPromotionConfig' }" />
              <q-btn
                :disabled="dataListSelections.length > 0 ? false : true"
                @click="delAll()"
                v-if="authorityMeta('delAll')"
                color="red"
                class="q-ml-sm"
                unelevated
                label="批量删除"
              />
            </div>
          </div>
          <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
            <ag-grid-vue
              ref="agGridTable"
              class="ag-theme-balham ag-grid-table erp-in-table hl_header_center hl_content_center full-height "
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :rowData="configListData"
              :gridOptions="gridOptions"
              :rowDragManaged="true"
              rowSelection="multiple"
              colResizeDefault="shift"
              :animateRows="false"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              :components="components"
              @first-data-rendered="onFirstDataRendered"
              rowHeight="50"
              @rowSelected="rowSelectedAg"
              :suppressRowTransform="true"
              :suppressCellSelection="true"
              :localeText="localeText"
              @gridReady="onFirstDataRendered"
              :context="context"
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
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '2'">
        <time-tab />
      </div>
    </div>
  </q-page>
</template>
<script>
import AgOperator from './components/AgOperator'
import AgMode from './components/AgMode'
import TimeTab from './components/TimeTab'
export default {
  name: 'promotionIndex',
  components: {
    AgOperator,
    AgMode,
    TimeTab
  },
  data () {
    return {
      components: {
        AgOperator
      },
      activeName: '1',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      configListData: [],
      dataListSelections: [],
      gridOptions: {},
      startTime: '',
      endTime: '',
      columnDefs: [
        // 表格列数据
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.01) + 'px'
        },
        {
          headerName: '方案编号',
          field: 'ppi_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '方案名称',
          field: 'ppi_name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '状态',
          field: 'cf_status',
          filter: false,
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '开始时间',
          field: 'ppi_start_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.ppi_start_time * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '结束时间',
          field: 'ppi_end_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.ppi_end_time * 1000, 'YYYY-MM-DD  HH:mm')
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '模式',
          valueGetter: (p) => {
            if (parseInt(p.data.ppi_discounts_model) == 1) {
              return '折扣'
            }
            if (parseInt(p.data.ppi_discounts_model) == 2) {
              return '特价'
            }
            if (parseInt(p.data.ppi_discounts_model) == 3) {
              return '满减满送'
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '范围',
          valueGetter: (p) => {
            if (parseInt(p.data.ppi_discounts_scope) == 1) {
              return '全场'
            }
            if (parseInt(p.data.ppi_discounts_scope) == 2) {
              return '类别'
            }
            if (parseInt(p.data.ppi_discounts_scope) == 3) {
              return '品牌'
            }
            if (parseInt(p.data.ppi_discounts_scope) == 4) {
              return '商品'
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '类型',
          valueGetter: (p) => {
            if (parseInt(p.data.ppi_discounts_type) == 1) {
              if (parseInt(p.data.ppi_discounts_model) == 1) {
                return '直接折扣'
              }
              if (parseInt(p.data.ppi_discounts_model) == 2) {
                return '直接特价'
              }
              if (parseInt(p.data.ppi_discounts_model) == 3) {
                return '买满N元减M元(倍数减)'
              }
            }
            if (parseInt(p.data.ppi_discounts_type) == 2) {
              if (parseInt(p.data.ppi_discounts_model) == 1) {
                return '买满多少金额折扣'
              }
              if (parseInt(p.data.ppi_discounts_model) == 2) {
                return '件数特价'
              }
              if (parseInt(p.data.ppi_discounts_model) == 3) {
                return '买满N元减M元'
              }
            }
            if (parseInt(p.data.ppi_discounts_type) == 3) {
              if (parseInt(p.data.ppi_discounts_model) == 1) {
                return '件数折'
              }
              if (parseInt(p.data.ppi_discounts_model) == 2) {
                return '偶数特价'
              }
              if (parseInt(p.data.ppi_discounts_model) == 3) {
                return '买满N元加M元送商品'
              }
            }
            if (parseInt(p.data.ppi_discounts_type) == 4) {
              if (parseInt(p.data.ppi_discounts_model) == 2) {
                return '条件组合特价'
              }
              if (parseInt(p.data.ppi_discounts_model) == 3) {
                return '买满多少个商品送赠品'
              }
            }
            if (parseInt(p.data.ppi_discounts_type) == 5) {
              if (parseInt(p.data.ppi_discounts_model) == 2) {
                return '任意选'
              }
              if (parseInt(p.data.ppi_discounts_model) == 3) {
                return '买满多少个商品送低价商品'
              }
            }
            if (parseInt(p.data.ppi_discounts_type) == 6) {
              return '买满多少个商品送低价商品'
            }
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          field: '',
          cellRendererFramework: 'AgOperator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.09) + 'px'
        }
      ],
      search: '',
      number: '',
      context: '',
      libInStoreList: []
    }
  },
  watch: {
    activeName (val) {
      if (val == '1') {
        this.getList()
      }
    }
  },

  created () {
    this.context = this
    this.getList()
  },
  mounted () {},
  computed: {},
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
        number: this.number,
        startTime: startTime,
        endTime: endTime,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }

      this.$store
        .dispatch('promotion/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.configListData = res.data ? res.data.list : []
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
    clean () {
      this.search = ''
      this.startTime = ''
      this.endTime = ''
      this.number = ''
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条折扣模板信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('promotion/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条模板'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
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
