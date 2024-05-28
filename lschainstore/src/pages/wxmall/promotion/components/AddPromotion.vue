<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
         width: parseInt(this.$q.screen.width * 1) + 'px',
        'max-width': parseInt(this.$q.screen.width * 1) + 'px',
        height: parseInt(this.$q.screen.width * 1) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}促销活动</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="newsDataRef" class="q-gutter-md">
              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="q-pa-xs">
                  <div class="text-subtitle2">基本信息</div>
                </div>
                <q-separator />
              <div class="row q-mt-sm">
                <div class="col-12 col-md-4">
                <q-input
              outlined
              dense
              v-model="infoData.wpi_sort"
              label="排序:数字越小，排序越靠前"
              lazy-rules
              :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']" />
                </div>
                <div class="col-12 col-md-4 q-px-lg">
                <q-input
                  outlined
                  dense
                  v-model="infoData.wpi_name"
                  label="促销名称*"
                  :rules="[(val) => !!val || '促销名称是必填项']" />
                </div>
                <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      outlined
                      v-model="infoData.wpi_status"
                      map-options
                      emit-value
                      dense
                      option-label="label"
                      option-value="value"
                      :options="[
                        {
                          label: '开启',
                          value: '1',
                        },
                        {
                          label: '关闭',
                          value: '0',
                        },
                      ]"
                      :rules="[(val) => !!val || '状态是必填项']"
                      label="方案状态"
                    />
                  </div>
              </div>
              <div class="row q-mt-xs">
                  <div class="col-md-12 col-12">
                    <q-input outlined bottom-slots v-model="infoData.wpi_remark" dense :rows="2" label="促销摘要" type="textarea"></q-input>
                  </div>
                </div>
              </q-card>
              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="q-pa-xs">
                  <div class="text-subtitle2">促销限制</div>
                </div>
                <q-separator />
                <div class="row q-mt-sm items-center">
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-input outlined class="q-my-sm" v-model="startTime" label="开始时间" dense square readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-menu>
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
                      <template v-slot:hint> 选择促销开始时间 </template>
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12 q-px-lg">
                    <q-input class="q-my-sm" outlined v-model="endTime" label="结束时间" dense square readonly>
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="关闭" color="primary" flat />
                              </div>
                            </q-date>
                          </q-menu>
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
                      <template v-slot:hint> 选择促销结束时间 </template>
                    </q-input>
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-md-12 col-12 q-px-lg">
                    <span>限制级别</span>
                    <q-option-group v-model="leve_limit" :options="memberCardLevelDatas" color="primary" inline type="checkbox" dense />
                  </div>
                </div>
              </q-card>
              <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
                <div class="q-pa-xs">
                  <div class="text-subtitle2">促销范围</div>
                </div>
                <q-separator />
                <div class="row q-mt-sm">
                  <div class="col-12 col-md-4">
                <q-input
                 outlined
                 dense
                 v-model="infoData.wpi_meet_amount"
                 label="满多少元可以使用"
                 lazy-rules
                 :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
                  />
                </div>
                 <div class="col-md-4 col-12 q-px-lg">
                    <q-select
                      outlined
                      v-model="infoData.wpi_type"
                      map-options
                      emit-value
                      dense
                      option-label="label"
                      option-value="value"
                      :options="[
                        {
                          label: '满减',
                          value: '1',
                        },
                        {
                          label: '折扣',
                          value: '2',
                        },
                      ]"
                      label="促销方式"
                    />
                   </div>
                  <div class="col-12 col-md-4" v-if="infoData.wpi_type == '1'">
                     <q-input
                        outlined
                        dense
                        v-model="infoData.wpi_discount_amount"
                        label="减免金额"
                        lazy-rules
                       :rules="[(val) => !!val || '减免金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '减免金额为非负两位以内小数']"
                       />
                  </div>
                  <div class="col-12 col-md-4" v-if="infoData.wpi_type == '2'">
                     <q-input
                      outlined
                      dense
                      v-model="infoData.wpi_discount"
                      label="折扣"
                      lazy-rules
                      :rules="[(val) => !!val || '折扣', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '折扣为非负两位以内小数']"

                      />
                   </div>
                 </div>
                 <div class="row q-col-gutter-x-xs q-col-gutter-y-lg text-center">
                  <span>折扣范围：</span>
                  <q-radio dense v-model="infoData.wpi_model" val="all"   label="全场"/>
                  <q-radio dense v-model="infoData.wpi_model" val="goods" label="商品" />
                </div>

                <div class="q-gutter-x-xs row" v-if="infoData.wpi_model == 'goods'">
                    <div class="col-12 col-md-8 q-mr-xs">
                      <q-btn
                        color="primary"
                        class="q-ma-sm"
                        @click="chooseWxgoods"
                        unelevated
                        label="选择商品"
                      />
                      <q-btn
                        :disabled="dataListSelections.length > 0 ? false : true"
                        @click="delGoodsRow"
                        v-if="authorityMeta('bind')"
                        color="red"
                        class="col-12 col-md-1"
                        unelevated
                        label="批量删除"
                      />
                    </div>
                  </div>
                  <div class="col-shrink q-px-xs q-py-none bg-grey-2" style="height: 400px; min-height: 400px" v-if="infoData.wpi_model == 'goods'" >
                    <ag-grid-vue
                      ref="agGridTable"
                      :gridOptions="gridOptions"
                      class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                      :columnDefs="columnDefs"
                      :suppressMovableColumns="true"
                      :rowData="detailData"
                      rowSelection="multiple"
                      @first-data-rendered="onFirstDataRendered"
                      rowHeight="40"
                      :rowDragManaged="true"
                      colResizeDefault="shift"
                      :animateRows="false"
                      :floatingFilter="false"
                      :enableCharts="true"
                      :enableRangeSelection="true"
                      :enableCellTextSelection="true"
                      :suppressRowTransform="true"
                      :suppressCellSelection="true"
                      :suppressRowClickSelection="true"
                      :rowMultiSelectWithClick="true"
                      :singleClickEdit="true"
                      :stopEditingWhenGridLosesFocus="true"
                      :localeText="localeText"
                      :context="context"
                      @rowSelected="rowSelectedAg"
                      @gridReady="onFirstDataRendered"
                    ></ag-grid-vue>
                  </div>
                </q-card>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
    <choose-wxmall-goods v-if="chooseVisible" ref="chooseWxgoodsList" @getChooseGoods="receivingAdministrator" @closeChooseGoods="closeChooseGoods"></choose-wxmall-goods>
  </q-dialog>
