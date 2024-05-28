<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <add-material ref="materialDialogRef" v-if="addMaterialPoppupStatus" @dataList="getList()" />

      <div class="col-shrink bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="cm_name" label="请输入原料名称"  />
        </div>

        <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBtn" class="q-px-md" />
        <q-btn unelevated color="primary" dense label="新增" v-if="authorityMeta('add')" @click="showAddType" class="q-px-md" />
        <q-btn
          unelevated
          color="red"
          dense
          label="批量删除"
          :disable="selectedData.length > 0 ? false : true"
          @click="delAll"
          class="q-px-md"
           v-if="authorityMeta('del')"
        />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="materialListData"
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
  </q-page>
</template>
<script>
import AddMaterial from './AddMaterial'
import AgOperate from './AgOperate'
export default {
  name: 'materialManage',
  components: {
    AddMaterial,
    AgOperate
  },
  data () {
    return {
      showDialog: true,
      addMaterialPoppupStatus: false,
      cm_name: '',
      context: null,
      gridOptions: {},
      selectedData: [],
      materialListData: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '名称',
          field: 'cm_name'
        },
        {
          headerName: '单位',
          field: 'cm_unit'
        },
        {
          headerName: '默认保质期天数',
          field: 'cm_exp_day'
        },
        {
          headerName: '入库价',
          field: 'cm_in_depot_price'
        },

        {
          headerName: '描述',
          field: 'cm_description'
        },

        {
          headerName: '操作',
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
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      this.addMaterialPoppupStatus = false
      const params = {
        cm_name: this.cm_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('materialManage/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.materialListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个原料信息吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedData = this.gridOptions.api.getSelectedRows()
          if (selectedData.length > 0) {
            const params = selectedData.map((item) => {
              return item.id
            })
            this.$store.dispatch('materialManage/batchMaterialDelete', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个原料信息！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedData = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 802
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
    // 分页变化
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearBtn () {
      this.cm_name = ''
      this.getList()
    },
    showAddType (id) {
      this.addMaterialPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.materialDialogRef.init(id)
      })
    },
    rowSelectedAg (p) {
      this.selectedData = p.api.getSelectedRows()
    },

    hideNowPage () {
      this.$emit('dataList')
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
