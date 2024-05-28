<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <div class="row q-gutter-x-sm">
          <div class="col-12 col-md-2">
            <q-input  label="请输入分类名称" outlined v-model="searchForm.searchQuery" dense />
          </div>

          <div class="col-12 col-md-2">
            <q-select
              outlined
              option-value="value"
              clearable
              option-label="label"
              emit-value
              map-options
              v-model="searchForm.adStatus"
              :options="status"
              dense
              label="分类状态"
            />
          </div>

          <q-btn @click="getList()" color="primary" unelevated label="搜索" />
          <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
          <q-btn @click="addTypeData(0)" color="primary" unelevated label="新增" />
          <q-btn :disabled="dataListSelections.length > 0 ? false : true" @click="delAll()" color="red" unelevated label="批量删除" />
        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <q-table
          flat
          :data="adListData"
          :columns="columns"
          row-key="id"
          card-class="full-height"
          table-header-class="text-center"
          no-data-label="空"
          separator="cell"
          hide-bottom
          :pagination="{
            rowsPerPage: 0,
          }"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="ids" :props="props">
                <q-checkbox v-model="dataListCheck" @input="setSelectData(props.row, $event)" :val="props.row.id" />
              </q-td>

              <q-td key="jt_sort" class="text-center" :props="props">
                {{ props.row.jt_sort }}
                <q-popup-edit v-model="props.row.jt_sort" label-set="确定" buttons @save="changeNumber(props.row)" title="编辑排序">
                  <q-input v-model="props.row.jt_sort" dense autofocus counter />
                </q-popup-edit>
              </q-td>

              <q-td key="jt_status" class="text-center">
                <q-toggle
                v-model="props.row.jt_status"
                color="green"
                true-value="1"
                false-value="0"
                @input="changeTypeStatus(props.row.id,props.row.jt_status)"
              />
              </q-td>

              <q-td key="jt_name" class="text-center">
                {{ props.row.jt_name }}
              </q-td>

              <q-td key="jt_top" class="text-center">
                {{ topObject[props.row.jt_top] }}
              </q-td>

              <q-td key="jt_cover_image" class="text-center">
                <q-img
                  :src="
                    props.row.coverImage && props.row.coverImage.id
                      ? $q.localStorage.getItem('pmerchant_system_local').attach_url + props.row.coverImage.path
                      : ''
                  "
                  :ratio="1"
                  style="height: 50px; width: 50px"
                  v-if="props.row.coverImage"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-white">
                      <q-icon name="las la-image" size="sm" color="grey"></q-icon>
                    </div>
                  </template>
                </q-img>
                <q-img :ratio="1" v-else style="height: 50px; width: 50px">
                  <template>
                    <div class="absolute-full flex flex-center bg-white">
                      <q-icon name="las la-image" size="sm" color="grey"></q-icon>
                    </div>
                  </template>
                </q-img>
              </q-td>

              <q-td key="id" :props="props">
                <q-btn @click="addTypeData(props.row.id)" color="primary" v-if="authorityMeta('edit')" class="q-mr-sm" unelevated label="修改">
                </q-btn>
                <q-btn label="删除" unelevated color="red" @click="deleteOneData(props.row)" v-if="authorityMeta('del')"></q-btn>
              </q-td>
            </q-tr>

          </template>
        </q-table>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </hl-pagination>
      </div>
    </div>
    <add-type v-if="isDialogStatus" @getMethods="getList" ref="addTypelRef"></add-type>
  </q-page>
</template>
<script>
import AddType from './components/AddType.vue'

export default {
  name: 'jfType',
  components: {
    AddType
  },
  data () {
    return {
      searchForm: {
        adStatus: '',
        adPosition: '',
        searchQuery: ''
      },

      status: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 2,
          label: '关闭'
        }
      ],
      isDialogStatus: false,
      context: null,
      gridOptions: {},
      adListData: [],

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      dataListCheck: [],
      columns: [
        {
          name: 'ids',
          required: true,
          label: '选择',
          align: 'center'
        },

        {
          name: 'jt_sort',
          label: '排序',
          align: 'center'
        },
        {
          name: 'jt_status',
          label: '状态',
          align: 'center'
        },
        { name: 'jt_name', align: 'center', label: '分类名称', field: 'jt_name' },
        { name: 'jt_top', align: 'center', label: '分类属性', field: 'jt_top' },
        {
          name: 'jt_cover_image',
          align: 'center',
          label: '封面图',
          field: 'jt_cover_image'
        },
        {
          name: 'id',
          align: 'center',
          label: '操作',
          field: 'id'
        }
      ],
      topObject: {
        1: '默认',
        2: '首页推荐'
      }
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
      this.isDialogStatus = false
      const obj = {
        ...this.searchForm,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('jfType/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.adListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.dataListSelections = []
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
    addTypeData (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addTypelRef.getItem(id)
      })
    },

    changeNumber (row) {
      const data = row
      const regu = /^\+?[0-9][0-9]*$/
      data.jt_sort = data.jt_sort.replace(/\s+/g, '')
      if (!data.jt_sort) {
        return false
      }
      if (!regu.test(data.jt_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        jt_sort: data.jt_sort,
        id: data.id
      }
      this.$store.dispatch('jfType/setData', obj).then((res) => {
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
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },

    delAll () {
      const dataListSelections = this.dataListSelections
      if (dataListSelections.length > 0) {
        this.$q
          .dialog({
            title: '是否确认',
            message: `确定删除 ${this.dataListSelections.length} 条分类吗`,
            cancel: true
          })
          .onOk(() => {
            this.deleteRecord(dataListSelections)
          })
      }
    },
    deleteRecord (obj) {
      this.$store.dispatch('jfType/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '成功',
            caption: '成功删除 ' + res.data + ' 条分类'
          })
          this.getList()
          this.dataListSelections = []
        }
      })
    },
    deleteOneData (row) {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除标题为 "${row.jt_name}" 的分类吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord([row.id])
        })
    },
    clearnBut () {
      this.searchForm = {
        adStatus: '',
        adPosition: '',
        searchQuery: ''
      }

      this.getList()
      this.dataListSelections = []
    },

    changeSort (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.jt_sort)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正整数',
          color: 'red'
        })
        this.getList()
      } else {
        const obj = {
          jt_sort: data.jt_sort,
          id: data.id
        }
        this.updateTypeData(obj)
      }
    },
    changeTypeStatus (id, jt_status) {
      this.$nextTick(() => {
        this.updateTypeData({
          id,
          jt_status
        })
      })
    },
    updateTypeData (obj) {
      this.$store
        .dispatch('jfType/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改排序成功',
              color: 'green'
            })
            this.getList()
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
    setSelectData (row) {
      const status = this.dataListCheck.indexOf(row.id) > -1
      this.selectedTypeData(row.id, status)
    },
    selectedTypeData (data, status) {
      if (status) {
        this.dataListSelections.push(data)
      } else {
        this.dataListSelections.splice(this.dataListSelections.indexOf(data), 1)
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
