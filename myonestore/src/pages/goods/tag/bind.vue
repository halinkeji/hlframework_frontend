<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row ">
          <q-input class=" col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchValue" label="商品名称" dense />

          <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getList" />
          <q-btn color="warning" class=" q-mt-sm" unelevated @click="searchValue = '';getList() " label="重置" />
          <q-btn color="primary" class=" q-mt-sm" unelevated label="绑定商品" @click="bindGoodsTag" />
          <q-btn color="red" class="q-mt-sm" @click="delAll" :disable="!(dataListSelections && dataListSelections.length > 0)" label="批量解绑" unelevated v-if="authorityMeta('delAll')" />

          <q-btn color="grey" class=" q-mt-sm" unelevated label="返回" :to="{name:'goodsTag'}" />
        </div>
      </div>
      <hl-goods-table ref="specificationTree" rowSelection="multiple" v-if="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData" @closeDialog="showGoodsList = false"></hl-goods-table>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table   hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsListData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :rowMultiSelectWithClick="true"
          rowHeight="50"
          :context="context"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'zzfwfGoods',
  components: {},
  data () {
    return {
      editPoppupStatus: false,
      memberInfo: '',
      sonMemberInfo: '',
      context: '',
      linkList: [],
      gridOptions: {},
      localeText: this.$ag_grid_localeText,
      components: {},
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 60
        },
        {
          headerName: '商品名称', // 列标题
          field: 'goo_name', // 列与数据源对应的字段
          width: 400
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          width: 237
        },

        {
          headerName: '简称',
          field: 'goo_nick',
          width: 237
        },

        {
          headerName: '是否称重',
          field: 'goo_goodsOrService',
          width: 120,
          valueGetter: (p) => {
            if (parseInt(p.data.goo_is_weigh) == 1) {
              return '开启'
            } else {
              return '关闭'
            }
          }
        },
        {
          headerName: '条码',
          field: 'goo_code',
          width: 237
        },
        {
          headerName: '入库价',
          field: 'goo_purchasePrice',
          width: 150
        },
        {
          headerName: '标价',
          field: 'goo_listPrice',
          width: 150
        },
        {
          headerName: '售价',
          field: 'goo_price',
          width: 150
        },
        {
          headerName: '状态',
          field: 'goo_status',
          pinned: 'right',
          width: 100,
          valueGetter: function (p) {
            return p.data.goo_status == 1 ? '上架' : '下架'
          }
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
      goodsListData: [],
      goodsTypeId: '',
      goodsOrService: '1',
      serviceOptions: [
        {
          label: '实物商品',
          value: 1
        },
        {
          label: '服务商品',
          value: 2
        }
      ],
      goodsTypeData: [],
      searchValue: '',
      linkTypeOptions: [
        {
          label: '折扣',
          value: 'discount'
        },
        {
          label: '固定',
          value: 'fixed'
        },
        {
          label: '关闭',
          value: 'close'
        }
      ],
      zzfwfForm: {
        zrg_link_type: 'close',
        zrg_discount_proportion: '0',
        zrg_fixed_amount: '0'
      },
      goodsTagId: 0,
      showGoodsList: false,
      dataListSelections: []
    }
  },
  created () {
    this.goodsTagId = this.$route.query.id
    // this.getGoodsType()
    this.context = this
  },
  mounted () {
    if (this.goodsTagId) {
      this.getList()
    }
  },
  computed: {},
  methods: {
    // 获取商品分类
    getGoodsType () {
      const obj = {
        goodsType: [1, 2]
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsTypeData = res.data ? res.data : []
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
    getList () {
      this.dataListSelections = []
      const obj = {
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        goodsTypeId: this.goodsTypeId,
        goodsTagId: this.goodsTagId,
        searchValue: this.searchValue
      }
      this.$store
        .dispatch('goodsTag/getBindListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0

            this.goodsListData = res.data.list
          }
        })
        .catch((error) => {})
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    emptySeacher () {
      this.searchValue = ''
      this.goodsTypeId = ''

      this.$refs.selectTreeRef.resetValueData()
      this.getList()
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
      this.dataListSelections = p.api.getSelectedRows()
    },
    bindGoodsTag () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1, 2, 3])
        }, 500)
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
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = false
      if (data && data.length > 0) {
        this.$store
          .dispatch('goodsTag/setBindData', {
            bindGoodsData: data,
            gtb_tag_id: this.goodsTagId
          })
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功绑定' + (res.data ? res.data : 0) + '条商品',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '添加成功'
              })
              this.$nextTick(() => {
                this.getList()
              })
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
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
    },

    delAll () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.tabBindId
        })
        this.$q
          .dialog({
            type: 'confirm',
            color: 'primary',
            title: '是否解绑',
            message: `确定解绑 ${this.dataListSelections.length} 条商品吗？`,
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            this.deleteRecordBatch(obj)
          })
      }
    },
    deleteRecordBatch (obj) {
      this.$store.dispatch('goodsTag/delBindData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green',
            message: '成功',
            caption: '成功解绑 ' + res.data + ' 条商品'
          })
          this.getList()
          this.dataListSelections = []
        }
      })
    }
  }
}
</script>
