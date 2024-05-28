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
          <q-checkbox v-model="dataListSelections" @input="setSelectData(props.row,$event)" :val="props.row.id" />
        </q-td>
        <q-td key="expand" class="text-center">
          <q-btn size="sm" :disable="(props.row.child && props.row.child.length > 0) ? false : true" color="primary" round unelevated dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
        </q-td>
        <q-td key="jt_sort" class="text-center" :props="props">
          {{ props.row.jt_sort }}
          <q-popup-edit v-model="props.row.jt_sort" label-set="确定" buttons @save="changeNumber(props.row)" title="编辑排序">
            <q-input v-model="props.row.jt_sort" dense autofocus counter />
          </q-popup-edit>
        </q-td>

        <q-td key="jt_name" class="text-center">
          {{ props.row.jt_name }}
        </q-td>

        <q-td key="jt_top" class="text-center">
          {{ topObject[props.row.jt_top] }}
        </q-td>

        <q-td key="jt_cover_image" class="text-center">
          <q-img
            :src="props.row.coverImage && props.row.coverImage.id ? $q.localStorage.getItem('mychainstore_system_local').attach_url + props.row.coverImage.path : ''"
            :ratio="1"
            style="height: 50px ;width: 50px"
            v-if="props.row.coverImage"
          >

          <template v-slot:error>
              <div class="absolute-full flex flex-center bg-white ">
                <q-icon name="las la-image" size="sm" color="grey"></q-icon>
              </div>
            </template>
          </q-img>
          <q-img :ratio="1" v-else style="height: 50px ;width: 50px" >
            <template >
              <div class="absolute-full flex flex-center bg-white ">
                <q-icon name="las la-image" size="sm" color="grey"></q-icon>
              </div>
            </template>
          </q-img>
        </q-td>

        <q-td key="id" :props="props">
          <q-btn
            @click="addTypeData(props.row.id)"
            color="primary"
            v-if="authorityMeta('edit') "
            class="q-mr-sm"
            unelevated
            label="修改"
          >
        </q-btn>
          <q-btn label="删除" unelevated  color="red" @click="deleteOneData(props.row)" v-if="authorityMeta('del')"></q-btn>
        </q-td>

      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <type-table :typeListData="props.row.child"  @resetList="resetList" @selectedTypeData="selectedTypeDataSon" @addTypeData="addTypeData" @changeNumber="changeNumber" @deleteOneData="deleteOneData" />
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
      columnDefs: [
        {
          name: 'ids',
          required: true,
          label: '选择',
          align: 'center'
        },
        {
          name: 'expand',
          required: true,
          label: '子分类',
          align: 'center'
        },
        {
          name: 'jt_sort',
          label: '排序',
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
      selectMenuData: [],
      dataListSelections: [],
      selectedTypeData: [],
      topObject: {
        1: '默认',
        2: '首页推荐'
      }
    }
  },
  mounted () {},
  created () {

  },
  watch: {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {

    addTypeData (id) {
      this.$emit('addTypeData', id)
    },
    deleteOneData (row) {
      this.$emit('deleteOneData', row)
    },
    changeNumber (row) {
      this.$emit('changeNumber', row)
    },

    setSelectData (row, $event) {
      const status = this.dataListSelections.indexOf(row.id) > -1
      this.selectedTypeDataSon(row.id, status)
    },
    selectedTypeDataSon (data, status) {
      this.$emit('selectedTypeData', data, status)
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
