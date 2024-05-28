<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row q-mt-xs">

      <q-input class="col-12 col-md-3 " v-if="!currentMemberId" label="可搜索:会员卡号/手机号/真实姓名/昵称" outlined v-model="member" dense />
      <q-input class="col-12 col-md-3 " label="可搜索:日志标题" outlined v-model="searchQuery" dense />

      <q-btn color="primary" class="q-px-xl" unelevated label="搜索" @click="getListData" />
      <q-btn color="warning" class="q-px-xl" unelevated label="重置" @click="restButton" />

      <q-btn color="primary" class="q-px-xl" unelevated label="新增" v-if="currentMemberId" @click="setTrackData(currentMemberId, null)" />
      <q-space />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="recordListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :context="context"
        @first-data-rendered="onFirstDataRendered"
        :localeText="localeText"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
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
      ></hl-pagination>
    </div>
    <add-track v-if="showStatus" ref="addTrackRef" @getMethods="getListData"></add-track>
  </div>
</template>
<script>
import AddTrack from './components/AddTrack.vue'
import AgReOperator from './components/AgReOperator.vue'
export default {
  name: 'RecordList',
  props: ['currentMemberId'],
  components: { AddTrack, AgReOperator },
  data () {
    return {
      showStatus: false,
      recordListData: [],
      components: {},
      context: null,
      dataListSelections: [],
      columnDefsForm: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      member: '',
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      trackConfigData: {}
    }
  },
  computed: {

  },
  created () {
    this.getStatus()
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    // this.getListData()
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getStatus () {
      this.$store
        .dispatch('track/getStatus')
        .then((res) => {
          if (res.code == 200) {
            this.trackConfigData = res.data ? res.data : {}
            this.getColumn(res.data)
          } else {
            this.getColumn()
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

    getColumn (val) {
      if (val && val.track_config_from > '0') {
        console.log(parseInt(val.track_config_from))
        this.$store
          .dispatch('formfield/getColumnDefs', parseInt(val.track_config_from))
          .then((res) => {
            if (res.code == 200) {
              this.columnDefsForm = res.data
              this.restColumnData()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
      } else {
        this.restColumnData()
      }
    },
    restColumnData () {
      this.gridOptions.api.setColumnDefs([])
      const columnData = [
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '真实姓名',
          field: 'mem_memberRealName'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile'
        },
        {
          headerName: '日志标题',
          field: 'ptr_title'
        },
        {
          headerName: '日志内容',
          field: 'ptr_detail'
        },

        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.12) + 'px',
          cellRendererFramework: 'AgReOperator'
        }
      ]

      if (this.columnDefsForm) {
        this.columnDefsForm.forEach(function (item) {
          columnData.push(item)
        })
      }

      this.gridOptions.api.setColumnDefs(columnData)
      this.gridOptions.api.sizeColumnsToFit()

      this.getListData()
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    setTrackData (val, id) {
      this.showStatus = true
      this.$nextTick(() => {
        this.$refs.addTrackRef.init(val, id)
      })
    },
    restButton () {
      this.member = ''
      this.searchQuery = ''
      this.selectStoreData = []
      this.getListData()
    },
    getListData () {
      this.dataListSelections = []
      const obj = {
        name: this.member,
        text: this.searchQuery,
        selectStoreData: this.selectStoreData,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        overtime: 1
      }
      this.$store
        .dispatch('track/getTrackListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.recordListData = res.data.list
              this.page.totalCount = parseInt(res.data.page.totalCount)
            } else {
              this.recordListData = []
              this.page.totalCount = 0
            }
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员删除至回收站吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return {
                id: item.id,
                mem_memberStatus: 2
              }
            })
            this.$store
              .dispatch('member/allupdate', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功删除 ' + res.data + ' 条！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.dataListSelections = []
                  this.getListData()
                }
              })
              .catch((err) => {
                this.$q.notify({
                  message: '失败',
                  caption: err.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              })
          }
        })
        .onCancel(() => {})
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getListData()
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
