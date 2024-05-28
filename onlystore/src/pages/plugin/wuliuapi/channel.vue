<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs">
        <div class="col-12 col-md-2 ">
          <q-select
            outlined
            label="功能开关"
            v-model="channel"
            :options="channelArray"
            dense
            emit-value
            map-options
          ></q-select>
        </div>

        <q-btn color="primary"  unelevated label="搜索" @click="getList" />
        <q-btn color="warning"  unelevated label="重置" @click="clearBut" />
        <q-btn color="primary"  unelevated label="新增" @click="addChannel" />
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="memberData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="60"
          :context="context"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
    <api-channel-dialog v-if="apiDialogStatus" @colseDialog="getList" ref="channelDialogRef" />
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import ApiChannelDialog from './components/ApiChannelDialog'
export default {
  components: { ApiChannelDialog, AgOperate },
  data () {
    return {
      apiDialogStatus: false,
      search: '',
      memberData: [],
      gridOptions: {},
      columnDefs: [
        // 表格列数据
        {
          headerName: '渠道',
          field: 'wc_channel',
          valueGetter: (p) => {
            return this.channelObject[p.data.wc_channel]
          }
        },
        {
          headerName: '渠道标识',
          field: 'wc_channel',
          valueGetter: (p) => {
            return p.data.wc_channel
          }
        },

        {
          headerName: '操作',
          field: 'make',
          filter: false,
          cellRendererFramework: 'AgOperate',
          width: 180
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
        pSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      channel: '',
      channelObject: {},
      channelArray: []

    }
  },

  mounted () {
    this.getList()
  },
  created () {
    this.getChannelConfig()
    this.context = this
  },
  computed: {},
  methods: {
    // 获取认证信息列表
    getList () {
      this.apiDialogStatus = false
      const obj = {
        channel: this.channel,
        pSize: this.page.pSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('wuliuapi/getDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.memberData = res.data ? res.data.list : []
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
    // 重置
    clearBut () {
      this.channel = ''
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    addChannel (channelId) {
      this.apiDialogStatus = true
      this.$nextTick(() => {
        this.$refs.channelDialogRef.init(channelId)
      })
    },
    getChannelConfig () {
      this.$store.dispatch('wuliuapi/getChannelBase', this.channelId).then((res) => {
        if (res.code == 200) {
          this.channelArray = res.data && res.data.channelArray ? res.data.channelArray : []
          this.channelObject = res.data && res.data.channelObject ? res.data.channelObject : []
        }
      })
    },
    deleteChannel (channelId) {
      this.$store
        .dispatch('wuliuapi/deleteData', channelId)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除渠道配置成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }

  }
}
</script>
