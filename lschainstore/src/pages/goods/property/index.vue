<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input clearable outlined v-model="searchName" label="名称" dense />
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getPropertyList" />
          <q-btn color="warning" unelevated label="重置" @click="cleanSearchData" />

        <q-btn @click="showPopup()" color="primary" unelevated v-if="authorityMeta('add')" label="新增" />
        <q-btn
          @click="deleteAll()"
          :disable="dataListSelections.length > 0 ? false : true"
          color="red"
          unelevated
          v-if="authorityMeta('allDel')"
          label="批量删除"
        />
        <q-btn color="primary" unelevated @click="exportCsv(activeTab)" label="导出Csv文件" :disable="CreditOperateData.length == 0" />
      </div>

      <div class="col-shrink bg-white q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="CreditOperateData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
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

    <add-property ref="addMoneyPoppupRef" :type="activeTab" v-if="addPoppupStatus" @dataList="getDataList" />
  </q-page>
</template>
<script>
import AddProperty from './components/AddProperty.vue'
import AgOperate from './components/AgOperate.vue'
import AgMode from './components/AgMode'
export default {
  components: {
    AddProperty,
    AgMode,
    AgOperate
  },
  data () {
    return {
      activeTab: 'brand',
      dataListSelections: 0,
      addPoppupStatus: false,
      gridOptions: {},
      CreditOperateData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: false,
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
          headerName: '排序',
          field: 'cp_sort',
          filter: false,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '编号',
          field: 'cp_code',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '名称',
          field: 'cp_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '类型',
          field: 'cp_type',
          filter: false,
          valueGetter: this.showType,
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
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperate',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      type: '',
      searchName: ''
    }
  },
  mounted () {
    this.getPropertyList(this.activeTab)
  },
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    getDataList (val) {
      this.addPoppupStatus = false
      this.activeTab = val
      this.getPropertyList()
    },
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addMoneyPoppupRef.init(id)
      })
    },
    // 批量删除
    deleteAll () {
      this.deleteBut()
    },
    // 批量删除是否可用
    deleteSelectBut (val) {
      this.dataListSelections = val
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getPropertyList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getPropertyList()
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
    showType (p) {
      const data = p.data
      switch (data.cp_type) {
        case 'fabric':
          return '面料类别'
        case 'safetytype':
          return '安全类别'
        case 'brand':
          return '品牌'
        case 'years':
          return '年份'
        case 'season':
          return '季度'
        case 'band':
          return '波段'
        case 'series':
          return '系列'
        case 'style':
          return '风格'
      }
    },
    cleanSearchData () {
      this.searchName = ''

      this.$nextTick(() => {
        this.getPropertyList()
      })
    },

    // 获取列表
    getPropertyList () {
      const obj = {
        type: this.activeTab,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        text: this.searchName
      }
      this.$store
        .dispatch('goodsProperty/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.CreditOperateData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {})
    },

    changeNumber (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.cp_sort)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正整数',
          color: 'red'
        })
        this.getPropertyList()
      } else {
        const obj = {
          cp_sort: data.cp_sort,
          id: data.id
        }
        this.$store
          .dispatch('goodsProperty/addData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '修改序号成功',
                color: 'green'
              })
              this.getPropertyList()
            }
          })
          .catch((error) => {})
      }
    },

    // 批量删除
    deleteBut () {
      if (this.dataListSelections.length > 0) {
        this.$q
          .dialog({
            type: 'confirm',
            color: 'primary',
            title: '是否确认',
            message: `确定批量删除 ${this.gridOptions.api.getSelectedRows().length} 条数据吗？`,
            cancel: true
          })
          .onOk(() => {
            const obj = this.dataListSelections.map((item) => {
              return item.id
            })
            this.$store
              .dispatch('goodsProperty/delData', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    color: 'green',
                    message: '删除成功',
                    caption: '成功删除 ' + res.data + ' 条',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getPropertyList()
                }
              })
              .catch((error) => {})
          })
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    exportCsv (val) {
      const text = this.showType({ data: { cp_type: val } })
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品属性-' + text
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