</template>

<script>
import ChooseWxmallGoods from './ChooseWxmallGoods.vue'
import AgButton from './AgButton.vue'
export default {
  name: 'AddMessage',
  components: {
    ChooseWxmallGoods,
    AgButton
  },
  data () {
    return {
      addStoreSidebar: false,
      chooseVisible: false,
      dataId: 0,
      infoData: {
        wpi_sort: '',
        wpi_name: '',
        wpi_model: 'all',
        wpi_type: '1',
        wpi_status: '1',
        wpi_remark: '',
        wpi_meet_amount: '',
        wpi_discount_amount: '',
        wpi_discount: ''
      },
      leve_limit: [],
      startTime: '',
      endTime: '',
      stop: false,
      memberCardLevelDatas: [
        {
          value: 'all',
          label: '不限',
          id: 0
        }
      ],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.01) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'wpd_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '售价',
          field: 'wpd_price',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.08) + 'px'
        }
      ],
      detailData: [],
      dataListSelections: [],
      context: '',
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getLevel()
    this.context = this
  },
  methods: {
    getLevel () {
      this.$store.dispatch('level/getAllData').then((res) => {
        if (res.code == 200) {
          const data = res.data

          if (data) {
            if (data.length > 0) {
              this.specNewsDataBak = []
              for (let i = 0; i < data.length; i++) {
                const person = {
                  value: '',
                  label: '',
                  id: ''
                }
                person.label = data[i].mcl_level_name
                person.value = 'level_' + data[i].id
                person.id = data[i].id
                this.specNewsDataBak.push(person)
              }
              this.memberCardLevelDatas = this.memberCardLevelDatas.concat(this.specNewsDataBak)
            }
          }
        }
      })
    },
    init (id) {
      this.dataId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.$store.dispatch('wxMallPromotion/getItem', id).then((res) => {
          if (res.code == 200) {
            this.infoData = res.data
            this.detailData = res.data.detail ? res.data.detail : []
            if (res.data.wpi_level) {
              this.leve_limit = res.data.wpi_level.split(',')
            }
            this.startTime = this.$q_date.formatDate(res.data.wpi_start_time * 1000, 'YYYY-MM-DD')
            this.endTime = this.$q_date.formatDate(res.data.wpi_end_time * 1000, 'YYYY-MM-DD')
          }
        })
      }
    },
    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          const infoData = this.infoData
          if (this.startTime) {
            infoData.wpi_start_time = this.$q_date.formatDate(this.startTime, 'X')
          } else {
            infoData.wpi_start_time = this.$q_date.formatDate(new Date(), 'X')
          }
          if (this.endTime) {
            infoData.wpi_end_time = this.$q_date.formatDate(this.endTime, 'X')
          } else {
            infoData.wpi_end_time = this.$q_date.formatDate(new Date(), 'X')
          }
          this.infoData.wpi_level = this.leve_limit

          if (infoData.wpi_end_time <= infoData.wpi_start_time) {
            this.$q.notify({
              message: '失败',
              caption: '结束时间不得大于等于开始时间,请重新选择',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            this.buttonDisable = false
            return false
          }
          this.stop = true
          this.addStoreSidebar = false
          const obj = {
            ...this.infoData,
            detailData: this.detailData,
            id: this.dataId
          }
          this.$store
            .dispatch('wxMallPromotion/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '促销规则成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: 'Error',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.stop = false
            })
        }
      })
    },
    hideNowPage () {
      this.$emit('getMethods')
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
    // 选择商品
    chooseWxgoods () {
      this.chooseVisible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.chooseWxgoodsList.getGoodsData()
        }, 500)
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val) {
        console.log(val)
        if (val.length > 0) {
          this.specNewsDataBak = []
          for (let i = 0; i < val.length; i++) {
            const person = {
              id: '',
              wpd_name: '',
              wpd_price: '',
              wpd_goods_id: ''
            }
            person.wpd_name = val[i].wg_name
            person.wpd_price = val[i].wg_price
            person.wpd_goods_id = val[i].id
            this.specNewsDataBak.push(person)
          }
          this.detailData = this.detailData.concat(this.specNewsDataBak)
        }
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    // 关闭
    closeChooseGoods () {
      this.chooseVisible = false
    },
    delGoodsRow () {
      const selRows = this.gridOptions.api.getSelectedNodes() // 获取选中的行
      if (selRows.length > 0) {
        const obj = selRows.map((item) => {
          return item.childIndex
        })
        this.detailData.splice(obj, 1)
      }
      this.dataListSelections = []
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
