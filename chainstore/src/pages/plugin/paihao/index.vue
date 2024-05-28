<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-pa-sm row q-gutter-xs">
         <q-input outlined dense v-model="projectData.pp_title" label="请输入项目标题" class="col-12 col-md-2" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearBtn" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增" @click="showAddProject" class="q-px-md" v-if="authorityMeta('addProject')" />
          <q-btn
            unelevated
            color="red"
            dense
            label="批量删除"
            :disable="selectedProject.length > 0 ? false : true"
            @click="delAll"
            class="q-px-md"
            v-if="authorityMeta('delProject')"
          />
      </div>
      <div class="col-shrink full-height q-px-xs">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="projectList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
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
    </div>
    <paihao-add-project ref="addProjectRef" v-if="addPoppupStatus" @dataList="hideProjectPoppup" />
    <paihao-detail ref="detailRef" v-if="detailPoppupStatus" @dataList="hideDetailPoppup" />
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
import paihaoAddProject from './AddProject'
import paihaoDetail from './Detail'
export default {
  name: 'paihao',
  components: {
    AgOperate,
    AgStatus,
    paihaoAddProject,
    paihaoDetail
  },
  data () {
    return {
      addPoppupStatus: false,
      detailPoppupStatus: false,
      projectData: {
        pp_title: ''
      },
      context: '',
      selectedProject: [],
      projectList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '排序',
          field: 'pp_sort',
          width: this.nowpx(0.08) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '项目标题',
          field: 'pp_title',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '项目编号前缀',
          field: 'pp_number_prefix',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '状态',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '当前排队人数',
          field: 'beforeNumber',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
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
        projectTitle: this.projectData.pp_title
      }
      this.$store
        .dispatch('paihao/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.projectList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个项目吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedProject = this.gridOptions.api.getSelectedRows()
          if (selectedProject.length > 0) {
            const params = selectedProject.map((item) => {
              return item.id
            })
            this.$store.dispatch('paihao/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个项目！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedProject = []
                this.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
          }
        })
        .onCancel(() => {})
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.pp_sort)) {
        this.getList()
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else {
        itemsToUpdate.push(data)
        this.$store
          .dispatch('paihao/setData', data)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改排序成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getList()
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
          })
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.projectData.pp_title = ''
      this.getList()
    },
    showAddProject (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addProjectRef.init(id)
      })
    },
    showDetail (data) {
      this.detailPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.detailRef.getDetail(data)
      })
    },
    hideProjectPoppup () {
      this.addPoppupStatus = false
      this.getList()
    },
    hideDetailPoppup () {
      this.detailPoppupStatus = false
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
      this.selectedProject = p.api.getSelectedRows()
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
