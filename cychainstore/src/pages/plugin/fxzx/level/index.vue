<template>
  <q-page class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="levelName" label="请输入等级名称" class="col-12 col-md-2" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
           <q-btn unelevated color="primary" dense label="新增" :to="{name:'fxzxAddLevel'}" class="q-px-md" v-if="authorityMeta('addLevel')" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="LevelList"
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
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
import AgCondition from './components/AgCondition'
export default {
  name: 'fxzxLevel',
  components: {
    AgOperate,
    AgStatus,
    AgCondition
  },
  data () {
    return {
      addPoppupStatus: false,
      levelName: '',
      context: '',
      selectedLevel: [],
      LevelList: [],
      gridOptions: {},
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
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '等级名称',
          field: 'pfl_name',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '一级佣金比例',
          valueGetter: (p) => {
            return p.data.pfl_one_fxzx_proportion + '%'
          },
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '二级佣金比例',
          valueGetter: (p) => {
            return p.data.pfl_two_fxzx_proportion + '%'
          },
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '三级佣金比例',
          valueGetter: (p) => {
            return p.data.pfl_three_fxzx_proportion + '%'
          },
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '升级条件',
          cellRendererFramework: 'AgCondition',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.16) + 'px',
          cellRendererFramework: 'AgOperate'
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
        levelName: this.levelName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fxzx/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.LevelList = res.data ? res.data.list : []
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
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.levelName = ''
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    rowSelectedAg (p) {
      this.selectedLevel = p.api.getSelectedRows()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
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
