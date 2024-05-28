<template>
  <q-dialog v-model="isPopupShow" persistent @hide="hideNowPage">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.8) + 'px',
        'max-width': parseInt($q.screen.width * 0.8) + 'px',
      }"
      class="fit"
    >
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg ">
        <div class="row items-center q-pa-sm">
          <div class="text-subtitle1">会员列表</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="hideNowPage" v-close-popup />
        </div>
        <div class="row q-gutter-x-xs ">
          <q-input class="col-12 col-md-3 " label="会员卡号/昵称" outlined v-model="searchQuery" dense />

          <q-btn color="primary"  unelevated label="搜索" @click="getMemberList" />
          <q-btn color="warning" unelevated label="重置" @click="clean" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="membertagData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          rowHeight="40"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
           @gridReady="onFirstDataRendered"
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
    </q-card>
  </q-dialog>

</template>
<script>

export default {
  name: 'MembertagList',
  components: { },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      membertagData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.06) + 'px'
        }
      ],
      defaultColDef: {
        rowDragManaged: true
      },
      gridOptions: {},
      searchQuery: '',
      selectStoreData: []
    }
  },

  created () {

  },
  mounted () {
    this.getMemberList()
  },
  computed: {

  },
  methods: {
    init (id) {
      if (id > 0) {
        this.isPopupShow = true
        this.currentTagId = id
        this.$nextTick(() => {
          this.getMemberList()
        })
      }
    },
    hideNowPage () {
      this.isPopupShow = false

      this.$emit('hidePage')
    },

    clean () {
      this.searchQuery = ''

      this.getMemberList()
    },
    getMemberList () {
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        currentTagId: this.currentTagId
      }
      this.$store.dispatch('membertag/getMemberList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.membertagData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getMemberList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getMemberList()
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
    }
  }
}
</script>
