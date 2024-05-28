<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <pattern-add-tag ref="addTagRef" v-if="addPoppupStatus" @dataList="hideTagPoppup" />
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2  row q-gutter-xs">
      <div class="col-12 col-md-2">
        <q-input outlined dense v-model="tagData.ppt_name" label="请输入名称" />
      </div>

      <div class="col-12 col-md-2">
        <q-select
          v-model="tagData.ppt_type"
          :options="$store.state.pattern.tagTypeData"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          dense
          outlined
          label="选择属性"
        />
      </div>

      <div class="col-12 col-md-3" v-if="is_main_store">
        <q-select
          label="查询门店"
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          clearable
          use-chips
          :options="libInStoreList"
        />
      </div>

      <q-btn unelevated color="warning" dense label="搜索" class="q-px-md" @click="getList" />
      <q-btn unelevated color="grey" dense label="重置" @click="clearBtn" class="q-px-md" />
      <q-btn unelevated color="primary" dense label="新增" @click="showAddTag" class="q-px-md" />
      <q-btn unelevated color="red" dense label="批量删除" :disable="selectedTag.length > 0 ? false : true" @click="delAll" class="q-px-md" />
    </div>
    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="TagList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        @rowSelected="rowSelectedAg"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
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
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
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
</template>
<script>
import TagAgOperate from './components/TagAgOperate'
import PatternAddTag from './AddTag'
export default {
  name: 'PatternTag',
  components: {
    TagAgOperate,
    PatternAddTag
  },
  data () {
    return {
      addPoppupStatus: false,
      tagData: {
        ppt_name: '',
        ppt_type: ''
      },
      context: '',
      selectedTag: [],
      TagList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '排序',
          field: 'ppt_sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeTypeSort,
          singleClickEdit: true,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '名称',
          field: 'ppt_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '属性',
          field: 'ppt_type',
          width: this.nowpx(0.3) + 'px',
          valueGetter: this.typeText
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.35) + 'px',
          cellRendererFramework: 'TagAgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.getList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    typeText (p) {
      return this.$store.state.pattern.tagTypeItem[p.data.ppt_type]
    },

    getList () {
      const params = {
        ...this.tagData,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('pattern/getTagData', params)
        .then((res) => {
          if (res.code == 200) {
            this.TagList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个标签吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedTag = this.gridOptions.api.getSelectedRows()
          if (selectedTag.length > 0) {
            const params = selectedTag.map((item) => {
              return item.id
            })
            this.$store.dispatch('pattern/delAllTag', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个标签！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedTag = []
                this.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.tagData.ppt_name = ''
      this.tagData.ppt_type = ''
      this.selectStoreData = []
      this.getList()
    },
    showAddTag (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addTagRef.init(id)
      })
    },
    hideTagPoppup () {
      this.addPoppupStatus = false
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
      this.selectedTag = p.api.getSelectedRows()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
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
    },
    // 排序并加限制
    changeTypeSort (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.ppt_sort = data.ppt_sort.replace(/\s+/g, '')
      if (!data.ppt_sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.ppt_sort)) {
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
          ppt_sort: data.ppt_sort,
          id: data.id
        }
        this.$store.dispatch('pattern/setTagData', obj).then((res) => {
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
    }
  }
}
</script>
