<template>
  <q-dialog v-model="dialogShow" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.8) + 'px',
        'max-width': parseInt($q.screen.width * 0.8) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pa-sm">
          <div class="text-subtitle1">会员地址</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="colseDialog" />
        </div>
        <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs items-center">
          <div class="col-3">
            <q-input label="可搜索:收件人/手机号/地址/详细地址" outlined v-model="searchText" dense />
          </div>

          <q-btn color="primary"  unelevated label="搜索" @click="getList" />
          <q-btn color="grey"  unelevated label="重置" @click="clearBut" />
          <q-space />
          <q-btn color="primary"  unelevated label="新增" @click="editMemberAddress(memberId, 0)" />
        </div>

        <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :gridOptions="gridOptions"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="addressData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="60"
            :context="context"
            @rowSelected="rowSelectedAg"
            :suppressRowClickSelection="true"
            :singleClickEdit="true"
            :stopEditingWhenGridLosesFocus="true"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
    <modify-address @colseDialog="colseDialogOperating" v-if="modifyAddressDialogStatus" ref="modifyAddressRef" />
  </q-dialog>
</template>
<script>
import AgMake from './AgMake.vue'
import ModifyAddress from './ModifyAddress'
export default {
  components: { AgMake, ModifyAddress },
  data () {
    return {
      dialogShow: false,
      search: '',
      addressData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '收件人',
          field: 'ma_name',
          filter: false,
          width: 150,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: false
        },
        {
          headerName: '手机号',
          field: 'ma_telephone',
          filter: false,
          width: 150
        },
        {
          headerName: '地址',
          filter: false,
          valueGetter: this.display
        },
        {
          headerName: '详细地址',
          field: 'ma_address',
          filter: false
        },
        {
          headerName: '是否默认地址',
          field: 'ma_is_default',
          filter: false,
          valueGetter: (p) => {
            if (p.data.ma_is_default == 1) {
              return '是'
            } else {
              return '否'
            }
          }
        },
        {
          headerName: '操作',
          field: 'make',
          filter: false,
          cellRendererFramework: 'AgMake',
          width: 150
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,

      memberId: '',
      modifyAddressDialogStatus: false,
      currentAddressId: '',
      searchText: ''
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    colseDialogOperating () {
      this.modifyAddressDialogStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },
    colseDialog () {
      this.$emit('colseDialog')
    },

    init (memberId) {
      this.dialogShow = true

      this.context = this
      if (memberId > 0) {
        this.memberId = memberId
        this.getList()
      }
    },

    editMemberAddress (memberId, addressId) {
      this.modifyAddressDialogStatus = true
      this.$nextTick(() => {
        this.$refs.modifyAddressRef.init(memberId, addressId)
      })
    },

    getList () {
      const obj = {
        memberId: this.memberId,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        searchText: this.searchText
      }
      this.$store
        .dispatch('memberAddress/getAddressList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.addressData = res.data ? res.data.list : []
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
    display (p) {
      const data = p.data
      const province = data.province ? data.province : '--'
      const city = data.city ? data.city : '--'
      const district = data.district ? data.district : '--'
      return province + city + district
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
        params.api.sizeColumnsToFit()
      }
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearBut () {
      this.searchText = ''
      this.$nextTick(() => {
        this.getList()
      })
    }
  }
}
</script>
