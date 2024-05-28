<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md">
      <div class="q-gutter-x-xs row ">
        <q-btn-dropdown class=" q-mt-sm q-ml-xs" color="green" label="导入导出" :menu-offset="[10, 6]" v-if="authorityMeta('importOrExport')" unelevated>
          <q-list class="text-center ">
            <q-item clickable @click="batchImport" v-if="authorityMeta('import')">
              <q-item-section>
                <q-item-label>
                  Csv文件批量导入
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="outCsv" v-if="authorityMeta('export')">
              <q-item-section>
                <q-item-label> 导出Csv文件</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="q-gutter-x-xs row ">
        <q-input clearable class="col-12 col-md-3 q-mt-sm " label="可搜索:会员卡号/手机号/身份证号/真实姓名/昵称" outlined v-model="searchQuery" dense />

        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getMemberListData" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="clean" />
        <q-space />
        <q-btn flat color="black" icon="dialpad">
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item tag="label" v-ripple v-for="(item, key) in columnDefs" :key="key" v-if="item.headerName">
                <q-item-section side top>
                  <q-checkbox v-model="sideBarColumn" @input="changeShowColumn" :val="item.headerName" />
                </q-item-section>

                <q-item-section v-if="item.headerName">
                  <q-item-label>{{ item.headerName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
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
        :rowData="memberListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="50"
        :floatingFilter="false"
        @first-data-rendered="onFirstDataRendered"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :context="context"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
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
    <upload-table-member v-if="memberUploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-member>

  </div>
</template>
<script>
import NotRegOperating from './NotRegOperating.vue'
export default {
  name: 'MemberList',
  components: {
    NotRegOperating
  },
  props: ['memberCardLevelDatas'],
  data () {
    return {
      components: {},
      memberListData: [],
      context: null,
      deleteAllIf: true,
      memberUploadStatus: false,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '级别',
          field: 'memberLevel.mcl_level_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '真实姓名',
          field: 'mem_memberRealName',
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
          headerName: '出生日期',
          field: 'mem_memberBirthdayYear',
          valueGetter: (p) => {
            if (p.data.mem_memberBirthdayYear > 0) {
              return p.data.mem_memberBirthdayYear + '年' + p.data.mem_memberBirthdayMonth + '月' + p.data.mem_memberBirthdayDay + '日'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '加入时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'NotRegOperating',
          width: this.nowpx(0.15) + 'px'
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
      isInputDisabled: false,
      isPopupShow: false,
      mem_memberMoneyCount: 0,
      mem_memberPointsCount: 0,
      batchOperate: 1,
      dialogWidth: '1000px',
      levelId: '',
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      operateOptions: [
        {
          label: '增加',
          value: 1
        },
        {
          label: '减少',
          value: 2
        },
        {
          label: '清空',
          value: 3
        }
      ],
      sideBarColumn: []
    }
  },
  computed: {},
  created () {
    this.sideBarColumn = this.columnDefs.map((x) => {
      return x.headerName
    })
    this.context = this
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  mounted () {
    this.getMemberListData()
  },
  methods: {
    changeShowColumn () {
      this.gridOptions.api.setColumnDefs([])
      this.$nextTick(() => {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        this.gridOptions.api.setColumnDefs(newAgColumnDefs)
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

    clean () {
      this.searchQuery = ''
      this.levelId = ''
      this.getMemberListData()
    },
    out () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-会员未激活记录'
      })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getMemberListData () {
      this.dataListSelections = []
      const obj = {
        text: this.searchQuery,
        levelId: this.levelId,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        state: -1
      }
      this.$store
        .dispatch('member/getListData', obj)
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
        .catch((error) => {})
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
                }
              })
              .catch((error) => {})
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
    // 批量导入
    batchImport () {
      this.memberUploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('member')
        }, 500)
      })
    },
    uploadTable () {
      this.memberUploadStatus = false
      this.getMemberListData()
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
