<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <add-type ref="typeRef" v-if="addTypePoppupStatus" @dataList="getList()" />

      <div class="col-shrink bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-sm">
        <q-input outlined dense v-model="typeData.gt_name" label="请输入分类名称" class="col-12 col-md-2" />
        <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBtn" class="q-px-md" />
        <q-btn unelevated color="primary" dense label="新增" @click="showAddType" class="q-px-md" />
        <q-btn
          unelevated
          color="red"
          dense
          label="批量删除"
          :disable="selectedDishesType.length > 0 ? false : true"
          @click="delAll"
          class="q-px-md"
        />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="typeListData"
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
import AddType from './AddType'
import TypeAgOperate from './TypeAgOperate'
export default {
  name: 'DishesType',
  components: {
    AddType,
    TypeAgOperate
  },
  data () {
    return {
      showDialog: true,
      addTypePoppupStatus: false,
      typeData: {
        gt_name: ''
      },
      context: null,
      gridOptions: {},
      selectedDishesType: [],
      typeListData: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '排序',
          field: 'gt_sort',
          width: this.nowpx(0.35) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '分类名称',
          field: 'gt_name',
          width: this.nowpx(0.35) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.25) + 'px',
          cellRendererFramework: 'TypeAgOperate'
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
      this.addTypePoppupStatus = false
      const params = {
        typeName: this.typeData.gt_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('dishes/getTypeData', params)
        .then((res) => {
          if (res.code == 200) {
            this.typeListData = res.data ? res.data.list : []
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个菜品分类吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedDishesType = this.gridOptions.api.getSelectedRows()
          if (selectedDishesType.length > 0) {
            const params = selectedDishesType.map((item) => {
              return item.id
            })
            this.$store.dispatch('dishes/delAllType', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个菜品分类！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedDishesType = []
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
      this.typeData.gt_name = ''
      this.getList()
    },
    showAddType (id) {
      this.addTypePoppupStatus = true
      this.$nextTick(() => {
        this.$refs.typeRef.init(id)
      })
    },
    rowSelectedAg (p) {
      this.selectedDishesType = p.api.getSelectedRows()
    },
    // 修改排序的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.gt_sort)) {
        data.gt_sort = 1
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
          .dispatch('dishes/setTypeData', data)
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
    },
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
