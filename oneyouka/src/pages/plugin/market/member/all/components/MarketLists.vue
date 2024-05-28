<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="listsRef">
        <q-card-section class="row items-center q-pa-none q-mb-xl">
          <div class="text-h6">分佣商列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="row q-gutter-xs q-mb-md">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" class="col-12 col-md-3" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="grey" dense label="重置" @click="clearButton" class="q-px-md" />
        </div>
        <div style="height: 536px">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="marketListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
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
        <div>
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
        <div class="text-center q-gutter-sm q-mt-lg">
          <q-btn unelevated color="grey" label="取消" v-close-popup />
          <q-btn unelevated color="primary" :disable="addButtonDisabled" label="确定" @click="saveButton" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import MarketListsAgOperate from './MarketListsAgOperate'
export default {
  name: 'MarketLists',
  components: { MarketListsAgOperate },
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      memberInfo: '',
      marketId: '',
      parentMarketId: '',
      selectedParentMarketData: {},
      context: null,
      gridOptions: {},
      marketListData: [],
      columnDefs: [
        {
          headerName: '会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.25) + 'px'
        },

        {
          headerName: '分佣商等级',
          field: 'level.pml_name',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.25) + 'px',
          cellRendererFramework: 'MarketListsAgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList (id, parentMarketId) {
      if (id > 0 && id) {
        this.marketId = id
      }
      if (parentMarketId || parentMarketId == 0) {
        this.parentMarketId = parentMarketId
      }
      const params = {
        memberInfo: this.memberInfo,
        marketMemberStatus: 1,
        marketId: this.marketId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('market/getMemberData', params)
        .then((res) => {
          if (res.code == 200) {
            this.marketListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
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
      this.getList(this.marketId)
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearButton () {
      this.memberInfo = ''
      this.getList()
    },
    saveButton () {
      this.addButtonDisabled = true
      const params = {
        marketId: this.marketId,
        ...this.selectedParentMarketData
      }
      this.$store
        .dispatch('market/updateParentMarketData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '更改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.$emit('dataList')
          } else {
            this.$q.notify({
              message: '更改失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
          this.addButtonDisabled = false
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
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
