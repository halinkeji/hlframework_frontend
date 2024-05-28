<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm row items-center" :class="currentPage == '1' ? 'q-mb-xs' : ''">
        <q-tabs v-model="currentPage" indicator-color="primary" class="text-grey-8 col-auto" align="left">
          <q-tab name="1" label="套餐基础" />
          <q-tab name="2" label="套餐详情" />
        </q-tabs>
        <q-space />
        <q-btn unelevated v-show="currentPage == '2'" color="primary" @click="selectGoods" label="选择商品" > </q-btn>
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white" v-show="currentPage == '1'">
         <div style="overflow-y: scroll;" class="fit full-height">
          <q-form ref="timingDataRef" class="q-gutter-md">
            <div class="row">
              <div class="col-md-6 col-12 row">
                <div class="col-md-8 col-12">
                  <q-input label="套餐名称"  outlined v-model="dataForm.gtg_name" dense lazy-rules :rules="[(val) => !!val || '套餐名称是必填的']"> </q-input>
                </div>

                <div class="col-md-8 col-12">
                  <q-input
                    label="套餐售价"
                    outlined
                    v-model="dataForm.gtg_selling_price"
                    lazy-rules
                    :rules="[(val) => !!val || '套餐售价是必填的', (val) => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(val) || '套餐售价为非负两位以内小数']"
                    dense
                  >
                  </q-input>
                </div>

                <div class="col-md-6 col-12">
                  <q-btn-toggle
                    v-model="dataForm.gtg_status"
                    spread
                    class="my-custom-toggle"
                    no-caps
                    rounded
                    unelevated
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                      { label: '正常', value: '1' },
                      { label: '停售', value: '0' },
                    ]"
                  />
                </div>

                <div class=" col-12">

                  <q-item class="full-width">
                      <q-item-section avatar>
                        <q-item-label> 有效期设置 </q-item-label>
                      </q-item-section>
                      <q-item-section>
                         <q-option-group v-model="dataForm.gtg_time_type" :options="timeStatus" @input="updateTime" color="primary" inline />
                      </q-item-section>
                    </q-item>

                  <div class=" row q-gutter-sm" v-if="dataForm.gtg_time_type == '3'">
                    <div class="col">
                      <q-input outlined v-model="dataForm.gtg_time_start" label="开始时间" dense readonly lazy-rules :error="false" >
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="dataForm.gtg_time_start" mask="YYYY-MM-DD HH:mm:ss" today-btn>
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
                            <q-time v-model="dataForm.gtg_time_start" mask="YYYY-MM-DD HH:mm:ss" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                    </div>
                    <div class="col">
                      <q-input outlined v-model="dataForm.gtg_time_end" label="结束时间" dense readonly lazy-rules :error="false" >
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                            <q-date v-model="dataForm.gtg_time_end" mask="YYYY-MM-DD HH:mm:ss" today-btn>
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
                            <q-time v-model="dataForm.gtg_time_end" mask="YYYY-MM-DD HH:mm:ss" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-menu>
                        </q-icon>
                      </template>
                    </q-input>
                    </div>

                  </div>
                  <div class="row q-gutter-sm" v-if="dataForm.gtg_time_type == '2'">
                    <div class="col">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="dataForm.gtg_time_start"
                        dense
                        lazy-rules
                        :rules="[(val) => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(val) || '请输入非负两位以内小数的数字']"
                        label="从充时开始以后"
                      >
                      </q-input>

                    </div>

                    <div class="col">

                       <q-select outlined  dense v-model="dataForm.gtg_time_end" :options="timeType" label="内有效" emit-value map-options />

                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-12 text-center">
                <div class="col-md-2 col-12 q-pl-sm">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="dataForm.coverImage"
                    @input="(val)=>{ $nextTick(()=>{ dataForm.gtg_cover_image = val })}"
                    currentDescription="建议尺寸比例4:3"
                    currentTitle="套餐封面"
                  />
                </div>
              </div>
              <div class="col-12 q-px-xs">
                <hl-editor
                  @change="
                    (v) => {
                      dataForm.gtg_description = v
                    }
                  "
                  :content="dataForm.gtg_description"
                   titleText="套餐介绍"
                   :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>
            </div>
          </q-form>
         </div>
      </div>
      <div class="col-shrink q-px-xs full-height q-pb-sm" v-show="currentPage == '2'">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="timingGoodsData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :context="context"
          :localeText="localeText"
          @first-data-rendered="adaptiveTable"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          rowSelection="multiple"
          @rowSelected="rowSelectedAg"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>

      <div class="col-shrink bg-white q-pb-md  text-center  q-gutter-sm " :class="currentPage == '1' ? 'q-mt-xs' : ''">
        <q-btn label="提交" unelevated @click="setGroupData" color="primary" class="q-px-xl" :disable="addButtonDisabled" />
        <q-btn label="返回" unelevated :to="{ name: 'timing' }" color="grey" class="q-px-xl" />
      </div>
    </div>
    <hl-specification-tree ref="specificationTree" v-if="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData" @closeDialog="showGoodsList = false"></hl-specification-tree>
  </q-page>
