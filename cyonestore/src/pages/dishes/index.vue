<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="dishesData.queryText" label="请输入名称|简称|编码|助记码"  />
        </div>
        <div class="col-12 col-md-2">
           <q-select
          outlined
          dense
          v-model="dishesData.fl_type_id"
          :options="dishesTypeList"
          label="请选择分类"
          option-value="id"
          option-label="gt_name"
          emit-value
          map-options
        />
        </div>

        <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
        <q-btn unelevated color="warning" dense label="重置" @click="clearBtn" class="q-px-md" />

        <q-btn @click="openCloudGoodsDialog" color="primary" unelevated >云商品库</q-btn>
        <q-btn
          unelevated
          color="red"
          dense
          label="批量删除"
          :disable="selectedDishes.length > 0 ? false : true"
          @click="delAllDishes"
          class="q-px-md"
        />
  <hl-cloud-goods-table ref="cloudGoodsDialogRef" v-if="cloudGoodsTableStatus" @closeDialog="closeCloudGoodsdDialog" ></hl-cloud-goods-table>

        <q-btn unelevated color="primary" dense label="新增" :to="{ name: 'addDishes' }" class="q-px-md" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="dishesListData"
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
import AgStatus from './components/AgStatus'
import AgOperate from './components/AgOperate'

export default {
  name: 'dishes',
  components: {
    AgStatus,
    AgOperate
  },
  data () {
    return {
      typePoppupStatus: false,
      dishesData: {
        queryText: '',
        fl_type_id: ''
      },
      context: '',
      selectedDishes: [],
      dishesListData: [],
      dishesTypeList: [],
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
          headerName: '排序',
          field: 'goo_sort',
          width: this.nowpx(0.05) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '名称',
          field: 'goo_name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '分类',
          field: 'goodsType.gt_name',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '当前状态',
          field: 'goo_status',
          width: this.nowpx(0.06) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          width: this.nowpx(0.0725) + 'px'
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '属性',
          field: 'goo_goodsOrService',
          width: this.nowpx(0.08) + 'px',
          valueGetter (p) {
            if (parseInt(p.data.goo_goodsOrService) == 1) {
              return '启用库存'
            } else if (parseInt(p.data.goo_goodsOrService) == 2) {
              return '关闭库存'
            } else if (parseInt(p.data.goo_goodsOrService) == 3) {
              return '启用套餐'
            } else {
              return ''
            }
          }
        },
        {
          headerName: '编码',
          field: 'goo_code',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.085) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      cloudGoodsTableStatus: false
    }
  },
  created () {
    this.getDishesTypeList()
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    openCloudGoodsDialog () {
      this.cloudGoodsTableStatus = true
      this.$nextTick(() => {
        this.$refs.cloudGoodsDialogRef.init()
      })
    },
    closeCloudGoodsdDialog () {
      this.cloudGoodsTableStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },
    getDishesTypeList () {
      this.$store
        .dispatch('dishes/getTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.dishesTypeList = res.data ? res.data : []
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
        queryText: this.dishesData.queryText,
        type: this.dishesData.fl_type_id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('dishes/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.dishesListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    delAllDishes () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个菜品吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedDishes = this.gridOptions.api.getSelectedRows()
          if (selectedDishes.length > 0) {
            const params = selectedDishes.map((item) => {
              return item.id
            })
            this.$store.dispatch('dishes/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个菜品！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedDishes = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 280
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.dishesData.queryText = ''
      this.dishesData.fl_type_id = ''
      this.getList()
    },

    hideTypePoppup () {
      this.typePoppupStatus = false
      this.getDishesTypeList()
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
      this.selectedDishes = p.api.getSelectedRows()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 修改排序的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.fl_sort)) {
        data.fl_sort = 1
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
          .dispatch('dishes/setData', data)
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
