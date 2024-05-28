<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="row q-gutter-x-sm">
          <q-input class="col-2" label="请输入员工名称/联系电话" outlined v-model="searchQuery" dense />

          <div class="col-4" v-if="is_main_store">
            <q-select
              label="查询门店"
              use-chips
              clearable
              v-model="selectStoreData"
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              :options="libInStoreList"
            />
          </div>

          <q-btn @click="getList" color="primary" unelevated label="搜索" />
          <q-btn @click="clearnBut" color="warning" unelevated label="重置" />
          <q-btn @click="addUserInfo" color="primary"  unelevated v-if="authorityMeta('add')" label="添加员工" />
          <q-btn
            :disable="dataListSelections.length > 0 ? false : true"
            @click="delAll"
            color="red"
            unelevated
            v-if="authorityMeta('del')"
            label="批量删除"
          />
        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="positionData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="40"
          rowSelection="multiple"
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
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
      <detail-data ref="itemDataRef" v-if="showDetailStatus" @dataList="getList" />
      <add-user-info :positionId="positionId" v-if="userStatus" ref="addUserInfoRef" @getMethods="getList"></add-user-info>
    </div>
  </q-page>
</template>

<script>
import AgUserOperator from './AgUserOperator'
import AgUserMode from './AgUserMode'
import DetailData from './DetailData'
import AddUserInfo from './AddUserInfo'
export default {
  name: 'AddUser',
  components: {
    AgUserOperator,
    AgUserMode,
    DetailData,
    AddUserInfo
  },
  data () {
    return {
      isDialogStatus: false,
      showDetailStatus: false,
      userStatus: false,
      context: null,
      gridOptions: {},
      positionData: [],
      positionId: '',
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 50
        },
        {
          headerName: ' 员工名称',
          field: 'pru_name'
        },
        {
          headerName: '联系电话',
          field: 'pru_telephone'
        },

        {
          headerName: '职位',
          field: 'position.prp_name'
        },

        {
          headerName: '绑定操作员',
          field: 'user.username'
        },
        {
          headerName: '绑定会员',
          field: 'member.mem_memberName'
        },
        {
          headerName: '状态',
          field: 'pru_status',
          cellRendererFramework: 'AgUserMode'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'AgUserOperator',
          width: 400
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: {},
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.positionId = this.$route.query.id

    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {
    this.getList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      this.isDialogStatus = false
      const obj = {
        position_id: this.positionId,
        name: this.searchQuery,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('commonReward/getUser', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.positionData = res.data ? res.data.list : []
            this.dataListSelections = {}
          }
        })
        .catch((error) => {})
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    addUserInfo (id) {
      this.userStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addUserInfoRef.getUser(id)
        }, 500)
      })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条员工吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('commonReward/delUserData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条员工'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.selectStoreData = []
      this.getList()
      this.dataListSelections = []
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
    viewRecord (data) {
      this.showDetailStatus = true
      this.$nextTick(() => {
        this.$refs.itemDataRef.init(data)
      })
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style></style>
