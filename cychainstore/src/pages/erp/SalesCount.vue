<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-pb-md q-pt-sm  q-px-sm row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="queryText" label="请输入菜品名称|简称|编码" />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="foodsType"
            :options="dishesTypeData"
            label="请选择菜品分类"
            option-value="id"
            option-label="gt_name"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="startTime" label="开始时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-2 col-12">
          <q-input outlined readonly dense label="结束时间" v-model="endTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
        <q-btn unelevated color="warning" dense label="重置" @click="clearBtn" class="q-px-md" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="countData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
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
  </q-page>
</template>
<script>

export default {
  name: 'salesCount',
  components: { },
  data () {
    return {
      queryText: '',
      foodsType: '',
      startTime: '',
      endTime: '',
      context: '',
      countData: [],
      dishesTypeData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '菜品名称',
          field: 'goo_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '菜品分类',
          field: 'gt_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '编码',
          field: 'goo_code',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '销售非会员价汇总',
          field: 'nonMemberPrice',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '销售会员价汇总',
          field: 'memberPrice',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '销售价格汇总',
          field: 'totalPrice',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '销售非会员价数量',
          field: 'nonMemberQuantity',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '销售会员价数量',
          field: 'memberQuantity',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '销售数量汇总',
          field: 'totalQuantity',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getDishesTypeList()
    this.getList()
  },
  mounted () {
    this.context = this
  },
  computed: {},
  methods: {
    getDishesTypeList () {
      this.$store
        .dispatch('dishes/getTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.dishesTypeData = res.data ? res.data : []
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
    getList () {
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const params = {
        queryText: this.queryText,
        foodsType: this.foodsType,
        startTime: startTime,
        endTime: endTime
      }
      this.$store
        .dispatch('fooderp/getSalesCountData', params)
        .then((res) => {
          if (res.code == 200) {
            this.countData = res.data ? res.data : []
            if (this.dishesTypeData.length > 0) {
              setTimeout(() => {
                this.setTopTabel(res.data)
              }, 200)
            }
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
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          fl_name: '合计',
          show_status: true,
          nonMemberPrice: '',
          memberPrice: '',
          totalPrice: '',
          nonMemberQuantity: '',
          memberQuantity: '',
          totalQuantity: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },
    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        return rowData
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 272
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.queryText = ''
      this.foodsType = ''
      this.startTime = ''
      this.endTime = ''
      this.getList()
    }
  }
}
</script>
