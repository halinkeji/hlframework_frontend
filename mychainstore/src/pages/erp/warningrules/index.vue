<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="q-gutter-sm row col-shrink bg-white q-pa-xs q-pb-md">
        <div class="col-12 col-md-2">
          <q-input clearable label="预警规则名称" outlined v-model="search" dense />
        </div>

        <div class="col-12 col-md-4 q-mt-sm" v-if="is_main_store">
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
          />
        </div>
        <q-btn color="primary" unelevated label="搜索" @click="getRuleList" />
        <q-btn color="warning" unelevated label="重置" @click="clean" />
        <q-btn color="primary" unelevated v-if="authorityMeta('add')" label="新增预警规则" @click="editData(0)" />
        <q-btn
          color="red"
          unelevated
          v-if="authorityMeta('allDel')"
          label="批量删除"
          :disable="dataListSelections.length > 0 ? false : true"
          @click="delAll"
        />
        <q-btn color="primary" unelevated v-if="authorityMeta('out')" @click="exportCsv" label="导出Csv文件" :disable="ruleData.length == 0" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="ruleData"
          :rowDragManaged="true"
          rowSelection="multiple"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :rowMultiSelectWithClick="true"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          @rowSelected="rowSelectedAg"
          :context="context"
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
          :total="page.totalCount"
        ></hl-pagination>
      </div>
      <add-rule ref="AddRuleData" v-if="addPoppupStatus" @refreshDataList="getRuleList" />
    </div>
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import AddRule from './components/AddRule'
export default {
  name: 'warningrules',
  components: {
    AgOperate,
    AddRule
  },
  data () {
    return {
      addPoppupStatus: false,
      dataListSelections: [],
      gridOptions: {},
      components: {
        AgOperate,
        AddRule
      },
      context: null,
      ruleData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.045) + 'px'
        },
        {
          headerName: '预警规则名称',
          field: 'wr_title',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '预警规则数量',
          field: 'wr_count',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '预警规则时间',
          valueGetter: (p) => {
            return p.data.wr_time > 0 ? this.$q_date.formatDate(p.data.wr_time * 1000, 'YYYY-MM-DD HH:mm:ss') : '未设置'
          },
          width: this.nowpx(0.27) + 'px'
        },

        {
          headerName: '预警规则类型',
          width: this.nowpx(0.27) + 'px',
          valueGetter: (p) => {
            if (p.data.wr_type == 1) {
              return '同时满足'
            } else if (p.data.wr_type == 2) {
              return '单个满足'
            }
          }
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgOperate',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      search: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      ruleGroupData: [],
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getRuleList()
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
    clean () {
      this.search = ''
      this.selectStoreData = []
      this.getRuleList()
    },
    // 新增修改
    editData (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.AddRuleData.init(id)
      })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getRuleList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRuleList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getRuleList () {
      this.addPoppupStatus = false
      this.dataListSelections = []
      const obj = {
        text: this.search,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('warningRules/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.ruleData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确认批量删除预警规则',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const accountInfo = this.$q.localStorage.getItem('mychainstore_account_info')
            const obj = dataListSelections.map((item) => {
              if (parseInt(item.store_id) == parseInt(accountInfo.store_id)) {
                return item.id
              } else if (this.is_main_store) {
                return item.id
              } else {
                return null
              }
            })
            this.$store.dispatch('warningRules/delData', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
              }
              this.getRuleList()
            })
          }
        })
        .onCancel(() => {})
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-预警记录'
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
    }
  }
}
</script>
