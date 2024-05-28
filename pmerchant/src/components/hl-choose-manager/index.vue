<template>
  <q-dialog v-model="dialogVisible" @close="closeDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-pb-md">
          <div class="q-pa-sm">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择会员
          </div>
          <q-separator />
        </div>

        <div class="col-shrink bg-white q-pb-md">
          <div class="row q-gutter-sm q-pa-sm">
            <div class="col-12 col-md-3">
              <q-input outlined dense v-model="searchQuery" label="可搜索:会员卡号/手机号/身份证号/真实姓名/昵称" />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                outlined
                option-value="id"
                option-label="mcl_level_name"
                emit-value
                map-options
                v-model="levelId"
                :options="memberCardLevelDatas"
                dense
                label="请选择会员等级"
              />
            </div>

            <q-btn label="搜索" unelevated color="primary" @click="getMemberListData()" />
            <q-btn
              label="重置"
              unelevated
              color="warning"
              @click="
                dataListSelections = [];
                searchQuery = '';
                levelId = '';
                getMemberListData();
              "
            />
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
            :rowData="memberListData"
            rowSelection="single"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            rowHeight="50"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            @rowSelected="rowSelectedAg"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
          ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-pb-md row items-center q-pa-sm q-gutter-sm">
          <div class="col-5">
            <hl-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="page.pageIndex"
              :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
              :page-size="page.pageSize"
              :total="page.pageTotal"
              layout="total, sizes, prev, pager, next, jumper"
            ></hl-pagination>
          </div>

          <q-space />
          <q-btn
            class="q-px-lg"
            label="确认"
            unelevated
            color="primary"
            :disable="dataListSelections.length > 0 ? false : true"
            @click="selectAdministrator()"
          />
          <q-btn class="q-px-lg" label="关闭" unelevated color="grey" @click="closeDialog" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'hl-choose-manager',
  components: {},
  data () {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      columnDefs: [
        // 表格列数据
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 40
        },
        {
          headerName: ' 卡号',
          field: 'card_number'
        },
        {
          headerName: '手机号',
          field: 'phone_number',
          filter: false,
          valueGetter: (p) => {
            if (p.data.relationMobile && p.data.relationMobile.length > 0) {
              let text = '  '
              p.data.relationMobile.forEach((item, key) => {
                if (key > 0) {
                  text += '，'
                }
                text += item.phone_number
              })
              text += '  '

              return text
            }
            return '  '
          }
        },
        {
          headerName: '昵称', // 列标题
          field: 'nick_name', // 列与数据源对应的字段
          filter: false // 是否过滤
        },
        {
          headerName: '会员级别',
          field: 'memberLevel.mcl_level_name',
          filter: false
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      dialogVisible: false,
      levelId: '',
      memberCardLevelDatas: [],
      searchQuery: '',
      localeText: this.$ag_grid_localeText
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelDatas = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getMemberListData () {
      this.getLevel()
      this.dialogVisible = true
      const obj = {
        text: this.searchQuery,
        levelId: this.levelId,
        pSize: this.page.pageSize,
        page: this.page.pageIndex,
        state: 1
      }
      this.$store
        .dispatch('member/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.memberListData = res.data.list
              this.page.pageTotal = parseInt(res.data.page.totalCount)
            } else {
              this.memberListData = []
              this.page.pageTotal = 0
            }
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getMemberListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getMemberListData()
    },

    selectAdministrator () {
      this.dialogVisible = false
      this.$emit('getChooseManageData', this.dataListSelections)
    },

    closeDialog () {
      this.dialogVisible = false
      this.$emit('closeChooseManage')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    }
  }
}
</script>