</template>
<script>
import AddAgButton from './components/AddAgButton.vue'
import AgSelectTime from './components/AgSelectTime.vue'
import AgSelect from './components/AgSelect.vue'
export default {
  name: 'addTiming',
  components: { AddAgButton, AgSelect, AgSelectTime },
  data () {
    return {
      currentPage: '1',
      context: '',
      multiple: false,
      showGoodsList: false,
      uploadImgStatus: false,
      addButtonDisabled: false,
      gridOptions: {},
      timingGoodsData: [],

      dataForm: {
        gtg_name: '',
        gtg_selling_price: '',
        gtg_status: '1',
        gtg_cover_image: '',
        gtg_time_start: '',
        gtg_time_end: '',
        gtg_description: '',
        gtg_time_type: '1'
      },
      timeStatus: [
        {
          label: ' 永久有效',
          value: '1'
        },
        {
          label: '相对时间',
          value: '2'
        },
        {
          label: '指定时间',
          value: '3'
        }
      ],

      timeType: [
        { label: '年', value: '1' },
        { label: '季', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '天', value: '5' }
      ],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'tgd_goods_name',
          width: this.nowpx(0.3) + 'px'
        },
        {
          headerName: '规格名称',
          field: 'tgd_spe_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '使用时长',
          field: 'tgd_time_compute_type',
          cellRendererFramework: 'AgSelect',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '售价',
          field: 'tgd_subtotal_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总时长',
          field: 'tgd_time_compute_duration',
          cellRendererFramework: 'AgSelectTime',
          width: this.nowpx(0.32) + 'px'
        },
        {
          headerName: '参考价格',
          field: 'tgd_subtotal_price',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.tgd_subtotal_price * p.data.tgd_time_compute_duration
          }
        },
        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'AddAgButton',
          width: this.nowpx(0.1) + 'px',
          pinned: 'right'
        }
      ]
    }
  },
  created () {
    this.context = this
    if (this.$route.query.id > 0) {
      this.getGroupData()
    }
  },
  computed: {},
  mounted () {},

  methods: {
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    // 更新有效期格式
    updateTime () {
      if (this.dataForm.gtg_time_type == 3) {
        this.dataForm.gtg_time_start = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
        this.dataForm.gtg_time_end = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
      } else if (this.dataForm.gtg_time_type == 2) {
        this.dataForm.gtg_time_start = '1'
        this.dataForm.gtg_time_end = '1'
      }
    },
    getGroupData () {
      if (this.$route.query.id > 0) {
        this.$store.dispatch('goodsTiming/getItemData', this.$route.query.id).then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data

            if (res.data.gtg_time_type == 3) {
              this.dataForm.gtg_time_start = this.$q_date.formatDate(this.dataForm.gtg_time_start * 1000, 'YYYY-MM-DD  HH:mm:ss')
              this.dataForm.gtg_time_end = this.$q_date.formatDate(this.dataForm.gtg_time_end * 1000, 'YYYY-MM-DD  HH:mm:ss')
            }
            this.timingGoodsData = res.data.detail
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
      }
    },

    setGroupData () {
      this.$refs.timingDataRef.validate().then((success) => {
        if (this.timingGoodsData.length <= 0) {
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
        if (success) {
          this.addButtonDisabled = true
          if (this.dataForm.gtg_time_type == '1') {
            this.dataForm.gtg_time_start = parseInt(new Date().getTime() / 1000)
            this.dataForm.gtg_time_end = 2147457847
          } else if (this.dataForm.gtg_time_type == '3') {
            const startTime = this.$q_date.formatDate(new Date(this.dataForm.gtg_time_start), 'X')
            const endTime = this.$q_date.formatDate(new Date(this.dataForm.gtg_time_end), 'X')
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
            this.dataForm.gtg_time_end = endTime
            this.dataForm.gtg_time_start = startTime
          }

          this.addButtonDisabled = true
          const obj = {
            id: this.$route.query.id,
            ...this.dataForm,
            detailData: this.timingGoodsData
          }
          this.$store.dispatch('goodsTiming/setData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '计时套餐信息成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })

              this.$router.push({ name: 'timing' })
            } else {
              this.addButtonDisabled = false
              this.$q.notify({
                message: '注意',
                caption: '保存计时套餐信息失败！',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            }
          })
        }
      })
    },

    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      if (data) {
        if (data.length > 0) {
          this.goodsData = []
          for (let i = 0; i < data.length; i++) {
            const person = {
              id: '',
              tgd_goods_name: '',
              tgd_subtotal_price: '',
              tgd_spe_name: '',
              tgd_goods_id: '',
              tgd_spe_id: '',
              tgd_time_compute_type: '1',
              tgd_time_compute_duration: '0',
              tgd_time_compute_model: '7',
              tgd_time_compute_number: '1'
            }
            person.tgd_goods_name = data[i].goo_name
            person.tgd_subtotal_price = data[i].goo_price
            person.tgd_spe_name = data[i].specificationName
            person.tgd_goods_id = data[i].goods_id
            person.tgd_spe_id = data[i].id
            this.goodsData.push(person)
          }
          this.timingGoodsData = this.timingGoodsData.concat(this.goodsData)
        }
      }
    },

    selectGoods () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(2)
        }, 500)
      })
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
