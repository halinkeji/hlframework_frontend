<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.6 + 'px',
        'min-width': $q.screen.width * 0.6 + 'px',
      }"
      class="fit q-pa-sm"
    >
      <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pa-sm row q-mb-md">
          <div class="text-h6">分销商等级</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-px-xs full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="fxzxLevelData"
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
         <div class="col-shrink bg-white q-pb-md q-gutter-md text-center">
          <q-btn unelevated color="grey" label="取消" v-close-popup />
          <q-btn unelevated color="primary" :disable="addButtonDisabled" label="确定" @click="updateFxzxLevelData" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import FxzxLevelAgOperate from './FxzxLevelAgOperate'
export default {
  name: 'FxzxLevel',
  components: { FxzxLevelAgOperate },
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      memberInfo: '',
      fxzxId: '',
      levelId: '',
      selectedLevelData: {},
      context: null,
      gridOptions: {},
      fxzxLevelData: [],
      columnDefs: [
        {
          headerName: '等级权重',
          valueGetter: (p) => {
            switch (parseInt(p.data.pfl_weights)) {
              case 0:
                return '默认'
              case 1:
                return '一级'
              case 2:
                return '二级'
              case 3:
                return '三级'
              case 4:
                return '四级'
              case 5:
                return '五级'
              case 6:
                return '六级'
              case 7:
                return '七级'
              case 8:
                return '八级'
              case 9:
                return '九级'
              case 10:
                return '十级'
              default:
                return false
            }
          },
          width: this.nowpx(0.325) + 'px'
        },

        {
          headerName: '等级名称',
          field: 'pfl_name',
          width: this.nowpx(0.325) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.35) + 'px',
          cellRendererFramework: 'FxzxLevelAgOperate'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList (id, levelId) {
      if (id > 0) {
        this.fxzxId = id
      }
      if (levelId > 0) {
        this.levelId = levelId
      }
      this.$store
        .dispatch('fxzx/getLevelList')
        .then((res) => {
          if (res.code == 200) {
            this.fxzxLevelData = res.data ? res.data : []
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
    updateFxzxLevelData () {
      this.addButtonDisabled = true
      const params = {
        fxzxId: this.fxzxId,
        ...this.selectedLevelData
      }
      this.$store
        .dispatch('fxzx/updateFxzxLevelData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '更改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
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
          this.$emit('dataList')
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
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
