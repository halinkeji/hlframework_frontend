<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mt-xs">
      <div class="row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="projectData.prp_name" label="项目名称" />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="projectData.prp_type_id"
            option-value="id"
            option-label="prt_name"
            :options="typeOptions"
            label="请选择分类"
            emit-value
            map-options
          />
        </div>
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md"  @click="getList" />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBut"  class="q-px-md" />
        <q-btn unelevated color="green" dense label="新增项目" v-if="authorityMeta('addProject')" @click="showAddProject" class="q-px-md" />
        <q-btn
          unelevated
          color="red"
          :disable="selected.length > 0 ? false : true"
          dense
          label="批量删除"
          v-if="authorityMeta('delAllProject')"
          @click="delAll"
          class="q-px-md"
        />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="reserveList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @rowSelected="rowSelectedAg"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="50"
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

    <add-reserve-project ref="addProjectRef" v-if="addProjectStatus" @dataList="getDataList" />

  </div>
</template>
<script>
import AgOperating from './AgOperating'
import AddReserveProject from './AddReserveProject'
export default {
  name: 'ReserveProject',
  components: { AgOperating, AddReserveProject },
  data () {
    return {
      components: { AgOperating, AddReserveProject },
      addProjectStatus: false,
      reserveLogStatus: false,
      typeOptions: [],
      projectData: {
        prp_name: '',
        prp_type_id: ''
      },
      selected: [],
      context: null,
      gridOptions: {},
      reserveList: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '排序',
          field: 'prp_sort',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '项目名称',
          field: 'prp_name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '分类',
          field: 'type.prt_name',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '今日预约总数',
          field: 'totalCount',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '今日完成',
          field: 'successCount',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '今日已接',
          field: 'ordersCount',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '今日未接',
          field: 'noOrdersCount',
          width: this.nowpx(0.07) + 'px'
        },

        {
          headerName: '今日撤销',
          field: 'revokeCount',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '明日预约',
          field: 'tomorrowCount',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '截止时间',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.prp_time_end * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          width: this.nowpx(0.16) + 'px',
          cellRendererFramework: 'AgOperating'
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
  created () {
    this.getList()
    this.getReserveTypeList()
    this.context = this
  },
  mounted () {},
  methods: {
    getReserveTypeList () {
      this.$store
        .dispatch('reserve/getReserveTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.typeOptions = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取失败',
              color: 'red'
            })
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
    },
    getList () {
      const obj = {
        name: this.projectData.prp_name,
        type: this.projectData.prp_type_id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('reserve/getListData', obj)
        .then((res) => {
          this.reserveList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
    },
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条预约项目吗`,
          cancel: true
        })
        .onOk(() => {
          const selected = this.gridOptions.api.getSelectedRows()
          if (selected.length > 0) {
            const obj = selected.map((item) => {
              return item.id
            })
            this.$store
              .dispatch('reserve/delAll', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功删除 ' + res.data + ' 条预约项目！',
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
    // 修改排序的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.prp_sort)) {
        data.prp_sort = 1
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
          .dispatch('reserve/setData', data)
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
    // 重置按钮方法
    clearBut () {
      this.projectData.prp_name = ''
      this.projectData.prp_type_id = ''
      this.getList()
    },
    // 显示新增预约项目弹窗
    showAddProject (id) {
      this.addProjectStatus = true
      this.$nextTick(() => {
        this.$refs.addProjectRef.init(id)
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
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 关闭弹窗执行
    getDataList () {
      this.addProjectStatus = false
      this.reserveLogStatus = false
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
