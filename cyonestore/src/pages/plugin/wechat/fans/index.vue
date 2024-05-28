<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-sm q-pb-lg q-pt-xs">
        <q-chip square color="blue-1" text-color="blue-8" icon="las la-exclamation-circle">
          粉丝昵称中若带有特殊字符（包含但不限于:表情、中英文标点符号、换行符等）将会被替换为下划线"_"，多个替换多次。
        </q-chip>
        <div class="q-gutter-x-xs row ">
          <q-select outlined dense v-model="model" :options="options" />
          <q-select outlined dense v-model="modelOne" :options="optionsOne" />
          <q-input outlined v-model="searchName" dense>
            <template v-slot:append>
              <div class="q-pl-none" @click="getList" >
                <q-icon name="search" />
              </div>
            </template>
          </q-input>
          <q-btn unelevated color="blue-6" label="打标签" v-if="authorityMeta('batchGroup')" @click="batchShow = true">
            <q-popup-proxy v-if="batchShow">
              <q-banner>
                <div class="q-my-sm text-subtitle1">
                  标签
                </div>
                <div class="q-gutter-sm row">
                  <div class="col-auto" v-for="item in groupsData.groups">
                    <q-checkbox v-model="selection" :val="item.id" :label="item.name" color="cyan"></q-checkbox>
                  </div>
                </div>
                <div>
                  <div class="text-center q-gutter-sm q-mt-sm">
                    <q-btn unelevated color="blue-6" label="确定" @click="batchGroup" class="q-px-md" />
                    <q-btn outline color="blue-6" label="取消" class="q-px-md" @click="batchShow = false" />
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn unelevated color="blue-6" label="同步全部信息" v-if="authorityMeta('updateAll')" @click="updateAllFans" />
        </div>
        <div class="col-8 q-pl-md">
          <q-btn color="blue-6" label="重命名" flat class="q-ml-sm" v-if="groupItem.id > 0 && authorityMeta('editLabel')">
            <q-popup-proxy>
              <q-banner>
                <div class="q-my-sm text-subtitle1">
                  标签名称
                </div>
                <div>
                  <q-input outlined dense v-model="name" label="分组名称" />
                </div>
                <div>
                  <div class="text-center q-gutter-sm q-mt-sm">
                    <q-btn unelevated color="blue-6" label="确定" @click="addGroups()" class="q-px-md" />
                    <q-btn outline color="blue-6" label="取消" class="q-px-md" />
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn color="blue-6" label="删除" flat v-if="groupItem.id > 0 && authorityMeta('delLable')">
            <q-popup-proxy>
              <q-banner>
                <div class="q-my-sm" style="width:200px">
                  删除标签后，该标签下的所有用户将失去该标签属性。是否确定删除？
                </div>
                <div>
                  <div class="text-center q-gutter-sm q-mt-sm">
                    <q-btn unelevated color="blue-6" label="确定" @click="deleteGroup" class="q-px-md" />
                    <q-btn outline color="blue-6" label="取消" class="q-px-md" />
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
        <q-linear-progress dark stripe rounded size="20px" v-if="totalCount > 0" :value="number / totalCount" color="red" class="q-mt-sm" />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2 row">
        <div class="col-md-10 col-12">
          <ag-grid-vue
            ref="agGridTable"
            :components="components"
            :gridOptions="gridOptions"
            class="ag-theme-balham hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="fansData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            @first-data-rendered="adaptiveTable"
            rowHeight="50"
            :stopEditingWhenGridLosesFocus="true"
            suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :rowMultiSelectWithClick="true"
            :singleClickEdit="true"
            :context="context"
            :localeText="localeText"
            @rowSelected="rowSelectedAg"
          ></ag-grid-vue>
        </div>

        <div class="col-md-2 col-12 bg-white rounded-borders text-center">
          <q-item clickable :active="groupItem.name == '全部'" v-ripple class="q-pa-none" @click="changeGroup('全部')" active-class="bg-primary text-white">
            <q-item-section>全部用户（{{ page.pageTotal }}）</q-item-section>
          </q-item>
          <q-item clickable :active="groupItem.name == item.id" v-ripple class="q-pa-none q-pl-lg" v-for="(item, key) in groupsData.groups" @click="changeGroup(item)" :key="key">
            <q-item-section>{{ item.name }}（{{ item.count }}）</q-item-section>
          </q-item>
        </div>
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
import AgMeasureOperate from './components/AgMeasureOperate.vue'
import Mode from './components/AgMode'
import PictureItem from './components/AgPictureItem'
export default {
  components: {
    AgMeasureOperate,
    Mode,
    PictureItem
  },
  name: 'fans',
  data () {
    return {
      tab: '1',
      model: '已关注',
      options: ['已关注', '取消关注'],
      searchName: '',
      modelOne: '精准',
      optionsOne: ['精准', '模糊'],
      name: '',
      gridOptions: {},
      progress: 0,
      fansData: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      dataListSelections: [],
      components: {
        AgMeasureOperate,
        Mode,
        PictureItem
      },
      context: null,
      groupsData: {},
      selection: [],
      columnDefs: [
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 30
        },
        {
          headerName: '头像',
          field: 'headimgurl',
          filter: false,
          cellRendererFramework: 'PictureItem',
          width: 120
        },
        {
          headerName: '昵称',
          field: 'nickname',
          filter: false
        },
        {
          headerName: '标签',
          field: 'gu_goodsOrService',
          filter: false,
          cellRendererFramework: 'Mode'
        },
        {
          headerName: '关注时间',
          field: 'subscribe_time',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.subscribe_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        }
        // {
        //   headerName: "操作",
        //   field: "measure_operate",
        //   filter: false,
        //   cellRendererFramework: "AgMeasureOperate",
        //   width: 120
        // }
      ],

      localeText: this.$ag_grid_localeText,
      btnShow: false,
      batchShow: false,
      groupItem: {
        name: '全部'
      },
      totalCount: 0,
      number: 0
    }
  },
  mounted () {
    this.context = this
    this.getList()
    this.getGroupsList()
  },
  created () {},
  computed: {},
  methods: {
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    updateAllFans () {
      this.$store
        .dispatch('wechatFans/updateAllFans')
        .then((res) => {
          if (res.code == 200) {
            this.totalCount = res.data.count
            this.updateFans()
          }
        })
        .catch((error) => {})
    },
    updateFans () {
      if (this.totalCount > this.number) {
        const obj = {
          page: this.number
        }
        this.$store
          .dispatch('wechatFans/updateFans', obj)
          .then((res) => {
            if (res.code == 200) {
              this.number = this.number + res.data
              this.updateFans()
            }
          })
          .catch((error) => {})
      } else {
        this.$q.notify({
          message: '成功',
          caption: '同步粉丝成功!',
          icon: 'ion-checkmark-circle-outline',
          color: 'green',
          position: 'top-right'
        })
        this.totalCount = 0
        this.number = 0
      }
    },
    getList () {
      const obj = {
        text: this.searchName,
        tag_id: this.groupItem.id,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('wechatFans/getfanslist', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.pageTotal = res.data.page.totalCount
            } else {
              this.page.pageTotal = 0
            }
            this.fansData = res.data.list
          }
        })
        .catch((error) => {})
    },
    // 自适应
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    getGroupsList () {
      this.$store
        .dispatch('wechatFans/getGroups')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.groupsData = res.data
            } else {
              this.groupsData = {}
            }
          }
        })
        .catch((error) => {})
    },
    addGroups () {
      if (this.name) {
        const obj = {
          name: this.name,
          id: this.groupItem.id
        }
        this.$store.dispatch('wechatFans/setData', obj).then((res) => {
          if (res.code == 200) {
            if (this.groupItem.id > 0) {
              this.$q.notify({
                message: '成功',
                caption: '修改成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
            } else {
              this.$q.notify({
                message: '成功',
                caption: '新增粉丝标签成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
            }
            this.btnShow = false
            this.clearGroup()
          }
        })
      }
    },
    changeGroup (item) {
      if (item == '全部') {
        this.groupItem.name = '全部'
        this.groupItem.id = ''
      } else {
        this.groupItem = item
      }
      this.getList()
    },
    deleteGroup () {
      const obj = {
        id: this.groupItem.id
      }
      this.$store.dispatch('wechatFans/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除粉丝标签!',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-right'
          })
          this.clearGroup()
        }
      })
    },
    clearGroup () {
      this.getGroupsList()
      this.name = ''
      this.groupItem = {
        name: '全部',
        id: ''
      }
    },
    batchGroup () {
      if (this.selection.length > 0) {
        const dataListSelections = this.gridOptions.api.getSelectedRows()
        if (this.dataListSelections.length > 0) {
          const openids = []
          _(dataListSelections).forEach(function (value, k) {
            openids.push(value.openid)
          })
          const obj = {
            openid: openids,
            groupId: this.selection
          }

          this.$store.dispatch('wechatFans/batchGroup', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改粉丝标签成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.batchShow = false
              this.selection = []
              this.getGroupsList()
            }
          })
        } else {
          this.$q.notify({
            message: '失败',
            caption: '请选择粉丝',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-right'
          })
        }
      } else {
        this.$q.notify({
          message: '失败',
          caption: '请选择标签',
          icon: 'ion-checkmark-circle-outline',
          color: 'green',
          position: 'top-right'
        })
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

<style></style>
