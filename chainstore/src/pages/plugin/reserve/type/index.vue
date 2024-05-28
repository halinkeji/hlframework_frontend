<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-grey-3">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pb-xs q-mt-xs">
      <div class="row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="typeData.prt_name" label="请输入分类名称" />
        </div>
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md"  @click="getList" />
        <q-btn unelevated color="grey" dense label="重置"  @click="clearBut" class="q-px-md" />
        <q-btn unelevated color="green" dense label="新增分类" v-if="authorityMeta('addType')" @click="showAddType" class="q-px-md" />
        <q-btn
          unelevated
          color="red"
          :disable="selected.length > 0 ? false : true"
          dense
          label="批量删除"
          v-if="authorityMeta('delAllType')"
          @click="delAll"
          class="q-px-md"
        />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        ref="agGridTable"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="reserveTypeList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @rowSelected="rowSelectedAg"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="70"
        :context="context"
        rowSelection="multiple"
        :localeText="localeText"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>

    <add-type ref="addTypeRef" v-if="addTypeStatus" @dataList="getDataList" />
  </div>
</template>
<script>
import TypeAgOperate from './TypeAgOperate'
import TypeAgImg from './TypeAgImg'
import AddType from './AddType'
export default {
  name: 'ReserveType',
  components: { TypeAgOperate, AddType, TypeAgImg },
  data () {
    return {
      components: { TypeAgOperate, AddType, TypeAgImg },
      addTypeStatus: false,
      typeData: {
        prt_name: ''
      },
      selected: [],
      context: null,
      gridOptions: {},
      reserveTypeList: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '排序',
          field: 'prt_sort',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '分类名称',
          field: 'prt_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '分类图片',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'TypeAgImg'
        },

        {
          headerName: '分类详情',
          field: 'prt_description',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'TypeAgOperate'
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
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getList () {
      const obj = {
        name: this.typeData.prt_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('reserve/getReserveTypeData', obj)
        .then((res) => {
          this.reserveTypeList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条预约分类吗`,
          cancel: true
        })
        .onOk(() => {
          const selected = this.gridOptions.api.getSelectedRows()
          if (selected.length > 0) {
            const obj = selected.map((item) => {
              return item.id
            })
            this.$store
              .dispatch('reserve/delReserveType', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功删除 ' + res.data + ' 条预约分类！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.selected = []
                  this.getList()
                }
              })
              .catch((error) => {
                this.$q.notify({
                  message: '失败',
                  caption: error.message,
                  color: 'red',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              })
          }
        })
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.prt_sort)) {
        data.prt_sort = 1
        itemsToUpdate.push(data)
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else {
        itemsToUpdate.push(data)
        this.$store
          .dispatch('reserve/setReserveTypeData', data)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改排序成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getList()
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
          })
      }
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearBut () {
      this.typeData.prt_name = ''
      this.getList()
    },
    // 显示新增分类弹窗
    showAddType (id) {
      this.addTypeStatus = true
      this.$nextTick(() => {
        this.$refs.addTypeRef.init(id)
      })
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 关闭新增分类弹窗执行
    getDataList () {
      this.addTypeStatus = false
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
