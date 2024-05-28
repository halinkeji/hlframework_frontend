<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row ">
      <q-input class="col-12 col-md-3 q-mt-sm " label="可搜索:会员卡号/手机号/真实姓名/昵称" outlined v-model="searchQuery" dense />
      <div class="col-12 col-md-4 q-mt-sm" v-if="is_main_store">
        <q-select
          label="查询门店"
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          use-chips
          :options="libInStoreList"
        />
      </div>
      <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getMemberListData" />
      <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="restButton" />
      <q-space />
    </div>
    <div class="col-shrink  full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="memberListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        @first-data-rendered="onFirstDataRendered"
        :context="context"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
    <add-track v-if="showStatus" ref="addTrackRef" @getMethods="goRecord"></add-track>
  </div>
</template>
<script>
import AddTrack from './components/AddTrack.vue'
import AgOperator from './components/AgOperator.vue'
export default {
  name: 'MemberList',
  components: { AddTrack, AgOperator },
  data () {
    return {
      showStatus: false,
      memberListData: [],
      components: {},
      context: null,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.09) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '真实姓名',
          field: 'mem_memberRealName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '到期时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.mem_specifiedEndTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '性别',
          field: 'mem_memberSex',
          valueGetter: (p) => {
            let sex = '未知'
            if (p.data.mem_memberSex == 1) {
              sex = '男'
            } else if (p.data.mem_memberSex == 2) {
              sex = '女'
            } else {
              sex = '未知'
            }
            return sex
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('right')
        },
        {
          headerName: '操作',
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.1) + 'px'
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
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      libInStoreList: [],
      selectStoreData: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getMemberListData()
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    setTrackData (val) {
      this.showStatus = true
      this.$nextTick(() => {
        this.$refs.addTrackRef.init(val)
      })
    },
    restButton () {
      this.searchQuery = ''
      this.selectStoreData = []
      this.getMemberListData()
    },
    getMemberListData () {
      this.dataListSelections = []
      const obj = {
        text: this.searchQuery,
        selectStoreData: this.selectStoreData,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        overtime: 1
      }
      this.$store
        .dispatch('track/getMemberListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.memberListData = res.data.list
              this.page.totalCount = parseInt(res.data.page.totalCount)
            } else {
              this.memberListData = []
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
                  this.getMemberListData()
                } else {
                  this.$q.notify({
                    message: '失败',
                    caption: res.message,
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'red'
                  })
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
      this.getMemberListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getMemberListData()
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
    goRecord () {
      this.$emit('goRecord')
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
