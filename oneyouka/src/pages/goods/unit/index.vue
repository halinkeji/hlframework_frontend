<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row ">
          <q-input class=" col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchName" label="计量单位名称" dense />
          <q-select
            class=" col-12 col-md-2 q-mt-sm"
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="goodsType"
            :options="options"
            dense
            label="属性"
            clearable
          />
          <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索"  @click="getGoodsUnitList" />
          <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="clean"  />
          <q-btn color="primary" class=" q-mt-sm" unelevated label="新增" v-if="authorityMeta('add')" @click="addPopup" />
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

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="goodsUnitData"
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

    <add-unit @getMethods="getGoodsUnitList" ref="addRef" v-if="adddUnitShow"></add-unit>
  </q-page>
</template>

<script>
import AgTypeBg from './components/AgTypeBg.vue'
import AgMeasureOperate from './components/AgMeasureOperate.vue'
import AddUnit from './components/AddUnit.vue'
export default {
  name: 'PageIndex',
  components: {
    AgMeasureOperate,
    AgTypeBg,
    AddUnit
  },
  data () {
    return {
      searchName: '',
      adddUnitShow: false,
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
      gridOptions: {},
      components: {
        AddUnit,
        AgMeasureOperate,
        AgTypeBg
      },
      context: null,
      gu_sort: 0,
      goodsUnitData: [],
      dataListSelections: {},
      columnDefs: [
        {
          filter: false, // 是否过滤
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '排序',
          field: 'gu_sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '单位属性',
          field: 'gu_goodsOrService',
          filter: false,
          cellRendererFramework: 'AgTypeBg',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '单位类型',
          field: 'gu_goodsOrService',
          filter: false,
          valueGetter: (p) => {
            if (parseInt(p.data.gu_is_many) == 1) {
              return '多单位'
            } else {
              return '基础单位'
            }
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '单位名称（大）',
          field: 'gu_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '单位名称（小）',
          field: 'smallUnit.gu_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '换算比例',
          field: 'gu_convert_proportion',
          filter: false,
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return parseInt(p.data.gu_is_many) == 1 ? '1' + p.data.gu_name + ' = ' + p.data.gu_convert_proportion + p.data.smallUnit.gu_name : ''
          }
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
          cellRendererFramework: 'AgMeasureOperate',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      goodsType: ''
    }
  },

  mounted () {},
  created () {
    this.getGoodsUnitList()
    this.context = this
  },
  computed: {},
  methods: {
    // 新增 编辑
    addPopup (id) {
      this.adddUnitShow = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getGoodsUnitList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getGoodsUnitList()
    },

    // 获取列表,搜索
    getGoodsUnitList () {
      this.adddUnitShow = false
      const obj = {
        text: this.searchName,
        type: this.goodsType,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('goodsunit/getGoodsUnitList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0

            this.goodsUnitData = res.data.list
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
    // 排序并加限制
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.gu_sort = data.gu_sort.replace(/\s+/g, '')
      if (!data.gu_sort) {
        this.getGoodsUnitList()
        return ''
      }
      if (!regu.test(data.gu_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getGoodsUnitList()
      } else {
        const obj = {
          gu_sort: data.gu_sort,
          id: data.id
        }
        this.$store.dispatch('goodsunit/addData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改排序成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getGoodsUnitList()
          }
        })
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
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
        this.$store.dispatch('goodsunit/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条商品标签'
            })
            this.getGoodsUnitList()
            this.dataListSelections = []
          }
        })
      }
    },
    clean () {
      this.searchName = ''
      this.goodsType = ''
      this.getGoodsUnitList()
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
