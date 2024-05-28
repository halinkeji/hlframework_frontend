<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-my-sm q-gutter-x-sm">
          <div class="col-12 col-md-3">
            <q-input label="姓名/电话" outlined v-model="searchData.userName" dense />
          </div>

          <q-btn @click="getUserList" color="primary" unelevated label="搜索" />
          <q-btn @click="resetSearch" color="warning" unelevated label="重置" />

        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="userDataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :components="componentsAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          rowHeight="50"
        >
        </ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        >
        </hl-pagination>
      </div>
    </div>

    <edit-dialog
        ref="editDialogRef"
        v-if="editDialogStatus"
        @closeDialog="
          editDialogStatus = false;
          getUserList();
        "
      />

  </q-page>
</template>

<script>
import AgUserOperator from './components/AgUserOperator'
import EditDialog from './Edit'
export default {
  components: {
    AgUserOperator,
    EditDialog
  },
  props: ['storeId', 'applyId'],
  data () {
    return {
      userDataList: [],
      searchData: {
        userName: '',
        statusIndex: ''
      },
      statusList: [
        {
          code: '1',
          name: '开启'
        },
        {
          code: '2',
          name: '关闭'
        }
      ],
      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      columnDefs: [
        {
          headerName: '用户名',
          field: 'username',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mobile',
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '更新时间',
          field: 'updated_at',
          valueGetter: this.agValueTime,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.1) + 'px',

          cellRendererFramework: 'AgUserOperator'

        }

      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      componentsAg: {

      },
      localeText: this.$ag_grid_localeText,
      context: null,
      userEditStatus: false,
      bindMobileStatus: false,
      editStatus: false,
      editUserInfoStatus: false,
      userCodeDialogStatus: false,
      storeAccountNum: 0,
      editDialogStatus: false
    }
  },
  watch: {},
  computed: {},
  created () {

  },
  mounted () {
    this.context = this
    this.gridApi = this.gridOptions.api
    this.getUserList()
  },
  methods: {
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

    // 获取用户信息
    getUserList () {
      this.userEditStatus = false
      const payload = {
        ...this.page,
        ...this.searchData
      }
      this.$store
        .dispatch('user/getUnSaasUserList', payload)
        .then((res) => {
          this.userDataList = res.data.list ? res.data.list : []
          this.page.pageTotal = res.data.page.totalCount
        })
        .catch((error) => {})
    },
    agValueTime (p) {
      return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getUserList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getUserList()
    },
    resetSearch () {
      this.searchData = {
        userName: '',
        statusIndex: ''
      }
      setTimeout(() => {
        this.getUserList()
      }, 100)
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
    activateStore (userData) {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editDialogRef.init(0, userData)
      })
    }
  }
}
</script>
