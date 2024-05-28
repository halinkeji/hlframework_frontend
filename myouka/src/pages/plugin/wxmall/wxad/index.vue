<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <div class="row q-gutter-x-sm">
        <div class="col-12 col-md-2">
          <q-input label="请输入广告标题" outlined v-model="searchForm.searchQuery" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="searchForm.adPosition"
            :options="position"
            dense
            label="广告位置"
            clearable
          />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            clearable
            option-label="label"
            emit-value
            map-options
            v-model="searchForm.adStatus"
            :options="status"
            dense
            label="广告状态"
          />
        </div>

        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
        <q-btn @click="addAdData(0)" color="primary" unelevated label="新增" />
        <q-btn :disabled="dataListSelections.length > 0 ? false : true" @click="delAll()" color="red" unelevated label="批量删除" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="adListData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :context="context"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
        :singleClickEdit="true"
        :stopEditingWhenGridLosesFocus="true"
      ></ag-grid-vue>
    </div>

    <add-ad v-if="isDialogStatus" @getMethods="getList" ref="addJfmallRef"></add-ad>
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
  </div>
</template>
<script>
import AgOperator from './components/AgOperator.vue'
import AgPictureItem from './components/AgPictureItem.vue'
import AgMode from './components/AgMode.vue'
import AgChip from './components/AgChip.vue'
import AddAd from './components/AddAd.vue'
export default {
  name: 'wxmallAd',
  components: {
    AgOperator,
    AgMode,
    AgPictureItem,
    AddAd,
    AgChip
  },
  data () {
    return {
      searchForm: {
        adStatus: '',
        adPosition: '',
        searchQuery: ''
      },

      position: [
        { value: 1, label: '首页轮播广告' },
        { value: 2, label: '首页展示广告' },
        { value: 3, label: '商品详情广告' },
        { value: 4, label: '全部商品广告' },
        { value: 5, label: '我的页面广告' }
      ],
      status: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 2,
          label: '关闭'
        }
      ],
      isDialogStatus: false,
      context: null,
      components: {
        AgOperator,
        AgMode,
        AgPictureItem,
        AgChip
      },
      gridOptions: {},
      adListData: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '排序',
          field: 'wa_sort',
          editable: true,
          onCellValueChanged: this.changeSort,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 广告标题',
          field: 'wa_title',
          width: this.nowpx(0.23) + 'px'
        },
        {
          headerName: '广告图片',
          cellRendererFramework: 'AgPictureItem',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '广告位置',
          cellRendererFramework: 'AgChip',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '状态',
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isDialogStatus = false
      const obj = {
        ...this.searchForm,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('wxMallAd/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.adListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.dataListSelections = []
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
    addAdData (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addJfmallRef.getItem(id)
      })
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条广告吗`,
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
        this.$store.dispatch('wxMallAd/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条广告'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnBut () {
      this.searchForm = {
        adStatus: '',
        adPosition: '',
        searchQuery: ''
      }

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
    changeSort (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.wa_sort)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正整数',
          color: 'red'
        })
        this.getList()
      } else {
        const obj = {
          wa_sort: data.wa_sort,
          id: data.id
        }
        this.$store
          .dispatch('wxMallAd/setData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '修改排序成功',
                color: 'green'
              })
              this.getList()
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
      }
    }
  }
}
</script>
