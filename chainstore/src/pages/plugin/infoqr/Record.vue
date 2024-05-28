<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 row q-gutter-xs">
      <div class="col-12 col-md-2">
        <q-input outlined dense v-model="userConditions.name" label="请输入编号|姓名|身份证号|联系地址" />
      </div>
      <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
      <q-btn unelevated color="grey" dense label="重置" @click="clearBut" class="q-px-md" />

      <q-btn unelevated color="primary" dense label="新增" v-if="authorityMeta('add')" class="q-px-md" @click="addUserInfo" />

      <q-btn
        color="red"
        unelevated
        :disable="dataListSelections.length > 0 ? false : true"
        v-if="authorityMeta('allDel')"
        label="批量删除"
        @click="delAll()"
      />

      <q-btn
        color="primary"
        class="q-mx-xs"
        unelevated
        @click="exportCsv"
        v-if="authorityMeta('export')"
        label="导出"
        :disable="userList.length == 0"
      />
    </div>

    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="userList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="50"
        :context="context"
        rowSelection="multiple"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>

    <add-user-info ref="addUserIfnoRef" v-if="addUserDialogStatus" @dataList="getDataList" />
    <view-user-info ref="viewUserIfnoRef" v-if="viewUserDialogStatus" @dataList="getDataList" />
  </div>
</template>
<script>
import AgOperator from './AgOperator.vue'
import AddUserInfo from './AddUserInfo.vue'
import ViewUserInfo from './ViewUserInfo.vue'

import AgUrl from './AgUrl.vue'
export default {
  name: 'ReserveManage',
  components: { AgOperator, AddUserInfo, AgUrl, ViewUserInfo },
  data () {
    return {
      components: {},
      addUserDialogStatus: false,
      userConditions: {
        name: ''
      },

      context: null,
      gridOptions: {},
      userList: [],
      columnDefs: [
        {
          filter: false,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.05) + 'px',
          pinned: 'left'
        },
        {
          headerName: '编号',
          field: 'piu_number',
          pinned: 'left'
        },

        {
          headerName: '姓名',
          field: 'piu_name',
          pinned: 'left'
        },
        {
          headerName: '联系电话',
          field: 'piu_phone_number',
          pinned: 'left'
        },
        {
          headerName: '年龄',
          field: 'piu_age'
        },

        {
          headerName: '性别',
          field: 'piu_sex'
        },

        {
          headerName: '身份证号',
          field: 'piu_card_id'
        },

        {
          headerName: '联系地址',
          field: 'piu_address'
        },

        {
          headerName: '紧急联系人姓名',
          field: 'piu_urgent_contact_name'
        },

        {
          headerName: '联系方式',
          field: 'piu_urgent_contact_model'
        },

        {
          headerName: '与用户关系',
          field: 'piu_urgent_contact_link'
        },

        {
          headerName: '既往病史',
          field: 'piu_medical_history'
        },

        {
          headerName: '备注',
          field: 'piu_note'
        },

        {
          headerName: '添加日期',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '二维码',
          field: 'created_at',
          cellRendererFramework: 'AgUrl',
          pinned: 'right'
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'AgOperator',
          pinned: 'right',
          width: this.nowpx(0.2)
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      dataListSelections: [],
      viewUserDialogStatus: false
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  methods: {
    getList () {
      this.addUserDialogStatus = false
      const obj = {
        ...this.userConditions,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('infoqr/getUserList', obj)
        .then((res) => {
          this.userList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    clearBut () {
      this.userConditions.name = ''

      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    addUserInfo (id) {
      this.addUserDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addUserIfnoRef.init(id)
      })
    },
    viewUserInfo (id) {
      this.viewUserDialogStatus = true
      this.$nextTick(() => {
        this.$refs.viewUserIfnoRef.init(id)
      })
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },
    // 关闭弹窗执行
    getDataList () {
      this.viewUserDialogStatus = false
      this.addReserveStatus = false
      this.getList()
    },
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条用户信息吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecordBatch()
        })
    },
    deleteRecordBatch () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('infoqr/delteleUserInfo', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条用户信息'
            })
            this.getList()
          }
        })
      }
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-用户信息'
      })
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
