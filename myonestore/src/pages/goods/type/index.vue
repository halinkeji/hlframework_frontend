<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <q-chip square color="red" text-color="white" icon="report_problem" label="警告：如果上级分类被删除，那么相应的子分类也将被删除。" />
        <div class="q-gutter-x-xs row">
          <q-select
            class="col-12 col-md-2 q-mt-sm"
            outlined
            v-model="goodsType"
            :options="options"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            clearable
            label="请选择分类属性"
          />
          <q-select class="col-12 col-md-2 q-mt-sm" outlined v-model="modeId" clearable :options="mode" dense label="请选择分类状态" emit-value map-options />
          <q-input class="col-12 col-md-2 q-mt-sm " clearable outlined v-model="searchQuery" label="请输入分类名称" dense />

          <q-btn color="primary" class="q-mt-sm" unelevated label="搜索"  @click="getList" />
          <q-btn color="warning" class="q-mt-sm" unelevated label="重置"  @click="resetSearch" />
          <q-btn color="primary" class="q-mt-sm" unelevated label="新增" v-if="authorityMeta('add')" :to="{ name: 'addGoodsType' }" />
          <q-btn
            color="red"
            class="q-mt-sm"
            unelevated
            :disable="dataListSelections.length > 0 ? false : true"
            label="批量删除"
            v-if="authorityMeta('delAll')"
            @click="delAll()"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height  bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsTypeListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>

<script>
import Operator from './components/AgOperator'
import Mode from './components/AgMode'
import TypeChip from './components/AgTypeChip'
export default {
  name: 'PageIndex',
  components: {
    Operator,
    Mode,
    TypeChip
  },
  data () {
    return {
      dataListSelections: [],
      localeText: this.$ag_grid_localeText,
      context: null,
      gridOptions: {},
      columnDefs: [
        // 表格列数据
        {
          filter: false, // 是否过滤
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '排序',
          field: 'gt_sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '分类名称',
          field: 'gt_name',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '上级分类名称',
          filter: false,
          valueGetter: this.supTypeName,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '分类类型',
          field: 'gt_goods_type',
          cellRendererFramework: 'TypeChip',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          field: 'gt_ifSetStore',
          filter: false,
          cellRendererFramework: 'Mode',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '操作',
          field: 'goo_price',
          filter: false,
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },

      goodsTypeListData: [],
      selectData: [],
      components: {
        Operator,
        Mode,
        TypeChip
      },
      searchQuery: '',
      modeId: '',
      mode: [
        { label: '可用', value: 1 },
        { label: '不可用', value: 2 }
      ],
      options: [
        {
          label: '实物商品',
          value: 1
        },
        {
          label: '服务商品',
          value: 2
        },
        {
          label: '套餐商品',
          value: 3
        }
      ],
      goodsType: ''
    }
  },

  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    resetSearch () {
      this.searchQuery = ''
      this.goodsType = ''
      this.modeId = ''
      this.getList()
      this.dataListSelections = []
    },
    getList () {
      const obj = {
        text: this.searchQuery,
        attribute: this.goodsType,
        mode: this.modeId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }

      this.$store
        .dispatch('goodstype/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.pageTotal = res.data.page.totalCount
            } else {
              this.page.pageTotal = 0
            }
            this.goodsTypeListData = res.data.list
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
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条商品分类吗`,
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
        this.$store.dispatch('goodstype/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条商品分类'
            })
            this.getList()
          }
        })
      }
    },

    supTypeName (p) {
      const data = p.data
      if (data.gt_pid == 0) {
        return ''
      } else {
        for (let i = 0; i < this.goodsTypeListData.length; i++) {
          if (data.gt_pid == this.goodsTypeListData[i].id) {
            return this.goodsTypeListData[i].gt_name
          }
        }
      }
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.gt_sort = data.gt_sort.replace(/\s+/g, '')
      if (!data.gt_sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.gt_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getList()
      } else {
        const obj = {
          gt_sort: data.gt_sort,
          id: data.id
        }
        this.$store.dispatch('goodstype/setData', obj).then((res) => {
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
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
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
