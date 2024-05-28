<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-sm q-py-md">
        <div class="q-gutter-xs row ">
          <div class="col-12 col-md-2">
            <q-input  clearable label="级别名称" outlined v-model="searchQuery" dense />
          </div>

          <q-btn color="primary"  unelevated label="搜索" @click="getList" />
          <q-btn color="warning"  unelevated label="重置" @click="clean" />
          <q-btn color="primary"  unelevated label="新增会员级别" v-if="authorityMeta('add')" :to="{ name: 'addVip' }" />
          <q-btn color="red" unelevated v-if="authorityMeta('delAll')" label="批量删除" :disable="dataListSelections.length > 0 ? false : true" @click="delAll" />
          <q-btn color="positive" @click="editUpgradeDialog" unelevated label="管理升级规则"  />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="memberCardLevelListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="componentsAg"
          rowSelection="multiple"
          rowHeight="50"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :gridOptions="gridOptions"
          :stopEditingWhenGridLosesFocus="true"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
          @gridReady="onFirstDataRendered"
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

      <edit-upgrade-dialog v-if="editUpgradeDialogStatus" ref="editUpgradeDialogRef" @getMethods="colseEditDialog" />

    </div>
  </q-page>
</template>
<script>
import Operator from './components/AgOperator'
import ItemButton from './components/AgItemButton'
import ItemLevel from './components/AgItemLevel'
import PictureItem from './components/AgPictureItem'
import EditUpgradeDialog from './components/EditUpgradeDialog'

import AgDefaultView from './components/AgDefaultView'

export default {
  name: 'level',
  components: {
    Operator,
    ItemButton,
    ItemLevel,
    PictureItem,
    EditUpgradeDialog,
    AgDefaultView
  },
  data () {
    return {
      dialogWidth: '1000px',
      gridOptions: {},
      dataListSelections: {},

      context: null,

      memberCardLevelListData: [],
      componentsAg: {
        Operator,
        ItemButton,
        ItemLevel,
        PictureItem
      },
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },

        {
          headerName: '等级ID',
          field: 'id',
          width: this.nowpx(0.05) + 'px'
        },

        {
          headerName: '级别属性',
          field: 'mcl_default',
          cellRendererFramework: 'ItemLevel',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '级别名称',
          field: 'mcl_level_name',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '级别类型',
          field: 'mcl_type',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgDefaultView'

        },
        {
          headerName: '售卡金额',
          field: 'mcl_card_price',

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '有效期',
          field: 'mcl_time_type',
          cellRendererFramework: 'ItemButton',
          width: this.nowpx(0.22) + 'px'
        },

        {
          headerName: '级别图片',
          field: 'mcl_cover_image',
          cellRendererFramework: 'PictureItem',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.11) + 'px',
          pinned: 'right'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      editUpgradeDialogStatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  methods: {
    getList () {
      this.dataListSelections = []
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('level/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.memberCardLevelListData = res.data.list
          }
        })
        .catch((error) => {})
    },
    clean () {
      this.searchQuery = ''
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定删除会员级别吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store.dispatch('level/delData', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getList()
                this.dataListSelections = {}
              } else {
                this.$q.notify({
                  message: '删除失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getList()
                this.dataListSelections = {}
              }
            })
          }
        })
        .onCancel(() => {})
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
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      let lie = 1
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.mcl_sort)) {
        data.mcl_sort = 0
        this.$q.notify({
          message: '注意',
          caption: '请输入非负整数！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        lie = 0
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
      const obj = {
        mcl_sort: data.mcl_sort,
        id: data.id
      }
      this.$store
        .dispatch('level/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (lie == 1) {
              this.$q.notify({
                message: '成功',
                caption: '修改排序成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
            }
            this.getList()
          }
        })
        .catch((error) => {})
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
    },

    colseEditDialog () {
      this.editUpgradeDialogStatus = false
    },

    editUpgradeDialog () {
      this.editUpgradeDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editUpgradeDialogRef.init()
      })
    }
  }
}
</script>
