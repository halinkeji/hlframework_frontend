<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs">
        <q-input outlined dense v-model="text" label="调整状态名称" class="col-12 col-md-2 q-ml-sm" />
        <q-select
          class="col-12 col-md-2"
          outlined
          option-value="value"
          option-label="label"
          emit-value
          map-options
          v-model="type"
          :options="[
            {
              label: '增加（+）',
              value: '1',
            },
            {
              label: '减少（-）',
              value: '2',
            },
          ]"
          dense
          label="类型"
          clearable
        />
        <q-select
          class="col-12 col-md-2"
          outlined
          option-value="value"
          option-label="label"
          emit-value
          map-options
          v-model="status"
          :options="[
            { label: '开启', value: '1' },
            { label: '关闭', value: '0' },
          ]"
          dense
          label="状态"
          clearable
        />
        <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList()" />
        <q-btn unelevated color="warning" dense label="重置" class="q-px-md" @click="clearBut()" />
        <q-btn unelevated color="primary" dense label="新增" v-if="authorityMeta('add')" @click="showPopup()" class="q-px-md" />
        <q-btn
          unelevated
          color="red"
          :disable="selected.length > 0 ? false : true"
          dense
          label="批量删除"
          v-if="authorityMeta('delAll')"
          @click="delAll()"
          class="q-px-md"
        />
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="typeListData"
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
      <add-type ref="addRef" v-if="addPoppupStatus" @dataList="getList" />
    </div>
  </q-page>
</template>
<script>
import AddType from './components/AddType'
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
export default {
  name: 'typeIndex',
  components: {
    AddType,
    AgOperate,
    AgStatus
  },
  data () {
    return {
      selected: [],
      text: '',
      status: '',
      type: '',
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
          headerName: '调整状态名称',
          field: 'ect_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '变更状态',
          field: 'ect_type',
          valueGetter: (p) => {
            if (parseInt(p.data.ect_type) == 1) {
              return '增加（+）'
            } else {
              return '减少（-）'
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '是否启用',
          field: 'ect_status',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '说明',
          field: 'ect_note',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      typeListData: [],
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
        text: this.text,
        status: this.status,
        type: this.type,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('erpChangeType/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.typeListData = res.data ? res.data.list : [] // 三元运算赋值
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
      this.text = ''
      this.status = ''
      this.type = ''
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条调整状态信息吗`,
          cancel: true
        })
        .onOk(() => {
          const selected = this.gridOptions.api.getSelectedRows()
          if (selected.length > 0) {
            const obj = selected.map((item) => {
              return item.id
            })
            this.$store.dispatch('erpChangeType/delAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条调整状态信息!',
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
      return true
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
