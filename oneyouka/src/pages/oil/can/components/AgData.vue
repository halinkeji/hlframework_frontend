<template>
  <div>
    <q-dialog v-model="oilCanDetailStatus" @hide="hideNowPage" persistent>
      <q-card
        :style="{
          width: $q.screen.width * 0.8 + 'px',
          'max-width': $q.screen.width * 0.8 + 'px'
        }"
        class="q-pa-sm"
      >
        <q-toolbar class="text-dark">
          <q-toolbar-title> 油罐{{ oilData.oc_name }} </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <hl-auto-height class="q-mt-sm">
          <template slot="body">
            <ag-grid-vue
              ref="agGridTable"
              :gridOptions="gridOptions"
              class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :rowData="oilListData"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :localeText="localeText"
              :animateRows="false"
              :context="context"
              @first-data-rendered="onFirstDataRendered"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              rowHeight="40"
              rowSelection="multiple"
              :suppressCellSelection="true"
              :suppressRowClickSelection="true"
            ></ag-grid-vue>
          </template>
        </hl-auto-height>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AgData',
  components: {},
  data () {
    return {
      oilCanDetailStatus: false,
      localeText: this.$ag_grid_localeText,
      context: '',
      tab: 'manage',
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      oilData: {},
      gridOptions: {},
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '油品',
          field: 'oid_oilName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作时间',
          field: 'created_at',
          valueGetter: this.timeShow,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作行为',
          field: 'oid_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: p => {
            switch (p.data.oid_type) {
              case 'open':
                return '开油'
                break
              case 'take':
                return '取油'
                break
              case 'bakcan':
                return '回罐'
                break
              case 'turnIn':
                return '调入'
                break
              default:
                return '调出'
            }
          }
        },
        {
          headerName: '损耗比',
          field: 'oid_loss',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '损耗',
          field: 'oid_lossCount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作油量/升',
          field: 'oid_operatel',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作油量/吨',
          field: '',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user_id',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      oilListData: []
    }
  },
  created () {
    this.context = this
  },
  methods: {
    timeShow (p) {
      return this.$q_date.formatDate(
        p.data.created_at * 1000,
        'YYYY-MM-DD HH:mm:ss'
      )
    },
    init (oid_oilCanId) {
      this.oilCanDetailStatus = true
      this.oid_oilCanId = oid_oilCanId

      if (oid_oilCanId > 0) {
        this.$store
          .dispatch('can/getItemData', oid_oilCanId)
          .then(res => {
            if (res.code == 200 && res.data) {
              this.oilData = res.data
              this.oilListData = res.data.detail ? res.data.detail : []
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch(err => {})
      }
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
      this.$emit('getMethods')
      this.oilCanDetailStatus = false
    }
  }
}
</script>
