<template>
  <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.2+ 'px',
        'min-width': this.$q.screen.width * 0.2 + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="text-h6">选择油品</div>
        </div>

        <div class="col-shrink q-px-xs full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham w-100 ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="oilListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :context="context"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            rowSelection="multiple"
            :localeText="localeText"
            :suppressCellSelection="true"
             :rowMultiSelectWithClick="true"
            :suppressRowClickSelection="false"
          ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-pt-sm">

          <q-btn unelevated label="提交" @click="saveBut()" color="primary" class="q-px-xl" />
          <q-btn unelevated label="关闭" type="reset" v-close-popup color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddAg',
  components: {},
  data () {
    return {
      localeText: this.$ag_grid_localeText,

      isSidebarActiveLocal: true,
      context: '',

      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 10
        },
        {
          headerName: '油品名称',
          field: 'op_name'
        }

      ],
      oilListData: []
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.$store
        .dispatch('product/getCurrentAllOil')
        .then((res) => {
          if (res.code == 200) {
            this.oilListData = res.data ? res.data : []
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
      let nowWidth = this.$q.screen.width - 550
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
    hideNowPage () {
      this.$emit('dataList')
    },
    saveBut () {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      this.$emit('getRecord', selectedRows)
    }
  }
}
</script>
