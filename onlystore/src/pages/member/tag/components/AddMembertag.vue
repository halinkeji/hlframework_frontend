<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <div class="col-12 col-md-3 ">
         <q-input  label="标签名称" outlined v-model="name" dense />
      </div>

      <q-btn color="primary" unelevated label="搜索" @click="getMembertagList" />
      <q-btn color="warning" unelevated label="重置" @click="clean" />
      <q-btn color="primary" unelevated v-if="authorityMeta('add')" label="新增" @click="addMembertag" />
      <q-btn color="red" unelevated v-if="authorityMeta('delAll')" label="批量删除" :disable="dataListSelections.length > 0 ? false : true" @click="delAll" />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="MembertagData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        @first-data-rendered="onFirstDataRendered"
        :context="context"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
     <membertag-list ref="memberListRef" v-if="memberTagStatus" @hidePage="hideSeeMemberList"></membertag-list>
    <add-membertag-info ref="addRef" v-if="adddShow" @getMethods="getMembertagList"></add-membertag-info>
  </div>
</template>
<script>
import AgOperating from './AgOperating'
import AgSwitch from './AgSwitch'
import AddMembertagInfo from './AddMembertagInfo'
import MembertagList from './MembertagList.vue'
export default {
  name: 'AddMembertag',
  components: { AgOperating, AgSwitch, AddMembertagInfo, MembertagList },
  data () {
    return {
      MembertagData: [],
      context: null,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.015) + 'px'
        },

        {
          headerName: '标签名称',
          field: 'mti_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '标签描述',
          field: 'mti_content',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgSwitch'
        },

        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperating',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        rowDragManaged: true
      },
      adddShow: false,
      gridOptions: {},
      name: '',
      localeText: this.$ag_grid_localeText,
      memberTagStatus: false
    }
  },

  created () {
    this.context = this
    this.getMembertagList()
  },
  mounted () {},
  computed: {},
  methods: {
    clean () {
      this.name = ''
      this.getMembertagList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getMembertagList () {
      this.dataListSelections = []
      const obj = {
        text: this.name,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('membertag/getMembertagList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.MembertagData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red',
            message: '失败',
            caption: error.message,
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    addMembertag (id) {
      this.adddShow = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    seeMemberList (id) {
      this.memberTagStatus = true
      this.$nextTick(() => {
        this.$refs.memberListRef.init(id)
      })
    },
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定删除会员标签吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store
              .dispatch('membertag/delData', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功删除 ' + res.data + ' 条！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.dataListSelections = []
                  this.getMembertagList()
                }
              })
              .catch((error) => {
                this.$q.notify({
                  color: 'red',
                  message: '失败',
                  caption: error.message,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              })
          }
        })
        .onCancel(() => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getMembertagList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getMembertagList()
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
    hideSeeMemberList () {
      this.memberTagStatus = false
      this.getMembertagList()
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
