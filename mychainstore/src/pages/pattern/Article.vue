<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <pattern-add-article ref="addArticleRef" v-if="addPoppupStatus" @dataList="hideArticlePoppup" />
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2  row q-gutter-xs">
      <div class="col-12 col-md-2">
        <q-input outlined dense v-model="articleData.ppa_title" label="请输入标题" />
      </div>

      <div class="col-2">
        <q-select
          v-model="articleData.typeId"
          :options="typeList"
          option-label="ppt_name"
          option-value="id"
          map-options
          emit-value
          dense
          outlined
           label="分类"
        />
      </div>

      <div class="col-2">
        <q-select
          v-model="articleData.rewardUserId"
          :options="userData"
          option-label="pru_name"
          option-value="id"
          map-options
          emit-value
          dense
          outlined
          label="发布员工"
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
      <q-btn unelevated color="primary" dense label="新增" @click="showAddArticle" class="q-px-md" />
      <q-btn unelevated color="red" dense label="批量删除" :disable="selectedArticle.length > 0 ? false : true" @click="delAll" class="q-px-md" />
    </div>
    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="articleList"
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
import AgOperate from './components/AgOperate'
import PatternAddArticle from './AddArticle'
import AgTag from './components/AgTag'
import Mode from './components/AgMode'
export default {
  name: 'patternArticle',
  components: {
    AgOperate,
    PatternAddArticle,
    AgTag,
    Mode
  },
  data () {
    return {
      addPoppupStatus: false,
      articleData: {
        ppa_title: '',
        typeId: '',
        rewardUserId: ''
      },
      context: '',
      selectedArticle: [],
      articleList: [],
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
          field: 'ppa_sort',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeArticleSort,
          singleClickEdit: true,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '发布员工',
          field: 'user.pru_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '标题',
          field: 'ppa_title',
          width: this.nowpx(0.3) + 'px'
        },

        {
          headerName: '分类',
          width: this.nowpx(0.15) + 'px',
          field: 'type.ppt_name'
        },
        {
          headerName: '标签',
          field: 'mcl_default',
          cellRendererFramework: 'AgTag',
          width: this.nowpx(0.35) + 'px'
        },
        {
          headerName: '发布时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '是否推荐',
          field: 'ppa_property',
          cellRendererFramework: 'Mode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      sortTypeData: [
        {
          label: '推荐',
          value: 'top'
        },
        {
          label: '热门',
          value: 'hot'
        },
        {
          label: '无',
          value: 'none'
        }
      ],
      sortTypeItem: {
        top: '推荐',
        hot: '热门',
        none: '无'
      },
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.getTagList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {
    this.getList()
  },
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
    getTagList () {
      this.$store
        .dispatch('pattern/getTagList')
        .then((res) => {
          if (res.code == 200) {
            this.typeList = res.data && res.data.typeList ? res.data.typeList : []

            this.userData = res.data && res.data.userData ? res.data.userData : []
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
        ...this.articleData,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        source: 'pc',
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('pattern/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.articleList = res.data ? res.data.list : []
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 篇文章吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedArticle = this.gridOptions.api.getSelectedRows()
          if (selectedArticle.length > 0) {
            const params = selectedArticle.map((item) => {
              return item.id
            })
            this.$store.dispatch('pattern/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 篇文章！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedArticle = []
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
      this.articleData = {
        ppa_title: '',
        typeId: '',
        rewardUserId: ''
      }
      this.selectStoreData = []
      this.getList()
    },
    showAddArticle (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addArticleRef.init(id)
      })
    },
    hideArticlePoppup () {
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
      this.selectedArticle = p.api.getSelectedRows()
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
    changeArticleSort (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      data.ppa_sort = data.ppa_sort.replace(/\s+/g, '')
      if (!data.ppa_sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.ppa_sort)) {
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
          ppa_sort: data.ppa_sort,
          id: data.id
        }
        this.$store.dispatch('pattern/setData', obj).then((res) => {
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
