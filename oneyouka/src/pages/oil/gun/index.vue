<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-pa-sm q-gutter-sm ">
      <div class="col-md-2 col-12 q-pt-none">
        <q-input outlined bottom-slots v-model="search" dense class="q-py-none" label="请输入油枪名称"> </q-input>
      </div>
      <q-btn unelevated color="primary" @click="getList()"  label="搜索" class="col-12 col-md-1 q-mt-sm" />
      <q-btn unelevated color="amber" label="重置"  class="col-12 col-md-1 q-mt-sm" @click="clearnBut()" />
      <q-btn unelevated color="primary" label="新增" v-if="authorityMeta('add')" class="col-12 col-md-1 q-mt-sm" @click="addOilGun(0)" />
      <q-btn
        :disabled="dataListSelections.length > 0 ? false : true"
        color="red"
        class="col-12 col-md-1 q-mt-sm"
        unelevated
        v-if="authorityMeta('delAll')"
        label="批量删除"
        @click="delAll()"
      />
    </div>
      <add-oil-gun v-if="isDialogStatus" @getMethods="getList()" ref="addOilGunRef"></add-oil-gun>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :defaultColDef="defaultColDef"
            @first-data-rendered="adaptiveTable"
            :rowData="oilGunlList"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            rowHeight="40"
            @rowSelected="rowSelectedAg"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :suppressRowTransform="true"
            :localeText="localeText"
            :context="context"
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
    </div>
  </q-page>
</template>

<script>
import AgUse from './components/AgUse'
import AgMode from './components/AgMode'
import AddOilGun from './components/AddOilGun'
export default {
  name: 'oilGun',
  components: { AgUse, AgMode, AddOilGun },
  data () {
    return {
      search: '',
      isDialogStatus: false,
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '油枪名称',
          field: 'og_name',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '油枪编号',
          field: 'og_code',
          filter: false,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '加油机',
          field: 'oilMachine.om_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '油品',
          field: 'oilProduct.op_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '油罐',
          field: 'oilCan.oc_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '状态',
          filter: false,
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgUse',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      gridOptions: {},
      oilGunlList: [],
      dataListSelections: [],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getList () {
      this.dataListSelections = []
      this.isDialogStatus = false
      const obj = {
        search: this.search,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('gun/getData', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.oilGunlList = res.data ? res.data.list : []
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
    addOilGun (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addOilGunRef.init(id)
      })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个油枪吗`,
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
        this.$store.dispatch('gun/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 个油枪'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
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
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    clearnBut () {
      this.search = ''
      this.getList()
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

<style></style>
