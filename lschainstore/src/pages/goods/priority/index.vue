<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-xs row">
          <div class="col-12 col-md-2">
            <q-input outlined v-model="searchName" label="层次名称" dense />
          </div>

          <q-btn color="primary" unelevated label="搜索" @click="getPriorityList" />
          <q-btn color="warning" unelevated label="重置" @click="clean" />
          <q-btn color="primary" unelevated label="新增" @click="addPopup" v-if="authorityMeta('add')" />
          <q-btn
            color="red"
            unelevated
            :disable="dataListSelections.length > 0 ? false : true"
            label="批量删除"
            v-if="authorityMeta('delAll')"
            @click="delAll()"
          />
          <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="groupData.length == 0" />
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="groupData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
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
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>

    <add-priority @getMethods="getPriorityList" ref="addRef" v-if="adddPriorityShow"></add-priority>
  </q-page>
</template>

<script>
import AgMeasureOperate from './components/AgMeasureOperate.vue'
import AddPriority from './components/AddPriority.vue'
import AgMode from './components/AgMode'
export default {
  name: 'PageIndex',
  components: {
    AgMeasureOperate,
    AgMode,
    AddPriority
  },
  data () {
    return {
      searchName: '',
      adddPriorityShow: false,
      gridOptions: {},
      components: {
        AgMeasureOperate,
        AgMode
      },
      context: null,
      groupData: [],
      dataListSelections: {},
      columnDefs: [
        {
          filter: false,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '层次名称',
          field: 'cp_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          field: 'fgt_status',
          filter: false,
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          field: 'measure_operate',
          filter: false,
          cellRendererFramework: 'AgMeasureOperate',
          width: this.nowpx(0.2) + 'px'
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

  mounted () {},
  created () {
    this.getPriorityList()
    this.context = this
  },
  computed: {},
  methods: {
    // 新增 编辑
    addPopup (id) {
      this.adddPriorityShow = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getPriorityList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getPriorityList()
    },

    // 获取列表,搜索
    getPriorityList () {
      this.adddPriorityShow = false
      const obj = {
        text: this.searchName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('goodsPriority/getPriorityList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.groupData = res.data ? res.data.list : []
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

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条商品层次吗`,
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
        this.$store.dispatch('goodsPriority/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条商品层次'
            })
            this.getPriorityList()
            this.dataListSelections = []
          }
        })
      }
    },
    clean () {
      this.searchName = ''
      this.getPriorityList()
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品层次'
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
