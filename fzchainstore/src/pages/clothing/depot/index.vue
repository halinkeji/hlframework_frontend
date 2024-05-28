<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="depotData.cd_name" label="仓库名称"  />
        </div>

        <q-btn unelevated color="primary"  label="搜索"  @click="getList()" />
        <q-btn unelevated color="warning"  label="重置"  @click="clearBut()" />
        <q-btn unelevated color="primary"  label="新增" v-if="authorityMeta('add')" @click="showPopup()"  />
        <q-btn
          unelevated
          color="red"
          :disable="selected.length > 0 ? false : true"
          label="批量删除"
          v-if="authorityMeta('delAll')"
          @click="delAll()"

        />
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="depotListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="adaptiveTable"
          @rowSelected="rowSelectedAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
      <add-depot ref="addRef" v-if="addPoppupStatus" @dataList="getList" />
    </div>
  </q-page>
</template>
<script>
import AddDepot from './components/AddDepot'
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
import AgStockStatus from './components/AgStockStatus'
export default {
  name: 'depotIndex',
  components: {
    AddDepot,
    AgStockStatus,
    AgOperate,
    AgStatus
  },
  data () {
    return {
      selected: [],
      depotData: {
        cd_name: ''
      },
      addPoppupStatus: false, // 弹出状态
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
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
          headerName: '编号',
          field: 'cd_code',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '仓库名称',
          field: 'cd_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '仓库位置',
          valueGetter: (p) => {
            return p.data.cd_province + '-' + p.data.cd_city + '-' + p.data.cd_district + '-' + p.data.cd_address
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '仓库状态',
          field: 'cd_status',
          width: this.nowpx(0.08) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '是否负库存',
          field: 'cd_if_owe_stock',
          width: this.nowpx(0.08) + 'px',
          cellRendererFramework: 'AgStockStatus'
        },
        {
          headerName: '说明',
          field: 'cd_note',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.12) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      depotListData: [],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.depotData.cd_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('clothingDepot/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.depotListData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
      let nowWidth = this.$q.screen.width - 262
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearBut () {
      this.depotData.cd_name = ''
      this.getList()
    },
    // 显示弹窗方法
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    // 隐藏弹窗方法
    getDataList () {
      this.addPoppupStatus = false
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 分页方法
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 分页方法
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 统计选中的ag表格行数方法
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
    },
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条仓库信息吗`,
          cancel: true
        })
        .onOk(() => {
          const selected = this.gridOptions.api.getSelectedRows()
          if (selected.length > 0) {
            const obj = selected.map((item) => {
              return item.id
            })
            this.$store.dispatch('clothingDepot/delAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条仓库信息！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selected = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
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
