<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row ">
          <q-input class="col-12 col-md-3 q-mt-sm " clearable label="充次套餐名称" outlined v-model="secondaryCardForm.goodsTypeTitle" dense />
          <q-select
            class="col-12 col-md-2 q-mt-sm"
            outlined
            v-model="secondaryCardForm.goodsTypeVal"
            option-value="id"
            option-label="title"
            :options="state"
            dense
            label="状态"
            emit-value
            map-options
            clearable
          />
          <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索"  @click="getList" />
          <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="cleanSearchInput" />
          <q-btn color="primary" class=" q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增充次套餐" :to="{ name: 'addGoodsCount' }" />
          <q-btn
            color="red"
            class=" q-mt-sm"
            unelevated
            label="批量删除"
            v-if="authorityMeta('delAll')"
            :disable="selected.length > 0 ? false : true"
            @click="delAll"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :suppressMovableColumns="true"
          :rowData="dataList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          rowHeight="50"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :gridOptions="gridOptions"
          :localeText="localeText"
          @rowSelected="rowSelectedAg"
          @first-data-rendered="onFirstDataRendered"
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
import AgOperating from './components/AgOperating'
import AgMode from './components/AgMode'
export default {
  components: {
    AgOperating,
    AgMode
  },
  name: 'goodsCount',
  data () {
    return {
      components: {
        AgOperating,
        AgMode
      },
      context: null,
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      secondaryCardForm: {
        goodsTypeVal: '',
        goodsTypeTitle: ''
      },
      gridOptions: {},
      state: [
        {
          id: 1,
          title: '上架'
        },
        {
          id: 2,
          title: '下架'
        }
      ],
      dataList: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          checkboxSelection: true,
          width: this.nowpx(0.045) + 'px'
        },
        {
          headerName: '套餐名称',
          field: 'grp_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '充次到期时间',
          field: 'grp_property',
          valueGetter: this.endTimeFormat,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '总价格',
          field: 'grp_packagePrice',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          field: 'grp_status',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgMode'
        },
        {
          headerName: '更新时间',
          field: 'updated_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          field: 'id',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'AgOperating'
        }
      ],
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
    }
  },
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  methods: {
    cleanSearchInput () {
      this.secondaryCardForm.goodsTypeVal = ''
      this.secondaryCardForm.goodsTypeTitle = ''
      this.getList()
    },
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
    },
    getList () {
      const obj = {
        text: this.secondaryCardForm.goodsTypeTitle,
        mode: this.secondaryCardForm.goodsTypeVal,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('goodscount/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
            } else {
              this.page.totalCount = 0
            }
            this.dataList = res.data.list
          }
        })
        .catch((error) => {})
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条充次套餐吗`,
          cancel: true
        })
        .onOk(() => {
          const selected = this.gridOptions.api.getSelectedRows()
          if (selected.length > 0) {
            const obj = selected.map((item) => {
              return item.id
            })
            this.$store.dispatch('goodscount/delAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条充次套餐！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selected = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
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
    endTimeFormat (p) {
      const timeOptions = this.$store.state.goodscount.timeOptions
      switch (parseInt(p.data.grp_timeType)) {
        case 1:
          return '永久有效'
          break
        case 2:
          const time_index = _.findIndex(timeOptions, function (o) {
            return parseInt(o.value) == parseInt(p.data.grp_endTime)
          })

          return '购买后' + p.data.grp_startTime + timeOptions[time_index].label + '内有效'
          break
        case 3:
          return (
            this.$q_date.formatDate(p.data.grp_startTime * 1000, 'YYYY-MM-DD  HH:mm:ss') +
            '--' +
            this.$q_date.formatDate(p.data.grp_endTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
          )

          break

        default:
          return '参数错误'
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
