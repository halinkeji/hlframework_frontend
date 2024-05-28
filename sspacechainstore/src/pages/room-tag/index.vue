<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="deskData.srt_name" label="请输入名称"  />
        </div>

        <q-btn unelevated color="primary"  label="搜索"  @click="getList" />
        <q-btn unelevated color="warning"  label="重置" @click="clearBtn"  />

        <q-btn unelevated color="primary"  label="新增" @click="showAddTag" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="tagListData"
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
    <add-room-tag ref="addRoomTagRef" v-if="addPoppupStatus" @dataList="hideTablePoppup" />
  </q-page>
</template>
<script>

import AgOperate from './AgOperate'
import AgMode from './AgMode'
import AddRoomTag from './AddRoomTag'

export default {
  name: 'desk',
  components: {
    AgOperate,
    AgMode,
    AddRoomTag
  },
  data () {
    return {
      addPoppupStatus: false,
      typePoppupStatus: false,
      context: '',
      deskData: {
        srt_name: '',
        roomGroupId: ''
      },
      selectedDesk: [],
      tagListData: [],
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
          headerName: '排序',
          field: 'srt_sort',
          width: this.nowpx(0.12) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },

        {
          headerName: '名称',
          field: 'srt_title',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '当前状态',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgMode'
        },

        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.17) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
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

  },
  mounted () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {

    getList () {
      const params = {
        name: this.deskData.srt_name,
        roomGroupId: this.deskData.roomGroupId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('roomTag/getTagList', params)
        .then((res) => {
          if (res.code == 200) {
            this.tagListData = res.data ? res.data.list : []
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

    nowpx (px) {
      let nowWidth = this.$q.screen.width - 272
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.deskData.srt_name = ''
      this.deskData.roomGroupId = ''
      this.getList()
    },
    showAddTag (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRoomTagRef.init(id)
      })
    },

    hideTablePoppup () {
      this.addPoppupStatus = false
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
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.srt_sort)) {
        data.srt_sort = 1
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
        .dispatch('roomTag/saveTagData', {
          srt_sort: p.data.srt_sort,
          id: p.data.id
        })
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
    }
  }
}
</script>
