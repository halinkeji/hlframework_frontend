<template>
  <q-page class="fit">
    <q-form ref="countDataRef" class=" fit">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-sm row items-end " :class="currentPage == '1' ? 'q-mb-xs' : ''">
          <q-tabs v-model="currentPage" indicator-color="primary" class="text-grey-8 bg-white col-auto" align="left">
            <q-tab name="1" label="套餐基础" />
            <q-tab name="2" label="套餐详情" />
          </q-tabs>
          <q-space />
          <div class="col-auto">
            <q-btn v-show="currentPage == '2'" unelevated color="primary" @click="selectBut()" label="选择商品"> </q-btn>
          </div>
        </div>

        <div class="col-shrink  full-height bg-grey-3" v-show="currentPage == '1'">
          <div style="overflow-y: scroll;" class="fit full-height bg-white">
            <q-card flat class="q-pa-sm">
              <div class="row">
                <div class="col-md-6 col-12 row">
                  <div class="col-12">
                    <q-input label="充次套餐名称" class="q-mt-md" outlined v-model="recPackageInfo.grp_name" dense lazy-rules :rules="[(val) => !!val || '套餐名称是必填的']"> </q-input>
                  </div>

                  <div class="col-md-6 col-12 q-pr-xs">
                    <q-input
                      label="充次套餐售价"
                      outlined
                      v-model="recPackageInfo.grp_packagePrice"
                      lazy-rules
                      :rules="[(val) => !!val || '套餐售价是必填的', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '套餐售价为非负两位以内小数']"
                      dense
                    >
                    </q-input>
                  </div>

                  <div class="col-md-6 col-12 q-pl-xs">
                    <q-select
                      outlined
                      dense
                      emit-value
                      map-options
                      v-model="recPackageInfo.grp_status"
                      :options="[
                        { label: '上架', value: '1' },
                        { label: '下架', value: '2' },
                      ]"
                      label="状态"
                      placeholder="选择范围"
                    >
                    </q-select>
                  </div>

                  <div class="col-md-6 col-6">
                    <div class="col-md-10 col-12">
                      <div class="text-subtitle1 q-mt-md">有效期设置</div>
                      <q-option-group v-model="recPackageInfo.grp_timeType" :options="limitOptions" color="primary" inline emit-value map-options @input="changeOptions"> </q-option-group>
                    </div>
                    <div class="row q-mt-sm" v-if="parseInt(recPackageInfo.grp_timeType) == 3">
                      <q-input outlined v-model="recPackageInfo.grp_startTime" label="开始时间" dense lazy-rules :error="false" class="q-mt-xs q-mr-lg" readonly>
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                              <q-date v-model="recPackageInfo.grp_startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定" color="primary" flat />
                                </div>
                              </q-date>
                            </q-menu>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                              <q-time v-model="recPackageInfo.grp_startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定" color="primary" flat />
                                </div>
                              </q-time>
                            </q-menu>
                          </q-icon>
                        </template>
                      </q-input>

                      <q-input outlined v-model="recPackageInfo.grp_endTime" label="结束时间" dense lazy-rules :error="false" class="q-mt-xs" readonly>
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                              <q-date v-model="recPackageInfo.grp_endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定" color="primary" flat />
                                </div>
                              </q-date>
                            </q-menu>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                              <q-time v-model="recPackageInfo.grp_endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定" color="primary" flat />
                                </div>
                              </q-time>
                            </q-menu>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class=" q-mt-sm" v-if="parseInt(recPackageInfo.grp_timeType) == 2">
                      <div class="row">
                        <q-input class="col-md-4 col-5" v-model="recPackageInfo.grp_startTime" outlined label="即日起:" dense @change="changeStartTime"> </q-input>
                        <q-select
                          class="q-ml-md col-md-4 col-5"
                          outlined
                          dense
                          emit-value
                          map-options
                          v-model="recPackageInfo.grp_endTime"
                          :options="timeOptions"
                          label="内有效"
                          placeholder="选择范围"
                        >
                        </q-select>
                      </div>

                      <div class="text-grey">
                        例:即日起, 3周内有效。
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-12 text-center">
                  <div class="col-md-2 col-12 q-pl-sm">

                     <hl-upload
                      :multiple="false"
                      :currentAttach="recPackageInfo.coverImage"
                      @input="(val)=>{ $nextTick(()=>{ recPackageInfo.grp_coverImage = val })}"
                      currentDescription="建议尺寸比例4:3"
                      currentTitle="套餐封面"
                    />

                  </div>
                </div>
                <div class="col-12 q-px-xs">
                  <hl-editor
                    @change="
                      (v) => {
                        recPackageInfo.grp_content = v
                      }
                    "
                    :content="recPackageInfo.grp_content"
                    titleText="套餐介绍"
                    :minHeight="$q.screen.height * 0.4"
                  ></hl-editor>
                </div>
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height " v-show="currentPage == '2'">
          <ag-grid-vue
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center goods-count-table full-height"
            ref="agGridTable"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="specNewsData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="50"
            :components="components"
            :gridOptions="gridOptions"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :context="context"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
          >
          </ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-py-md  q-gutter-sm text-center" :class="currentPage == '1' ? 'q-mt-xs' : 'q-mt-none'">
          <q-btn class="q-px-xl" label="提交" unelevated @click="submitData" color="primary"  :disable="addButtonDisabled" />
          <q-btn label="返回" class="q-px-xl" unelevated  :to="{ name: 'goodsCount' }" color="grey" />
        </div>
      </div>
    </q-form>
    <hl-specification-tree ref="specificationTree" v-if="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData" @closeDialog="showGoodsList = false"></hl-specification-tree>
  </q-page>
