<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-md row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="typeData.qrg_name" label="请输入名称" />
        </div>

        <q-btn unelevated color="primary"  label="搜索" @click="getList" />
        <q-btn unelevated color="grey"  label="重置" @click="clearBtn" />

        <q-btn unelevated color="primary"  label="新增" @click="showAddType" />

      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="sortListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @rowSelected="rowSelectedAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
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

    <add-room-group ref="typeRef" v-if="addTypePoppupStatus" @dataList="getList()" />
  </q-page>
</template>
<script>
import AddRoomGroup from './AddRoomGroup'
import TypeAgOperate from './TypeAgOperate'
import Mode from './AgMode'
export default {
  name: 'DeskType',
  components: {
    AddRoomGroup,
    TypeAgOperate,
    Mode
  },
  data () {
    return {
      showDialog: true,
      addTypePoppupStatus: false,
      typeData: {
        qrg_name: ''
      },
      context: null,
      gridOptions: {},
      selectedDeskType: [],
      sortListData: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 10
        },
        {
          headerName: '排序',
          field: 'qrg_sort',
          width: this.nowpx(0.06) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '名称',
          field: 'qrg_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '默认人数',
          field: 'qrg_default_people_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          field: 'qrg_status',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'Mode'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.17) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
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
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.addTypePoppupStatus = false
      const params = {
        name: this.typeData.qrg_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('roomManage/getRoomGroupList', params)
        .then((res) => {
          if (res.code == 200) {
            this.sortListData = res.data ? res.data.list : []
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
      let nowWidth = this.$q.screen.width - 814
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearBtn () {
      this.typeData.qrg_name = ''
      this.getList()
    },
    showAddType (id) {
      this.addTypePoppupStatus = true
      this.$nextTick(() => {
        this.$refs.typeRef.init(id)
      })
    },
    rowSelectedAg (p) {
      this.selectedDeskType = p.api.getSelectedRows()
    },
    // 修改排序的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.qrg_sort)) {
        data.qrg_sort = 1
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })

        return false
      }

      this.$store
        .dispatch('roomManage/saveRoomGroup', {
          id: data.id,
          qrg_sort: data.qrg_sort
        })
        .then((res) => {
          if (res.code == 200) {
            this.getList()
            this.$q.notify({
              message: '成功',
              caption: '修改排序成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((err) => {
          this.getList()
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
