<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row ">
          <div class="col-12 col-md-2">
            <q-input outlined v-model="searchName" label="属性名称" dense />
          </div>
          <q-btn color="primary" unelevated label="搜索" @click="getCustomizeList" />
          <q-btn color="warning" unelevated label="重置" @click="clean" />
          <q-btn color="primary" unelevated label="新增" @click="addPopup" v-if="authorityMeta('add')" />
          <q-btn
            color="red"
            unelevated
            :disable="dataListSelections.length > 0 ? false : true"
            label="批量删除"
            v-if="authorityMeta('delAll')"
            @click="delAll()"
          />
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="clothingCustomizeData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          @rowSelected="rowSelectedAg"
          :context="context"
          :localeText="localeText"
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
    <add-customize @getMethods="getCustomizeList" ref="addRef" v-if="adddCustomizeShow"></add-customize>
    <add-customize-detail @getMethods="getCustomizeList" ref="addDetailRef" v-if="adddCustomizeDetsilShow" />
  </q-page>
</template>

<script>
import AgOperater from './components/AgOperater.vue'
import AddCustomize from './components/AddCustomize.vue'
import AddCustomizeDetail from './components/AddCustomizeDetail.vue'
import AgStatus from './components/AgStatus.vue'
import AgManual from './components/AgManual.vue'
import AgRequired from './components/AgRequired.vue'
export default {
  name: 'customizeIndex',
  components: {
    AgOperater,
    AddCustomize,
    AgStatus,
    AgManual,
    AgRequired,
    AddCustomizeDetail
  },
  data () {
    return {
      searchName: '',
      adddCustomizeShow: false,
      adddCustomizeDetsilShow: false,
      gridOptions: {},
      components: {
        AgOperater
      },
      context: null,
      clothingCustomizeData: [],
      dataListSelections: {},
      columnDefs: [
        {
          filter: false,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '#',
          width: 60,
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '属性名称',
          field: 'cc_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '属性编码',
          field: 'cc_code',
          filter: false,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '是否多选',
          field: 'cc_if_choose',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '是否必填',
          field: 'cc_if_required',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgRequired'
        },
        {
          headerName: '是否手动输入',
          field: 'cc_if_manual_input',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgManual'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          field: 'measure_operate',
          filter: false,
          cellRendererFramework: 'AgOperater',
          width: this.nowpx(0.2) + 'px'
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

  mounted () {},
  created () {
    this.getCustomizeList()
    this.context = this
  },
  computed: {},
  methods: {
    // 新增 编辑
    addPopup (id) {
      this.adddCustomizeShow = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    addDetailPopup (id) {
      this.adddCustomizeDetsilShow = true
      this.$nextTick(() => {
        this.$refs.addDetailRef.init(id)
      })
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getCustomizeList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getCustomizeList()
    },

    // 获取列表,搜索
    getCustomizeList () {
      this.adddCustomizeShow = false
      const obj = {
        text: this.searchName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('clothingCustomize/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.clothingCustomizeData = res.data ? res.data.list : []
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

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条自定义属性吗`,
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
        this.$store.dispatch('clothingCustomize/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条自定义属性'
            })
            this.getCustomizeList()
            this.dataListSelections = []
          }
        })
      }
    },
    clean () {
      this.searchName = ''
      this.getCustomizeList()
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
