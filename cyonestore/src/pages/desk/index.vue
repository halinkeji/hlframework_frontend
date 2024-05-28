<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="deskData.dp_name" label="请输入名称"  />
        </div>
        <div  class="col-12 col-md-2">
          <q-select
          outlined
          dense
          v-model="deskData.dp_type_id"
          :options="deskTypeList"
          label="请选择餐区"
          option-value="id"
          option-label="dt_name"
          emit-value
          map-options
        />
        </div>

        <q-btn unelevated color="primary"  label="搜索"  @click="getList" />
        <q-btn unelevated color="warning"  label="重置" @click="clearBtn"  />
        <q-btn unelevated color="red"  label="批量删除" :disable="selectedDesk.length > 0 ? false : true" @click="delAll"  />

        <q-btn unelevated color="primary"  label="新增" @click="showAddDesk" />
        <q-btn unelevated color="primary"  label="批量新增" @click="showAddDesks"  />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="deskListData"
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
    <add-desk ref="addDeskRef" v-if="addPoppupStatus" @dataList="hideTablePoppup" />
    <add-desks ref="addDesksRef" v-if="addDesksPoppupStatus" @dataList="hideTablesPoppup" />
  </q-page>
</template>
<script>
import AgBadge from './components/AgBadge'
import AgOperate from './components/AgOperate'

import AddDesk from './AddDesk'
import AddDesks from './AddDesks'
export default {
  name: 'desk',
  components: {
    AgBadge,
    AgOperate,
    AddDesk,
    AddDesks
  },
  data () {
    return {
      addPoppupStatus: false,
      typePoppupStatus: false,
      addDesksPoppupStatus: false,
      context: '',
      deskData: {
        dp_name: '',
        dp_type_id: ''
      },
      selectedDesk: [],
      deskListData: [],
      deskTypeList: [],
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
          headerName: '编号',
          field: 'id'
        },
        {
          headerName: '排序',
          field: 'dp_sort',
          width: this.nowpx(0.12) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '区域',
          field: 'type.dt_name',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '名称',
          field: 'dp_name',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '当前状态',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgBadge'
        },
        {
          headerName: '就餐人数',
          field: 'dp_dine_people_number',
          width: this.nowpx(0.15) + 'px'
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
    this.getDeskTypeList()
  },
  mounted () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getDeskTypeList () {
      this.$store
        .dispatch('desk/getTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.deskTypeList = res.data ? res.data : []
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
    getList () {
      const params = {
        deskName: this.deskData.dp_name,
        deskType: this.deskData.dp_type_id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('desk/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskListData = res.data ? res.data.list : []
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个餐桌吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedDesk = this.gridOptions.api.getSelectedRows()
          if (selectedDesk.length > 0) {
            const params = selectedDesk.map((item) => {
              return item.id
            })
            this.$store.dispatch('desk/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个餐桌！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedDesk = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 272
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.deskData.dp_name = ''
      this.deskData.dp_type_id = ''
      this.getList()
    },
    showAddDesk (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addDeskRef.init(id)
      })
    },

    showAddDesks () {
      this.addDesksPoppupStatus = true
    },
    hideTablePoppup () {
      this.addPoppupStatus = false
      this.getList()
    },
    hideTablesPoppup () {
      this.addDesksPoppupStatus = false
      this.getList()
    },
    hideTypePoppup () {
      this.typePoppupStatus = false
      this.getDeskTypeList()
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
      if (!regu.test(data.dp_sort)) {
        data.dp_sort = 1
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
      } else {
        itemsToUpdate.push(data)
        this.$store
          .dispatch('desk/setData', data)
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
            this.getList()
          })
      }
    }
  }
}
</script>
