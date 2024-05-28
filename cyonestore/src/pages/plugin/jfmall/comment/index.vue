<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <div class="q-gutter-x-xs row">
          <div class="col-12 col-md-2">
            <q-select
              outlined
              v-model="status"
              :options="[
                { label: '显示', value: '1' },
                { label: '隐藏', value: '2' },
              ]"
              dense
              label="显示或隐藏"
              emit-value
              map-options
              option-value="value"
              option-label="label"
            />
          </div>
          <q-btn color="primary" unelevated label="搜索" @click="getList" />
          <q-btn unelevated color="warning" label="重置" @click="cleanCondition" />
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="messageListData"
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
import Operator from './components/AgOperator'
import PictureItem from './components/AgPictureItem'
import AgIcon from './components/AgIcon'

export default {
  name: 'jfmallBrowseList',
  components: {
    Operator,
    PictureItem,
    AgIcon
  },
  data () {
    return {
      context: null,
      gridOptions: {},
      messageListData: [],
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
          headerName: '会员昵称',
          field: 'gc_nickname',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员头像',
          field: 'gc_cover_image',
          cellRendererFramework: 'PictureItem',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '评价描述',
          field: 'gc_description',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '评价星级',
          field: 'gc_comment_star_level',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgIcon'
        },
        {
          headerName: '评价一',
          field: 'gc_one_star_level',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgIcon'
        },
        {
          headerName: '评价二',
          field: 'gc_two_star_level',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgIcon'
        },
        {
          headerName: '评价三',
          field: 'gc_three_star_level',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgIcon'
        },
        {
          headerName: '商家回复',
          field: 'gc_store_reply',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '最新更新时间',
          field: 'updated_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.1) + 'px',
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
      dataListSelections: [],
      status: ''
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
      this.isPoppupStatus = false
      const obj = {
        status: this.status,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('jfComment/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.messageListData = res.data.list
            } else {
              this.page.totalCount = 0
              this.messageListData = []
            }
          }
        })
        .catch((error) => {})
    },
    cleanCondition () {
      this.status = ''
      this.$nextTick(() => {
        this.getList()
      })
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
        // params.api.sizeColumnsToFit()
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
