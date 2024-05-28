<template>
  <q-table
    :data="typeListData"
    :pagination="{
      rowsPerPage: 0,
    }"
    hide-pagination
    :columns="columnDefs"
    bordered
    flat
    table-header-class="text-center"
    no-data-label="空"
    separator="cell"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="ids" :props="props">
          <q-checkbox v-model="dataListSelections" @input="setSelectData(props.row)" :val="props.row.id" />
        </q-td>
        <q-td key="expand" class="text-center">
          <q-btn size="sm" :disable="(props.row.goodsType && props.row.goodsType.length > 0) ? false : true" color="primary" round unelevated dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
        </q-td>
        <q-td key="gt_sort" class="text-center" :props="props">
          {{ props.row.gt_sort }}
            <q-popup-edit v-model="props.row.gt_sort" label-set="确定" buttons @save="changeNumber(props.row)" title="编辑排序">
              <q-input v-model="props.row.gt_sort" dense autofocus counter />
            </q-popup-edit>
        </q-td>
        <q-td key="gt_name" class="text-center" :props="props">
          {{ props.row.gt_name }}
        </q-td>
         <q-td key="gt_code" class="text-center" :props="props">
          {{ props.row.gt_code }}
        </q-td>

        <q-td key="gt_status" class="text-center" :props="props">
          <q-toggle
            v-model="props.row.gt_status"
            true-value="1"
            false-value="0"
            @input="updatedTypeStatus(props.row.gt_status,props.row)"
            v-if="authorityMeta('edit') && verifyMain(props.row)"
            color="green"
          />
        </q-td>
        <q-td key="id" :props="props">
          <q-btn
            :to="{
              name: 'addClothingType',
              query: { id: props.row.id },
            }"
            color="primary"
            v-if="authorityMeta('edit') && verifyMain(props.row)"
            class="q-mr-sm"
            unelevated
            label="修改"
          >
        </q-btn>
          <q-btn label="删除" unelevated  color="red" @click="confirmDeleteRecord(props.row)" v-if="authorityMeta('del') && verifyMain(props.row)"></q-btn>
        </q-td>

      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <type-table :typeListData="props.row.goodsType"  @resetList="resetList" @selectedTypeData="selectedTypeDataSon" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'TypeTable',
  props: ['typeListData', 'menuPositionItem'],
  components: {},
  data () {
    return {
      columnDefs: [],
      selectMenuData: [],
      dataListSelections: [],
      selectedTypeData: []
    }
  },
  mounted () {},
  created () {
    const columnDefs = [
      {
        name: 'ids',
        required: true,
        label: '操作',
        align: 'center'
      },
      {
        name: 'expand',
        required: true,
        label: '子分类',
        align: 'center'
      },
      {
        name: 'gt_sort',
        label: '排序',
        align: 'center'
      },
      { name: 'gt_name', align: 'center', label: '分类名称', field: 'gt_name' },
      { name: 'gt_code', align: 'center', label: '分类编号', field: 'gt_code' },

      { name: 'gt_status', align: 'center', label: '状态', field: 'gt_status' }

    ]
    columnDefs.push(
      { name: 'id', align: 'center', label: '操作', field: 'id' }
    )

    this.columnDefs = columnDefs
  },
  watch: {},
  computed: {
  },
  methods: {
    verifyMain (row) {
      return true
    },
    updatedTypeStatus (status, row) {
      const obj = {
        gt_status: status,
        id: row.id
      }
      this.$store
        .dispatch('clothingType/setData', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改状态成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch(error => {
          this.$q.notify({
            message: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    confirmDeleteRecord (row) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${row.gt_name}"的商品分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord(row)
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    deleteRecord (row) {
      const obj = [row.id]
      this.$store
        .dispatch('clothingType/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除分类成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.$emit('resetList')
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    setSelectData (row, $event) {
      const status = !(this.dataListSelections.indexOf(row.id) > -1)
      this.selectedTypeDataSon(row, status)
    },
    selectedTypeDataSon (row, status) {
      this.$emit('selectedTypeData', row, status)
    },
    changeNumber (row) {
      const data = row
      const regu = /^\+?[0-9][0-9]*$/
      data.gt_sort = data.gt_sort.replace(/\s+/g, '')
      if (!data.gt_sort) {
        this.resetList()
        return ''
      }
      if (!regu.test(data.gt_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.resetList()
      } else {
        const obj = {
          gt_sort: data.gt_sort,
          id: data.id
        }
        this.$store.dispatch('clothingType/setData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改排序成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.resetList()
          }
        })
      }
    },

    resetList () {
      this.$emit('resetList')
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