</template>

<script>
import AgButton from './AgButton'
export default {
  name: 'AddCount',
  components: {
    AgButton
  },
  data () {
    return {
      currentPage: '1',
      recPackageInfo: {
        grp_name: '',
        grp_packagePrice: '',
        grp_property: '0',
        grp_totalFrequency: '',
        grp_status: '1',
        grp_rebate: '1',
        grp_timeType: '1',
        grp_coverImage: '',
        grp_summary: '',
        grp_startTime: '',
        grp_endTime: '',
        grp_content: ''
      },
      limitOptions: this.$store.state.goodscount.limitOptions,

      specNewsData: [],
      context: null,
      components: {
        AgButton: AgButton
      },
      gridOptions: {},
      defaultColDef: {
        sortable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'grc_goodsName',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-count': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '规格名称',
          field: 'grc_speName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '共充次',
          field: 'grc_count',
          width: this.nowpx(0.1) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        { headerName: '参考价', field: 'grc_totalPrice', width: 150 },
        { headerName: '原售价', field: 'grc_originalPrice' },
        {
          headerName: '限制次数',
          field: 'grc_limitCount',
          singleClickEdit: true,
          editable: (p) => {
            return p.data.grc_limitTime != '1'
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '限制周期',
          field: 'grc_limitTime',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          cellEditorParams: {
            values: ['不限制', '年', '季度', '月', '周', '日']
          },
          valueGetter: this.changeTimeTitle,
          onCellValueChanged: this.changeTimeValue,
          cellEditor: 'agSelectCellEditor',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.08) + 'px',
          pinned: 'right'
        }
      ],

      roleOptions: this.$store.state.goodscount.roleOptions,
      showGoodsList: false,
      timeOptions: this.$store.state.goodscount.timeOptions,
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 20
      },
      uploadImgStatus: false,
      multiple: false,
      addButtonDisabled: false
    }
  },
  computed: {},
  created () {
    this.context = this
    if (this.$route.query.id > 0) {
      this.getCountGroupData()
    }
  },
  mounted () {},
  watch: {},
  methods: {
    changeStartTime () {
      if (!this.positiveIntegerReg(this.recPackageInfo.grp_startTime)) {
        this.recPackageInfo.grp_startTime = 1
      }
    },

    positiveIntegerReg (val) {
      if (val) {
        const reg = /^[1-9]\d*$/
        return reg.test(val)
      }
      return false
    },

    changeOptions () {
      if (this.recPackageInfo.grp_timeType == 2) {
        this.recPackageInfo.grp_startTime = '1'
        this.recPackageInfo.grp_endTime = '1'
      }
      if (this.recPackageInfo.grp_timeType == 3) {
        this.recPackageInfo.grp_startTime = this.$q_date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss')
        this.recPackageInfo.grp_endTime = this.$q_date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss')
      }
    },
    getCountGroupData () {
      if (this.$route.query.id > 0) {
        this.$store.dispatch('goodscount/getItem', this.$route.query.id).then((res) => {
          if (res.code == 200) {
            this.recPackageInfo = res.data
            if (res.data.grp_timeType == 3) {
              this.recPackageInfo.grp_startTime = this.$q_date.formatDate(this.recPackageInfo.grp_startTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
              this.recPackageInfo.grp_endTime = this.$q_date.formatDate(this.recPackageInfo.grp_endTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }
            this.specNewsData = res.data.rechargeDetail

            this.setTopTabel(this.specNewsData)
          }
        })
      }
    },

    submitData () {
      this.$refs.countDataRef.validate().then((success) => {
        if (success) {
          if (this.specNewsData.length <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请选择商品！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }

          if (this.recPackageInfo.grp_timeType == 1) {
            this.recPackageInfo.grp_startTime = parseInt(new Date().getTime() / 1000)
            this.recPackageInfo.grp_endTime = 2147457847
          } else if (this.recPackageInfo.grp_timeType == 3) {
            const startTime = this.$q_date.formatDate(new Date(this.recPackageInfo.grp_startTime), 'X')
            const endTime = this.$q_date.formatDate(new Date(this.recPackageInfo.grp_endTime), 'X')

            if (!startTime) {
              this.$q.notify({
                message: '注意',
                caption: '请选择开始时间！',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              return false
            }
            if (!endTime) {
              this.$q.notify({
                message: '注意',
                caption: '请选择结束时间！',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              return false
            }

            if (startTime >= endTime) {
              this.$q.notify({
                message: '注意',
                caption: '开始时间不能大于等于结束时间！',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              this.addButtonDisabled = false
              return false
            }

            this.recPackageInfo.grp_endTime = endTime
            this.recPackageInfo.grp_startTime = startTime
          } else if (this.recPackageInfo.grp_timeType == 3) {
            if (parseInt(this.recPackageInfo.grp_endTime) != 1) {
              if (parseInt(this.recPackageInfo.grp_startTime) <= 0 || !this.recPackageInfo.grp_startTime) {
                this.$q.notify({
                  message: '注意',
                  caption: '请输入相对开始时间！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })

                return false
              }
            }
          }
          this.addButtonDisabled = true
          const obj = {
            id: this.$route.query.id,
            recPackageInfo: this.recPackageInfo,
            specNewsData: this.specNewsData
          }
          this.$store
            .dispatch('goodscount/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '充次套餐信息成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })

                this.$router.push({ name: 'goodsCount' })
              } else {
                this.$q.notify({
                  message: '注意',
                  caption: '保存充次套餐信息失败！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })

                this.addButtonDisabled = false
              }
            })
            .catch((error) => {})
        }
      })
    },
    // 编辑的表格展示部分
    changeTimeTitle (p) {
      const titleIndex = _.findIndex(this.roleOptions, function (o) {
        return o.id == p.data.grc_limitTime
      })
      if (parseInt(titleIndex) >= 0) {
        return this.roleOptions[titleIndex].title
      }
    },
    // 修改的逻辑部分
    changeTimeValue (p) {
      const itemsToUpdate = []
      const data = p.data
      const roleOptions = this.roleOptions

      if (data.grc_limitTime != '不限制') {
        data.grc_limitCount = 1
      } else {
        data.grc_limitCount = 0
      }

      const titleIndex = _.findIndex(roleOptions, function (o) {
        return o.title == p.data.grc_limitTime
      })
      data.grc_limitTime = roleOptions[titleIndex].id
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[1-9][0-9]*$/
      const regu2 = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.grc_count)) {
        data.grc_count = 1
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })

        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else if (!regu2.test(data.grc_limitCount)) {
        if (data.grc_limitTime != '不限制') {
          data.grc_limitCount = 1
        } else {
          data.grc_limitCount = 0
        }
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })

        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else {
        data.grc_totalPrice = data.grc_count * data.grc_originalPrice
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
      }
      this.setTopTabel(this.specNewsData)
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      if (data) {
        if (data.length > 0) {
          this.specNewsDataBak = []
          for (let i = 0; i < data.length; i++) {
            const person = {
              id: '',
              grc_goodsName: '',
              grc_count: '',
              grc_totalCost: '',
              grc_limitCount: '',
              grc_originalPrice: '',
              grc_limitTime: '',
              grc_totalPrice: '',
              grc_speName: '',
              goods_id: '',
              spe_id: ''
            }
            person.grc_goodsName = data[i].goo_name
            person.grc_count = data[i].frequency
            person.grc_totalCost = data[i].totalCost
            person.grc_limitCount = data[i].limitTimes
            person.grc_originalPrice = data[i].goo_price
            person.grc_totalPrice = data[i].goo_price
            person.grc_limitTime = data[i].limitCycle
            person.grc_speName = data[i].specificationName
            person.goods_id = data[i].goods_id
            person.spe_id = data[i].id
            this.specNewsDataBak.push(person)
          }
          this.specNewsData = this.specNewsData.concat(this.specNewsDataBak)
          this.setTopTabel(this.specNewsData)
        }
      }
    },
    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1, 2])
        }, 500)
      })
    },

    rowSpan (params) {
      const fields = ['grc_goodsName']
      const data = this.specNewsData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]
      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
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

    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          grc_goodsName: '数据合计',
          showEdit: true,
          grc_count: '',
          grc_totalPrice: '',
          grc_originalPrice: ''
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
<style>
.goods-count-table .cell-span-goods-count {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
