<template>
  <q-dialog v-model="roomDialogStatus" @close="closeDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
        height: this.$q.screen.height * 0.9 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white  q-pb-lg ">
          <div class="row q-px-sm items-center">
            <div class="text-subtitle2">日志记录</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
          </div>
          <q-separator class="q-my-xs" />

          <div class="row q-gutter-sm q-px-sm">
            <div class="col-2">
              <q-select
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="logType"
                :options="memberCardLevelDatas"
                dense
                label="请选择日志类型"
              />
            </div>

            <q-btn label="搜索" unelevated color="primary" @click="getRoomListData()" />
            <q-btn label="重置" unelevated color="warning" @click="resetList" />
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="memberListData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            rowHeight="50"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            @rowSelected="rowSelectedAg"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
          ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-pb-md row item-center q-pa-sm justify-center">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'RoomLog',
  components: {},
  data () {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      columnDefs: [
        // 表格列数据
        // {
        //   checkboxSelection: true, // 是否展示复选框
        //   headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
        //   headerCheckboxSelection: true, // 标题复选框开关状态
        //   width: 40
        // },
        // {
        //   headerName: '类型',
        //   field: 'srd_type',
        //   valueGetter: (p) => {
        //     if (p.data.srd_type == 'ocdorr') {
        //       return '开关门'
        //     }
        //     return ''
        //   }
        // },
        // {
        //   headerName: '唯一码',
        //   field: 'srd_only_code',
        //   filter: false
        // },
        {
          headerName: '内容',
          field: 'srd_content',
          filter: false
        },

        // {
        //   headerName: '门锁状态',
        //   field: 'srd_is_door_status',
        //   filter: false,
        //   valueGetter: (p) => {
        //     return p.data.srd_is_door_status == 'open' ? '开门' : '关门'
        //   }
        // },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(parseInt(p.data.srd_only_code), 'YYYY-MM-DD HH:mm:ss')
          }
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
      roomDialogStatus: false,

      memberCardLevelDatas: [],
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      currentRoomId: 0,
      logType: '',
      logTypeOptions: [
        {
          label: '开关门',
          value: 'ocdorr'
        }
      ]
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    init (id) {
      if (parseInt(id) > 0) {
        this.roomDialogStatus = true
        this.currentRoomId = parseInt(id)
        this.$nextTick(() => {
          this.getRoomListData()
        })
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getRoomListData () {
      if (parseInt(this.currentRoomId) <= 0) {
        return false
      }
      const obj = {
        currentRoomId: this.currentRoomId,
        pSize: this.page.pageSize,
        page: this.page.pageIndex,
        logType: this.logType
      }
      this.$store
        .dispatch('roomManage/getRoomLogDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.memberListData = res.data.list
              this.page.pageTotal = parseInt(res.data.page.totalCount)
            } else {
              this.memberListData = []
              this.page.pageTotal = 0
            }
          }
        })
        .catch((error) => {})
    },

    resetList () {
      this.logType = ''
      this.$nextTick(() => {
        this.getRoomListData()
      })
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getRoomListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRoomListData()
    },

    closeDialog () {
      this.roomDialogStatus = false
      this.$emit('closeDialog')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    }
  }
}
</script>
