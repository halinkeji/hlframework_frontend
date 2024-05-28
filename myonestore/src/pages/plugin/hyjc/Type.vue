<template>
  <div class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <q-card flat class="q-px-xs q-py-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="typeName" label="请输入分类名称" />
        </div>
        <div class="col-12 col-md-2">
          <q-select outlined dense v-model="typeStatus" :options="statusOptions" label="请选择分类状态" option-label="label" emit-value map-options />
        </div>
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
        <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
        <q-btn unelevated color="primary" dense label="新增" @click="showAddType" class="q-px-md" v-if="authorityMeta('addType')" />
        <q-btn
          unelevated
          color="red"
          :disable="selectedType.length > 0 ? false : true"
          dense
          label="批量删除"
          @click="delAllType"
          class="q-px-md"
          v-if="authorityMeta('delType')"
        />
      </q-card>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="typeData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @rowSelected="rowSelectedAg"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="60"
          :context="context"
          rowSelection="multiple"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
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
    <add-type ref="addTypeRef" v-if="addTypeStatus" @dataList="getDataList" />
  </div>
</template>
<script>
import TypeAgOperate from './components/TypeAgOperate'
import AgStatus from './components/AgStatus'
import AgImg from './components/AgImg'
import AddType from './AddType'
export default {
  name: 'hyjcType',
  components: {
    TypeAgOperate,
    AgStatus,
    AddType,
    AgImg
  },
  data () {
    return {
      addTypeStatus: false,
      typeName: '',
      typeStatus: '',
      statusOptions: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: -1
        }
      ],
      selectedType: [],
      context: null,
      gridOptions: {},
      typeData: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '分类名称',
          field: 'pht_name',
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '封面图片',
          field: 'pgt_pictureUrl',
          width: this.nowpx(0.17) + 'px',
          cellRendererFramework: 'AgImg'
        },
        {
          headerName: '状态',
          field: 'pht_status',
          width: this.nowpx(0.17) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '添加时间',
          field: 'oti_addTime',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
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
  mounted () {},
  created () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getList () {
      const obj = {
        typeName: this.typeName,
        typeStatus: this.typeStatus,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('hyjc/getTypeListData', obj)
        .then((res) => {
          this.typeData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    rowSelectedAg (p) {
      this.selectedType = p.api.getSelectedRows()
    },
    delAllType () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条寄存分类吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedType = this.gridOptions.api.getSelectedRows()
          if (selectedType.length > 0) {
            const obj = selectedType.map((item) => {
              return item.id
            })
            this.$store.dispatch('hyjc/delTypeAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条寄存分类！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedType = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.typeName = ''
      this.typeStatus = ''
      this.getList()
    },
    showAddType (id) {
      this.addTypeStatus = true
      this.$nextTick(() => {
        this.$refs.addTypeRef.init(id)
      })
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    getDataList () {
      this.addTypeStatus = false
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
