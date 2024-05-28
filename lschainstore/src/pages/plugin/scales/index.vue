<template>
  <q-page class="fit">
     <add-scales ref="addScalesRef" v-if="addPoppupStatus" @dataList="getList"></add-scales>
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll" v-if="is_main_account">
      <div class="row q-gutter-x-sm col-shrink bg-white q-px-xs q-pb-md">
        <q-btn @click="showAdd(0)" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增" />
        <q-btn :disabled="dataListSelections.length > 0 ? false : true" @click="delAll()" color="red" class="col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('delAll')" label="批量删除" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="scalesListData"
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
    <div class="fit">
      <form-scales />
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'

import Operating from './components/AgOperator'
import AgSwitch from './components/AgSwitch'
import AgAutoSwitch from './components/AgAutoSwitch'
import AddScales from './addScales.vue'
import FormScales from './FormScales.vue'
export default {
  name: 'scales',
  components: {
    Operating,
    AgSwitch,
    AgAutoSwitch,
    AddScales,
    FormScales
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating
      },
      dataListSelections: {},
      scalesListData: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: ' 称重机品牌',
          field: 'psc_brand',
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            switch (p.data.psc_brand) {
              case 'dingjian':
                return '顶尖'
              case 'qita':
                return '其他'
              default:
                return '其他'
            }
          }
        },
        {
          headerName: ' 称重机波特率',
          field: 'psc_baud_rate',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '数据位',
          field: 'psc_data_bits',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '奇偶校验',
          field: 'psc_parity',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '设备编号',
          field: 'psc_machine_id',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '停止位',
          field: 'psc_stop_bits',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '是否自动打开串口',
          field: 'psc_auto_open',
          cellRendererFramework: 'AgAutoSwitch',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          field: 'psc_status',
          cellRendererFramework: 'AgSwitch',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          field: 'ps_model',
          cellRendererFramework: 'Operating',
          width: this.nowpx(0.15) + 'px'
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
      addPoppupStatus: false,
      searchQuery: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
    }
  },
  mounted () {
    if (this.is_main_account) {
      this.getList()
    }
  },
  computed: {
    is_main_account () {
      const accountInfo = LocalStorage.getItem('lschainstore_account_info')
      if (accountInfo && accountInfo.level == 'manage') {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.context = this
  },
  methods: {
    getList () {
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('scales/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.scalesListData = res.data ? res.data.list : []
            this.dataListSelections = {}
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
    showAdd (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addScalesRef.init(id)
      })
    },
    clearBut () {
      this.searchQuery = ''
      this.getList()
      this.dataListSelections = {}
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条电子秤信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },

    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('scales/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条电子秤信息'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
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
    }
  }
}
</script>
