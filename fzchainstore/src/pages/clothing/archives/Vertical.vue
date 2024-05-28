<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="row q-gutter-sm q-pa-sm bg-white q-pb-md">
       <div class="col-12 col-md-2  ">
          <q-input outlined v-model="queryCondition.code" label="货号:" dense />
        </div>
        <div class="col-12 col-md-2  ">
          <q-input outlined v-model="queryCondition.searchName" label="商品名称:" dense />
        </div>

        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-input outlined v-model="queryCondition.callCount" label="输入店仓:" dense />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-input outlined v-model="queryCondition.skcCode" label="SKU码/条形码，多个逗号隔开:" dense />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-input outlined v-model="queryCondition.callCount" label="请输入颜色:" dense />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-input outlined v-model="queryCondition.callCount" label="请输入尺码:" dense />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-input outlined v-model="queryCondition.articleCode" label="请输入原始货号:" dense />
        </div>

        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-input outlined v-model="queryCondition.onlyCode" label="请输入唯一码:" dense />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.brand"
            :options="brandList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="品牌"
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select behavior="menu" outlined options-dense v-model="queryCondition.state" :options="tableListData.stateValue" label="类目" dense>
          </q-select>
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.years"
            :options="yearsList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="年份 "
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.season"
            :options="seasonList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="季度 "
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.band"
            :options="bandList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="波段 *"
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.series"
            :options="bandList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="系列 "
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.style"
            :options="styleList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="风格 *"
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.priority"
            :options="priorityList"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="商品层"
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.tag"
            :options="tagList"
            option-value="id"
            option-label="gt_name"
            multiple
            use-chips
            emit-value
            map-options
            label="商品标签 *"
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.group"
            :options="groupList"
            option-value="id"
            option-label="cgi_name"
            emit-value
            map-options
            label="商品分组 "
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.standard"
            :options="standardList"
            option-value="id"
            option-label="cs_name"
            emit-value
            map-options
            label="执行标准 "
          />
        </div>
        <div class="col-12 col-md-2  " v-show="showQuery">
          <q-select
            outlined
            dense
            v-model="queryCondition.supplier"
            :options="supplierData"
            option-value="id"
            option-label="ces_name"
            emit-value
            map-options
            label="供货商 "
          />
        </div>

        <q-btn unelevated label="重置" color="warning" @click="clean" />
        <q-btn unelevated label="查询" color="primary"  :loading="queryLoad" @click="getList">
          <template v-slot:loading>
            <q-spinner-ios class="on-center" />
          </template>
        </q-btn>

        <q-btn-dropdown
          v-model="showQuery"
          persistent
          dense
          flat
          color="primary"
          :label="tableLabel"
          @before-show="show"
          @before-hide="hide"
        >
        </q-btn-dropdown>

        <q-btn color="primary" unelevated label="属性字段设置" @click="showConfig" />
        <q-btn color="primary" unelevated label="新增" :to="{ name: 'addClothingArchives' }" v-if="authorityMeta('add')" />
        <q-btn color="green"  unelevated @click="batchImport()">Xlxs 文件批量导入</q-btn>
        <q-btn color="primary"  unelevated @click="exportCsv" label="导出Csv文件" :disable="archivesData.length == 0" />
        <q-btn color="primary" unelevated label="横版展示" :to="{ name: 'clothingArchives' }" />
      </div>
      <show-config ref="addRef" v-if="addPoppupStatus"></show-config>
      <upload-table-goods v-if="uploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-goods>
      <show-detail ref="showDetailRef" v-if="showStatus" @dataList="showStatus = false" />
      <div class="col-shrink bg-white q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham archives-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="archivesData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          rowHeight="50"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :suppressRowTransform="true"
          :context="context"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <!-- rowSelection="multiple" -->
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
import AgOperater from './components/AgOperater.vue'
import ShowConfig from './components/ShowConfig.vue'
import AgShow from './components/AgShow.vue'
import ShowDetail from './components/ShowDetail'
import AgShowSize from './components/AgShowSize'

