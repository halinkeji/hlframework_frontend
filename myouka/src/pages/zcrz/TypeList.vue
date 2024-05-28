<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs q-pt-sm row">
        <div class="col-12 col-md-3">
          <q-input outlined v-model="typeName" label="输入分类名称/分组名称搜索" dense />
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" unelevated label="重置" @click="clearBut" />
        <q-btn color="primary" unelevated label="新增" @click="addNewData(0)" />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <q-table
          bordered
          :data="typeDataList"
          :pagination="{
            rowsPerPage: 0,
          }"
          hide-bottom
          :columns="groupColumns"
          separator="cell"
          flat
          row-key="name"
          class="full-height"
          square
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="zg_group_name" :props="props">
                {{ props.row.zg_group_name }}
              </q-td>

              <q-td key="id" :props="props">
                <q-btn flat @click="addNewData(props.row.id)" rounded color="primary" class="q-mr-sm" icon="create">
                  <q-tooltip> 修改 </q-tooltip>
                </q-btn>

                <q-btn flat @click="confirmDeleteRecord(props.row.id)"  rounded color="red" icon="delete_forever">
                  <q-tooltip> 删除 </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.row.typeDetail && props.row.typeDetail.length > 0" :props="props" class="q-pa-none">
              <q-td colspan="100%" class="no-padding bg-grey-3">
                <q-table
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                  hide-bottom
                  :data="props.row.typeDetail"
                  flat
                  bordered
                  :columns="typeColumns"
                  row-key="name"
                  square
                  class="q-mx-sm q-mb-sm"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="zg_name" :props="props">
                        {{ props.row.zg_name }}
                      </q-td>
                       <q-td key="zsc_is_zcrz_price" :props="props">
                        {{ priceStatusText(props.row.storeConfig) }}
                      </q-td>

                      <q-td key="zsc_zcrz_price_type" :props="props">
                        {{ priceTypeText(props.row.storeConfig)  }}
                      </q-td>

                      <q-td key="zg_cover_image" :props="props">
                        <q-img
                          :src="`${$q.localStorage.getItem('myouka_system_local').attach_url}` + (props.row.coverImage ? props.row.coverImage.path : '')"
                          :ratio="1"
                          style="height: 50px; width: 50px"
                        >
                          <template v-if="!props.row.coverImage">
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
                            </div>
                          </template>
                          <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
                            </div>
                          </template>
                        </q-img>
                      </q-td>

                      <q-td key="id" :props="props">
                        <q-btn flat rounded color="warning" @click="setMemberPrice(props.row.id)" icon="fas fa-chart-line">
                          <q-tooltip> 专车价 </q-tooltip>
                        </q-btn>
                        <q-btn flat  @click="addNewData(props.row.id)" rounded color="primary" class="q-mr-sm" icon="create">
                          <q-tooltip> 修改 </q-tooltip>
                        </q-btn>
                        <q-btn flat  @click="confirmDeleteRecord(props.row.id)" rounded color="red" icon="delete_forever">
                          <q-tooltip> 删除 </q-tooltip>
                        </q-btn>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
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
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
      <add-car-type v-if="isPoppupStatus" @getMethods="getList" ref="addTypeRef"></add-car-type>
      <zcrz-price ref="zcrzMemberPriceRef" @closeDialog="getList" v-if="zcrzPriceStatus" />
    </div>
  </q-page>
</template>
<script>

import AddCarType from './AddCarType.vue'
import ZcrzPrice from './ZcrzPrice.vue'
export default {
  components: { AddCarType, ZcrzPrice },
  data () {
    return {
      isPoppupStatus: false,
      typeName: '',

      typeDataList: [],

      groupColumns: [
        {
          name: 'zg_group_name',
          align: 'center',
          label: '分组名称',
          field: 'zg_group_name'
        },

        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id',
          style: 'width:13%'
        }
      ],
      typeColumns: [
        {
          name: 'zg_name',
          label: '类型名称',
          align: 'center',
          field: 'zg_name'
        },
        {
          name: 'zsc_is_zcrz_price',
          label: '会员价',
          align: 'center',
          field: 'zsc_is_zcrz_price'
        },
        {
          name: 'zsc_zcrz_price_type',
          label: '会员价模式',
          align: 'center',
          field: 'zsc_zcrz_price_type'
        },

        {
          name: 'zg_cover_image',
          align: 'center',
          label: '图片',
          field: 'zg_cover_image'
        },

        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id',
          style: 'width:10%'
        }
      ],

      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      zcrzPriceStatus: false

    }
  },
  mounted () {},
  created () {
    this.getList()
  },
  computed: {},
  methods: {
    setMemberPrice (typeId) {
      this.zcrzPriceStatus = true

      this.$nextTick(() => {
        this.$refs.zcrzMemberPriceRef.init(typeId)
      })
    },
    // 获取列表
    getList () {
      this.isPoppupStatus = false
      this.zcrzPriceStatus = false
      const obj = {
        text: this.typeName,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('zcrz/getTypeListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data && res.data.page ? res.data.page.totalCount : 0
            this.typeDataList = res.data && res.data.list ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    addNewData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addTypeRef.init(id)
      })
    },

    clearBut () {
      this.typeName = ''
      this.getList()
    },

    confirmDeleteRecord (zcrzTypeId) {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定删除此类型/分组吗',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('zcrz/delData', zcrzTypeId)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getList()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    priceTypeText (val) {
      if (val && val.zsc_zcrz_price_type && parseInt(val.zsc_zcrz_price_type) == 1) {
        return '等级折扣/积分比例'
      }
      if (val && val.zsc_zcrz_price_type && parseInt(val.zsc_zcrz_price_type) == 2) {
        return '会员价/积分换算'
      }

      return '未配置'
    },
    priceStatusText (val) {
      if (val && val.zsc_is_zcrz_price && parseInt(val.zsc_is_zcrz_price) == 1) {
        return '开启'
      }
      if (val && val.zsc_is_zcrz_price && parseInt(val.zsc_is_zcrz_price) == 2) {
        return '关闭'
      }

      return '未配置'
    }
  }
}
</script>
