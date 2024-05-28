<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-x-sm">
          <q-input class="col-12 col-md-2 q-mt-sm" label="请输入商品名称" outlined v-model="searchQuery" dense />
          <q-select outlined class="col-12 col-md-2 q-mt-sm" option-value="value" option-label="label" emit-value map-options v-model="stateType" :options="stateOptions" dense label="商品状态" />
          <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
          <q-btn @click="clearnButton()" color="warning" class=" col-12 col-md-1 q-mt-sm" unelevated label="重置" />
          <q-btn
            :to="{
              name: 'jfmallGoodsEdit',
            }"
            color="primary"
            class=" col-12 col-md-1 q-mt-sm"
            unelevated
            label="新增"
            v-if="authorityMeta('add')"
          />
           <q-btn
            :disabled="dataListSelections.length > 0 ? false : true"
            @click="delAll()"
            color="red"
            class="col-12 col-md-1 q-mt-sm"
            unelevated
            label="批量删除"
            v-if="authorityMeta('delAll')"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="goodsList"
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
  </q-page>
</template>
<script>
import AgOperator from './components/AgOperator'
import AgMode from './components/AgMode'
export default {
  name: 'jfMallGoods',
  components: {
    AgOperator,
    AgMode
  },
  data () {
    return {
      stateType: '',
      stateOptions: [
        {
          label: '上架',
          value: '1'
        },
        {
          label: '下架',
          value: '2'
        }
      ],
      context: null,
      components: { AgOperator, AgMode },
      gridOptions: {},
      goodsList: [],
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
          field: 'jg_sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeSort,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'jg_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '商品售价',
          field: 'jg_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '标价',
          field: 'jg_list_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总限购',
          field: 'jg_total_limit_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '单人限购',
          field: 'jg_one_limit_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '出售数量',
          field: 'jg_sell_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '虚拟出售 ',
          field: 'jg_fake_sell_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员价',
          field: 'id',
          valueGetter: (p) => {
            if (p.data.jg_is_member_price == '1') {
              return '是'
            } else {
              return '否'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit + '支付',
          field: 'id',
          valueGetter: (p) => {
            if (p.data.jg_is_point_price == '1') {
              return '是'
            } else {
              return '否'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '支付',
          field: 'id',
          valueGetter: (p) => {
            if (p.data.jg_is_save_price == '1') {
              return '是'
            } else {
              return '否'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '状态',
          cellRendererFramework: 'AgMode',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.2) + 'px',
          pinned: 'right'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
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
      const obj = {
        status: this.stateType,
        nameParams: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('jfgoods/getGoodsLists', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.goodsList = res.data ? res.data.list : []
            this.dataListSelections = []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            caption: error.message,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    changeSort (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.wg_sort = data.wg_sort.replace(/\s+/g, '')
      if (!data.wg_sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.wg_sort)) {
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
          wg_sort: data.wg_sort,
          id: data.id
        }
        this.$store.dispatch('jfgoods/setData', obj).then((res) => {
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条商品信息吗`,
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
        this.$store.dispatch('jfgoods/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条商品'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnButton () {
      this.stateType = ''
      this.searchQuery = ''
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
