<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
      class="fit q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll" >
        <div class="col-shrink bg-white q-pb-md  q-px-sm">
          <div class="q-pa-sm row">
            <div class="text-h6">权益列表</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <div class="row q-gutter-xs">
            <q-input outlined dense v-model="packageName" label="请输入权益名称" class="col-12 col-md-2" />
            <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
            <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
         </div>
        </div>

      <div class="col-shrink q-pa-sm full-height bg-white ">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="packageList"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
            @rowSelected="rowSelectedAg"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="50"
            :context="context"
            :localeText="localeText"
            rowSelection="multiple"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :suppressRowTransform="true"
            ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-pb-md row q-gutter-sm q-px-sm" >
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
          <q-space />
          <q-btn unelevated color="primary" class="q-px-xl" :disable="addButtonDisabled" label="添加" @click="saveButton" />
        </div>

      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'SelectMarketPackage',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      packageName: '',
      context: null,
      gridOptions: {},
      selectedPackage: [],
      packageList: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '权益名称',
          field: 'pmp_name',
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '佣金比例',
          valueGetter: (p) => {
            return p.data.pmp_market_proportion + '%'
          },
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '佣金',
          field: 'pmp_market_amount',
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'pmp_give_balance',
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'pmp_give_integral',
          width: this.nowpx(0.19) + 'px'
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
      const params = {
        packageName: this.packageName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('market/getPackageListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageList = res.data ? res.data.list : []
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
      let nowWidth = this.$q.screen.width - 484
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
    clearButton () {
      this.packageName = ''
      this.getList()
    },
    rowSelectedAg (p) {
      this.selectedPackage = p.api.getSelectedRows()
    },
    saveButton () {
      this.addButtonDisabled = true
      this.$emit('dataList', this.selectedPackage)
    },
    hideNowPage () {
      this.$emit('dataList', [])
    }
  }
}
</script>
