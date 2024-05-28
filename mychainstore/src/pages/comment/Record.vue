<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="row q-gutter-x-sm">
        <div class="col-12 col-md-2">
          <q-input clearable label="请输入评价内容" outlined v-model="searchQuery" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            label="员工"
            v-model="staffId"
            option-value="id"
            option-label="pru_name"
            emit-value
            map-options
            dense
            outlined
            :options="staffListData"
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

        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
      </div>
    </div>

    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="commentRecordList"
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
</template>
<script>
import AgMode from './components/AgMode'
import AgScore from './components/AgScore'
import AgStar from './components/AgStar'
import AgReply from './components/AgReply'
export default {
  name: 'commentRecord',
  components: {
    AgMode,
    AgScore,
    AgStar,
    AgReply
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {
        AgMode
      },
      gridOptions: {},
      commentRecordList: [],

      columnDefs: [],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      storeNewsData: {
        sn_title: '',
        sn_content: '',
        sn_picture: '',
        sn_status: 1
      },
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      staffListData: [],
      staffId: '',
      selectStoreData: [],
      libInStoreList: []
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.getConfigItem()
    this.getStaffList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getStaffList () {
      this.$store
        .dispatch('rewardPosition/getAllStaff', { consumeType: 'all' })
        .then((res) => {
          if (res.code == 200) {
            this.staffListData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    getConfigItem () {
      this.addButtonDisabled = false
      this.$store
        .dispatch('comment/getItemData')
        .then((res) => {
          if (res.code == 200) {
            const serveStarData = res.data && res.data && res.data.mcc_serve_star ? res.data.mcc_serve_star : []

            const columnData = [
              // {
              //   headerName: '',
              //   field: '',
              //   headerCheckboxSelectionFilteredOnly: true,
              //   headerCheckboxSelection: true,
              //   checkboxSelection: true,
              //   width: this.nowpx(0.02) + 'px'
              // },
              {
                headerName: '员工',
                field: 'staff.pru_name',
                width: this.nowpx(0.1) + 'px'
              },
              {
                headerName: '评价内容',
                field: 'mrc_content',
                width: this.nowpx(0.3) + 'px'
              },
              {
                headerName: '会员昵称',
                field: 'mrc_member_name',
                width: this.nowpx(0.1) + 'px'
              },
              {
                headerName: '总评分',
                field: 'mrc_score',
                width: this.nowpx(0.05) + 'px',
                cellRendererFramework: 'AgStar'
              }
            ]
            if (serveStarData && serveStarData.length > 0) {
              serveStarData.forEach((item) => {
                columnData.push({
                  headerName: item.value,
                  field: item.field,
                  width: this.nowpx(0.05) + 'px',
                  cellRendererFramework: 'AgScore'
                })
              })
            }
            columnData.push({
              headerName: '评价时间',
              field: 'created_at',
              valueGetter: (p) => {
                return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
              },
              width: this.nowpx(0.08) + 'px'
            })

            columnData.push({
              headerName: '是否显示',
              field: 'mrc_status',
              cellRendererFramework: 'AgMode',
              width: this.nowpx(0.08) + 'px'
            })

            columnData.push({
              headerName: '商家回复',
              field: 'mrc_comment_reply',
              width: this.nowpx(0.1) + 'px'
            })

            columnData.push({
              headerName: '操作',
              field: 'id',
              pinned: 'right',
              cellRendererFramework: 'AgReply',
              width: this.nowpx(0.08) + 'px'
            })
            this.columnDefs = columnData
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        staffId: this.staffId,
        source: 'manage',
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('comment/getCommentList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.commentRecordList = res.data.list
            } else {
              this.page.totalCount = 0
              this.commentRecordList = []
            }
          }
        })
        .catch((error) => {})
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

    clearnBut () {
      this.searchQuery = ''
      this.staffId = ''
      this.selectStoreData = []
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
      // const nowWidth = this.$q.screen.width
      // if (nowWidth > this.$q.screen.sizes.md) {
      params.api.sizeColumnsToFit()
      // }
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
