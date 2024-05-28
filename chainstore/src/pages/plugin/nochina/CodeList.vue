<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-btn @click="addCountryCode" color="primary" class=" col-12 col-md-1" unelevated label="新增" />
    </div>

    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2 q-mt-xs">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="countryCodeData"
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
        :rowMultiSelectWithClick="true"
        :stopEditingWhenGridLosesFocus="true"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" label="保存" class="q-px-xl" @click="setCodeData" />
    </div>
  </div>
</template>
<script>
import AgStatus from './AgStatus.vue'
import AgOperator from './AgOperator.vue'
import AgDefault from './AgDefault.vue'
export default {
  name: 'countryCode',
  components: {
    AgDefault,
    AgOperator,
    AgStatus
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {
        AgDefault,
        AgOperator,
        AgStatus
      },
      gridOptions: {},
      countryCodeData: [],

      columnDefs: [
        {
          headerName: ' 国家名称',
          field: 'ncc_name',
          width: this.nowpx(0.2) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeValue
        },
        {
          headerName: '国家编码',
          field: 'ncc_code',
          width: this.nowpx(0.15) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeValue
        },
        {
          headerName: '排序',
          field: 'ncc_sort',
          width: this.nowpx(0.15) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeValue
        },
        {
          headerName: '是否默认',
          field: 'ncc_is_default',
          cellRendererFramework: 'AgDefault',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '状态',
          field: 'ncc_status',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      stop: false,
      dataListSelections: {}
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

      this.$store
        .dispatch('nochina/getCodeList', {})
        .then((res) => {
          if (res.code == 200) {
            this.countryCodeData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    setCodeData () {
      this.$store
        .dispatch('nochina/setCodeData', {
          countryCodeData: this.countryCodeData
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '保存成功',
              color: 'green'
            })
            this.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
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

    addCountryCode () {
      this.countryCodeData.push({
        ncc_name: '',
        ncc_code: '',
        ncc_sort: this.countryCodeData.length + 1,
        ncc_is_default: '0',
        ncc_status: '1'
      })
    },

    deleteCountryInfo (key) {
      if (this.countryCodeData[key]) {
        this.countryCodeData.splice(key, 1)
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