export default {
  name: 'archivesIndex',
  components: {
    AgOperater,
    AgShow,
    AgShowSize,
    ShowDetail,
    ShowConfig
  },
  data () {
    return {
      queryLoad: false,
      loading: false,
      uploadStatus: false,
      tableLabel: '展开',
      showQuery: false,
      queryCondition: {
        code: '',
        skcCode: '',
        searchName: '',
        onlyCode: '',
        articleCode: '',
        brand: '',
        season: '',
        years: '',
        band: '',
        series: '',
        style: '',
        priority: '',
        group: '',
        standard: '',
        supplier: ''
      },

      tableListData: [{}],
      gridOptions: {},
      components: {
        AgOperater
      },
      context: null,
      archivesData: [],
      dataListSelections: {},
      columnDefs: [
        // {
        //   filter: false,
        //   checkboxSelection: true,
        //   headerCheckboxSelectionFilteredOnly: true,
        //   headerCheckboxSelection: true,
        //   width: this.nowpx(0.03) + 'px'
        // },
        {
          headerName: '货号',
          field: 'ca_article_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          cellRendererFramework: 'AgShow',
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '颜色',
          field: 'cad_color_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色编码',
          field: 'cad_color_code',
          filter: false,

          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '规格组',
          field: 'format.cf_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码',
          field: 'cad_size_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgShowSize'
        },
        {
          headerName: '吊牌价',
          field: 'cad_price',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '品牌',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            return p.data.brand.cp_name
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '分类',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            return p.data && p.data.type ? p.data.type.gt_name : ''
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '年份',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            return p.data.years.cp_name
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '季节',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.season) {
              return p.data.season.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '库/货位',
          field: 'ca_clothing_location',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '波段',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.band) {
              return p.data.band.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '系列',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.series) {
              return p.data.series.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '风格',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.style) {
              return p.data.style.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '面料类别',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.fabric) {
              return p.data.fabric.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '商品层',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.priority) {
              return p.data.priority.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '商品分组',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.group) {
              return p.data.group.cgi_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '执行标准',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.standard) {
              return p.data.standard.cs_code
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '安全级别',
          field: 'goo_name',
          filter: false,
          valueGetter: (p) => {
            if (p.data.safetytype) {
              return p.data.safetytype.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.07) + 'px'
        },

        {
          headerName: '操作',
          field: 'bid',
          filter: false,
          cellRendererFramework: 'AgOperater',
          pinned: this.pinnedComputed('right'),
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-archives': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.08) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      fabricList: [],
      safetyTypeList: [],
      brandList: [],
      yearsList: [],
      seasonList: [],
      bandList: [],
      seriesList: [],
      styleList: [],
      priorityList: [],
      groupList: [],
      standardList: [],
      tagData: [],
      formatList: [],
      format: [],
      depotList: [],
      shelfList: [],
      locationList: [],
      sizeData: [],
      colorData: [],
      sizeLayoutData: [],
      colorLayoutData: [],
      customizeDetail: [],
      customizeData: '',
      supplierData: [],
      tagList: [],
      addPoppupStatus: false,
      showStatus: false,
      configShowData: []
    }
  },

  mounted () {},
  created () {
    this.context = this
    this.getPropertyAll()
    this.getSupplierList()
    this.getList()
    this.getConfig()
  },
  computed: {},
  methods: {
    getConfig () {
      this.$store
        .dispatch('clothingConfig/getConfig')
        .then((res) => {
          if (res.code == 200) {
            if (res.data.configData) {
              this.configShowData = res.data.configData
              this.gridOptions.api.setColumnDefs([])
              this.$nextTick(() => {
                const columnDefs = this.columnDefs
                const configShowData = this.configShowData.map((x) => {
                  return x.headerName
                })
                const newAgColumnDefs = []
                columnDefs.forEach(function (value) {
                  if (_.indexOf(configShowData, value.headerName) >= 0) {
                    newAgColumnDefs.push(value)
                  }
                })

                newAgColumnDefs.push({
                  headerName: '操作',
                  field: 'bid',
                  filter: false,
                  cellRendererFramework: 'AgOperater',
                  pinned: this.pinnedComputed('right'),
                  rowSpan: this.rowSpan,
                  cellClassRules: {
                    'cell-span-archives': function (p) {
                      if (p.value) {
                        return true
                      }
                    }
                  },
                  width: this.nowpx(0.05) + 'px'
                })

                this.gridOptions.api.setColumnDefs(newAgColumnDefs)
              })
            }
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 获取列表,搜索
    getList () {
      const obj = {
        ...this.queryCondition,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('clothingArchives/getListDatas', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.archivesData = res.data ? res.data.list : []
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
    // 批量导入
    batchImport () {
      this.uploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('goods')
        }, 500)
      })
    },
    show (evt) {
      this.showQuery = true
      this.tableLabel = '收起'
    },
    hide (evt) {
      this.showQuery = false
      this.tableLabel = '展开'
    },
    // 获取供应商
    getSupplierList () {
      this.$store
        .dispatch('clothingSupplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : []
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
    getPropertyAll () {
      this.$store
        .dispatch('clothingArchives/getLists')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.fabricList = res.data.fabric ? res.data.fabric : []
              this.safetyTypeList = res.data.safetytype ? res.data.safetytype : []
              this.brandList = res.data.brand ? res.data.brand : []
              this.yearsList = res.data.years ? res.data.years : []
              this.seasonList = res.data.season ? res.data.season : []
              this.bandList = res.data.band ? res.data.band : []
              this.styleList = res.data.style ? res.data.style : []
              this.seriesList = res.data.series ? res.data.series : []
              this.standardList = res.data.standard ? res.data.standard : []
              this.depotList = res.data.depot ? res.data.depot : []
              this.locationList = res.data.location ? res.data.location : []
              this.supplierList = res.data.supplier ? res.data.supplier : []
              this.priorityList = res.data.priority ? res.data.priority : []
              this.groupList = res.data.group ? res.data.group : []
              this.formatList = res.data.format ? res.data.format : []
              this.tagList = res.data.tag ? res.data.tag : []
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
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    showConfig () {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.showConfig()
      })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    clean () {
      this.queryCondition.searchName = ''
      this.queryCondition.code = ''
      this.queryCondition.skcCode = ''
      this.queryCondition.onlyCode = ''
      this.queryCondition.articleCode = ''
      this.queryCondition.brand = ''
      this.queryCondition.season = ''
      this.queryCondition.years = ''
      this.queryCondition.band = ''
      this.queryCondition.series = ''
      this.queryCondition.style = ''
      this.queryCondition.priority = ''
      this.queryCondition.group = ''
      this.queryCondition.supplier = ''
      this.queryCondition.standard = ''
      this.queryCondition.tag = []
      this.getList()
    },
    rowSpan (params) {
      const fields = ['goo_name', 'bid']
      const data = this.archivesData
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
    showData (val) {
      this.showStatus = true
      this.$nextTick(() => {
        this.$refs.showDetailRef.getItem(val)
      })
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品档案'
      })
    },
    uploadTable () {
      this.uploadStatus = false
      this.getList()
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
.archives-table .cell-span-archives {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
