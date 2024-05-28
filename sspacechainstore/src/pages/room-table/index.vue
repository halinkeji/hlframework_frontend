<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="deskData.qrt_name" label="请输入名称"  />
        </div>
        <div  class="col-12 col-md-2">
          <q-select
          outlined
          dense
          v-model="deskData.roomGroupId"
          :options="deskTypeList"
          label="请选择桌台分组"
          option-value="id"
          option-label="qrg_name"
          emit-value
          map-options
        />
        </div>

        <q-btn unelevated color="primary"  label="搜索"  @click="getList" />
        <q-btn unelevated color="warning"  label="重置" @click="clearBtn"  />
        <!-- <q-btn unelevated color="red"  label="批量删除" :disable="selectedDesk.length > 0 ? false : true" @click="delAll"  /> -->

        <q-btn unelevated color="primary"  label="新增" @click="showAddDesk" />
        <q-btn unelevated color="primary"  label="批量新增" @click="showAddDesks"  />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="deskListData"
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
    <add-room-data ref="addDeskRef" v-if="addPoppupStatus" @dataList="hideTablePoppup" />
    <add-room-data-more ref="addRoomDataMore" v-if="addRoomDataMorePoppupStatus" @dataList="hideTablesPoppup" />
    <room-device-manage ref="diviceDialogRef" v-if="diviceDialogStatus" @dataList="hideDeviceDialog" />
    <room-log ref="roomLogDialogRef" v-if="roomLogDialogStatus" @closeDialog="hideRoomLogDialog" />
  </q-page>
</template>
<script>

import AgOperate from './AgOperate'
import AgMode from './AgMode'
import AddRoomData from './AddRoomData'
import AddRoomDataMore from './AddRoomDataMore'
import RoomDeviceManage from './RoomDeviceManage'
import RoomLog from './RoomLog'

export default {
  name: 'desk',
  components: {
    AgOperate,
    AgMode,
    AddRoomData,
    AddRoomDataMore,
    RoomDeviceManage,
    RoomLog
  },
  data () {
    return {
      diviceDialogStatus: false,
      addPoppupStatus: false,
      typePoppupStatus: false,
      addRoomDataMorePoppupStatus: false,
      roomLogDialogStatus: false,
      context: '',
      deskData: {
        qrt_name: '',
        roomGroupId: ''
      },
      selectedDesk: [],
      deskListData: [],
      deskTypeList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: 'ID',
          field: 'id'
        },
        {
          headerName: '排序',
          field: 'qrt_sort',
          width: this.nowpx(0.12) + 'px'

        },
        {
          headerName: '分组',
          field: 'roomGroup.qrg_name',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '名称',
          field: 'qrt_name',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '当前状态',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgMode'
        },
        {
          headerName: '最低消费',
          field: 'qrt_is_min_consume',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '标准人数',
          field: 'qrt_people_number',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.17) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.25) + 'px',
          cellRendererFramework: 'AgOperate'
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
    this.getRoomGroupDataList()
  },
  mounted () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getRoomGroupDataList () {
      this.$store
        .dispatch('roomManage/getRoomGroupDataList')
        .then((res) => {
          if (res.code == 200) {
            this.deskTypeList = res.data ? res.data : []
          }
        })
        .catch((err) => {
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
    getList () {
      const params = {
        name: this.deskData.qrt_name,
        roomGroupId: this.deskData.roomGroupId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('roomManage/getRoomDataList', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个桌台吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedDesk = this.gridOptions.api.getSelectedRows()
          if (selectedDesk.length > 0) {
            const params = selectedDesk.map((item) => {
              return item.id
            })
            this.$store.dispatch('desk/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个桌台！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedDesk = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 272
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.deskData.qrt_name = ''
      this.deskData.roomGroupId = ''
      this.getList()
    },
    showAddDesk (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addDeskRef.init(id)
      })
    },
    setDeviceData (id) {
      this.diviceDialogStatus = true
      this.$nextTick(() => {
        this.$refs.diviceDialogRef.init(id)
      })
    },

    hideDeviceDialog () {
      this.diviceDialogStatus = false
      this.getList()
    },

    openRoomLogDialog (id) {
      this.roomLogDialogStatus = true
      this.$nextTick(() => {
        this.$refs.roomLogDialogRef.init(id)
      })
    },

    hideRoomLogDialog () {
      this.roomLogDialogStatus = false
      this.getList()
    },

    showAddDesks () {
      this.addRoomDataMorePoppupStatus = true

      this.$nextTick(() => {
        this.$refs.addRoomDataMore.init()
      })
    },
    hideTablePoppup () {
      this.addPoppupStatus = false
      this.getList()
    },
    hideTablesPoppup () {
      this.addRoomDataMorePoppupStatus = false
      this.getList()
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
    rowSelectedAg (p) {
      this.selectedDesk = p.api.getSelectedRows()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }

  }
}
</script>
