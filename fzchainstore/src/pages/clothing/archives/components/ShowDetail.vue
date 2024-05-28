<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      class="q-pa-sm fit"
      :style="{
        width: this.$q.screen.width * 0.9 + 'px',
        'min-width': this.$q.screen.width * 0.9 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs ">
          <div class="row justify-center">
            <h6 class="no-margin">商品明细档案</h6>
            <q-space />
            <q-btn unelevated flat round dense icon="close" v-close-popup />
          </div>
        </div>

        <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="tableData"
            :rowDragManaged="true"
            :gridOptions="gridOptions"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :components="components"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="50"
            :context="context"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :localeText="localeText"
          >
          </ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pa-md q-pb-xl">
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ShowDetail',
  components: {},
  data () {
    return {
      gridOptions: {},
      isSidebarActiveLocal: true,
      chooseInvoiceVisible: false,
      dataForm: {
        goo_sort: '1',
        ca_article_code: '',
        ca_supplier_article_code: '',
        goo_pinYin: '',
        goo_nick: '',
        goo_name: '',
        goodsTypeId: '',
        goodsUnit_id: '',
        ca_supplier_id: '',
        goo_status: '1',
        goo_price: '',
        goo_description: '',
        goo_content: '',
        goo_cover_image: '',
        goo_loop_image: [],
        goo_note: '',
      }, // 基础设置数据
      archives: {
        ca_priority_id: '',
        ca_fabric_id: '',
        ca_safetytype_id: '',
        ca_brand_id: '',
        ca_years_id: '',
        ca_season_id: '',
        ca_band_id: '',
        ca_series_id: '',
        ca_style_id: '',
        ca_standard_id: '',
        ca_depot_id: '',
        ca_location_id: '',
        ca_shelf_id: '',
        ca_clothing_location: '',
        ca_markup_id: '',
        ca_group_id: '',
        ca_format_id: ''
      },
      context: null,
      components: {},
      tableData: [],
      columnDefs: [
        {
          headerName: '尺寸',
          field: 'cad_size_name',
          width: 300
        },
        {
          headerName: '颜色',
          field: 'cad_color_name',
          width: 300
        },
        {
          headerName: '条码',
          field: 'cad_skc_code',
          width: 300
        },
        {
          headerName: '售价',
          field: 'cad_price',
          width: 300
        },
        {
          headerName: '唯一码',
          field: 'cad_only_code',
          width: 300
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      showGoodsList: false,
      localeText: this.$ag_grid_localeText
    }
  },

  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getItem (val) {
      this.isSidebarActiveLocal = true
      // const obj = {
      //   id: val
      // }
      this.$store
        .dispatch('clothingArchives/getItemData', val)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data.goodsItem
            this.dataForm.id = this.goodsId
            if (res.data.newSpeListArray) {
              this.tableData = res.data.newSpeListArray
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
