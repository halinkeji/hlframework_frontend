<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md">

      <div class="q-gutter-x-xs row ">
        <div class="col-12 col-md-3 ">
          <q-input clearable  label="可搜索:会员卡号/手机号/身份证号/真实姓名/昵称" outlined v-model="searchQuery" dense />
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getMemberListData" />
        <q-btn color="warning" unelevated label="重置" @click="clean" />
        <q-space />
        <q-btn flat color="black" icon="dialpad">
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item tag="label" v-ripple v-for="(item, key) in columnDefs" :key="key" >
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
          field: 'nick_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '微信公众号标识',
          field: 'wx_openid',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '微信小程序标识',
          field: 'wxxcx_openid',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '企业微信标识',
          field: 'qywx_openid',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '微信开放平台',
          field: 'wx_unionid',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '支付宝小程序',
          field: 'zfbxcx_openid',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '抖音小程序标识',
          field: 'dyxcx_openid',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '加入时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        }
        // {
        //   headerName: '操作',
        //   pinned: this.pinnedComputed('right'),
        //   cellRendererFramework: 'NotRegOperating',
        //   width: this.nowpx(0.15) + 'px'
        // }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: true,
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
      this.page.pSize = val
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
