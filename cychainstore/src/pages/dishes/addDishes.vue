<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="基础信息" />
          <q-tab name="2" label="规格/价格" />
          <q-tab name="attributes" label="属性设置" />
        </q-tabs>
      </div>

      <div class="col-shrink  full-height q-mt-xs">
        <div style="overflow-y: scroll;" class="fit full-height bg-white q-pa-sm">
          <q-form ref="dishesRef">
            <div v-show="tab == '1'" class="fit">
              <div class="row q-mb-xs q-col-gutter-sm">
                <div class="col-12 col-md-6 ">
                  <q-input
                    outlined
                    dense
                    class="full-width"
                    :disable="mainStoreDisable"
                    v-model="dishesData.goo_name"
                    label="菜品名称"
                    :rules="[(val) => !!val || '请输入菜品名称']"
                  >
                    <template v-slot:after>
                      <q-btn
                        unelevated
                        color="primary"
                        dense
                        class="full-height q-px-md"
                        @click="oneKeyGenerateJianCode()"
                        label="一键生成简码与助记码"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6 ">
                  <q-input outlined dense v-model="dishesData.goo_code" :disable="mainStoreDisable" label="编码" lazy-rules :rules="[(val) => !!val || '请输入编码']">
                    <template v-slot:after>
                      <q-btn unelevated color="primary" dense class="full-height q-px-xl" @click="oneKeyCoding()" label="一键生成编码" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6 ">
                  <q-input outlined dense v-model="dishesData.goo_nick" :disable="mainStoreDisable" label="简称" />
                </div>

                <div class="col-12 col-md-6 ">
                  <q-input outlined dense v-model="dishesData.goo_pinYin" :disable="mainStoreDisable" label="助记码" lazy-rules :rules="[(val) => !!val || '请输入助记码']" />
                </div>

                <div class="col-12 col-md-3 ">
                  <q-input
                    outlined
                    dense
                    v-model="dishesData.goo_sort"
                    label="排序"
                    lazy-rules
                    :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
                    :disable="mainStoreDisable"
                  />
                </div>

                <div class="col-12 col-md-3 ">
                  <q-select
                    outlined
                    dense
                    v-model="dishesData.goodsTypeId"
                    :options="dishesTypeList"
                    label="请选择菜品分类"
                    option-value="id"
                    option-label="gt_name"
                    emit-value
                    map-options
                    :disable="mainStoreDisable"
                  />
                </div>
                <div class="col-12 col-md-3 ">
                  <q-select outlined dense v-model="dishesData.fl_status" :options="statusOptions" label="状态" emit-value map-options />
                </div>

                <div class="col-12 col-md-6">
                  <q-card bordered flat>
                    <q-card-section class="text-subtitle2 text-center">单据标签</q-card-section>
                    <q-separator />
                    <q-card-section horizontal class="items-center">
                      <q-card-section class="q-py-sm">
                        分单
                      </q-card-section>
                      <q-separator vertical />
                      <div v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                        <div v-for="(item, k) in printerList" :key="k">
                          <q-checkbox v-model="dishesData.fl_seperate_order_printer" :val="item.id" />{{ item.ps_name }}
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section horizontal class="items-center">
                      <q-card-section class="q-py-sm">
                        退单
                      </q-card-section>
                      <q-separator vertical />
                      <div v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                        <div v-for="(item, k) in printerList" :key="k">
                          <q-checkbox v-model="dishesData.fl_refund_order_printer" :val="item.id" />{{ item.ps_name }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-2">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="dishesData.coverImage"
                    @input="(val)=>{ $nextTick(()=>{ dishesData.goo_cover_image = val })}"
                    currentDescription="建议尺寸比例1:1"
                    currentTitle="封面图"
                  />
                </div>

                <div class="row col-md-4">
                  <hl-upload
                    :multiple="true"
                    :maxTotal="5"
                    :currentAttach="dishesData.loopImage"
                    @input="(val)=>{ $nextTick(()=>{ dishesData.goo_loop_image = val })}"
                    currentDescription="建议尺寸比例1:1"
                    currentTitle="详情图"
                  />
                </div>

                <div class="col-12">
                  <hl-editor
                    :content="dishesData.goo_description"
                    @change="
                      (content) => {
                        dishesData.goo_description = content;
                      }
                    "
                    :minHeight="$q.screen.height * 0.4"
                    titleText="详情"
                  ></hl-editor>
                </div>

              </div>

              <!-- <div class="row q-mb-xs">
                <div class="col-12 col-md-6 ">
                  <q-input outlined dense v-model="dishesData.goodsUnit_id" label="单位" :rules="[(val) => !!val || '请输入菜品单位']" />
                </div>
              </div> -->
            </div>

            <div v-show="tab == '2'" class="fit">
              <spec-set ref="specSetComponents" @setSpecData="setSpecData" ></spec-set>
            </div>

            <div v-show="tab == 'attributes'" class="fit">
              <attributes-set ref="attributesSetComponents" @setAttributesData="setAttributesData" />
            </div>

          </q-form>
        </div>
      </div>

      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
        <q-btn unelevated label="返回" class="q-px-xl" color="grey" :to="{ name: 'dishes' }" />
      </div>
    </div>
  </q-page>
</template>
<script>
import toPinYin from 'pinyin4js'
import SpecSet from './SpecSet'
import AttributesSet from './AttributesSet'
import MaterialSet from './MaterialSet'

import { LocalStorage } from 'quasar'
export default {
  name: 'addDishes',
  components: {
    SpecSet,
    AttributesSet,
    MaterialSet
  },
  data () {
    return {
      addButtonDisabled: false,
      tab: '1',
      dishesData: {
        goo_name: '',
        goodsTypeId: '',
        pdi_peopleNumber: '',
        goo_sort: '0',
        fl_status: '1',
        goo_listPrice: '',
        goodsUnit_id: '',
        fl_cost_price: 0,
        goo_nick: '',
        goo_size: '2',
        fl_is_member_level_price: '-1',
        fl_is_limit_time: '-1',
        fl_stock_status: '-1',
        fl_is_packages: '0',
        goo_pinYin: '',
        goo_code: '',
        goo_cover_image: '',
        goo_loop_image: [],
        goo_description: '',
        goo_goodsOrService: '',
        fl_seperate_order_printer: [],
        fl_refund_order_printer: []
      },
      priceData: [],

      limitTimeDiscount: [],
      listsData: [],
      stockData: [],
      printerList: [],

      statusOptions: [
        { label: '上架', value: '1' },
        { label: '下架', value: '-1' }
      ],

      dishesTypeList: [],
      specMain: [], // 规格
      attributesData: [], // 属性
      mainMaterialData: []
    }
  },
  created () {
    this.getPrinterList()
    this.getDishesTypeList()
  },
  mounted () {
    if (this.$route.query.id > 0) {
      this.init(this.$route.query.id)
    }
  },
  computed: {
    mainStoreDisable () {
      // 默认可以正常编辑
      // 总部权限可以编辑
      // 自己添加的可以编辑
      const acccountInfo = LocalStorage.getItem('cychainstore_account_info')
      if (parseInt(acccountInfo.lib_id) == parseInt(acccountInfo.store_id)) {
        return false
      } else if (parseInt(acccountInfo.store_id) == parseInt(this.dishesData.store_id)) {
        return false
      } else {
        if (this.dishesData && this.dishesData.id) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    getDishesTypeList () {
      this.$store
        .dispatch('dishes/getTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.dishesTypeList = res.data ? res.data : []
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

    // 汉字转拼音，且获取拼音首字母大写
    oneKeyGenerateJianCode () {
      const chinaVal = this.dishesData.goo_name
      if (chinaVal) {
        this.dishesData.goo_nick = chinaVal.substr(0, 6)
        this.dishesData.goo_pinYin = toPinYin
          .convertToPinyinString(chinaVal, '', toPinYin.FIRST_LETTER)
          .toUpperCase()
          .substr(0, 6)
      } else {
        this.$q.notify({
          message: '注意',
          caption: '错误！菜品名称未填写！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
    },
    oneKeyCoding () {
      this.dishesData.goo_code = String(new Date().getTime())
    },
    getMemberPrice (priceData) {
      this.priceData = priceData
    },
    getFoodsLists (foodsLists) {
      this.listsData = foodsLists
    },
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('dishes/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.dishesData = res.data ? res.data : {}
              this.$refs.specSetComponents.setCurrentDishes(this.dishesData)
              this.$refs.attributesSetComponents.setCurrentDishes(this.dishesData)
              this.$refs.attributesSetComponents.setCurrentSpecification(this.dishesData.foodAttributes)
            } else {
              this.$q.notify({
                message: '失败',
                caption: '操作失败',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
      }
    },
    setData () {
      this.$refs.dishesRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          this.dishesData.goo_size = this.$refs.specSetComponents.dishesData.goo_size
          this.dishesData.goo_goodsOrService = this.$refs.specSetComponents.dishesData.goo_goodsOrService
          this.dishesData.fl_is_member_level_price = this.$refs.specSetComponents.dishesData.fl_is_member_level_price
          this.dishesData.fl_is_material = this.$refs.specSetComponents.dishesData.fl_is_material
          this.dishesData.fl_is_limit_time = this.$refs.attributesSetComponents.dishesData.fl_is_limit_time
          this.dishesData.fl_limit_set = this.$refs.attributesSetComponents.limitTimeDiscount

          if (parseInt(this.dishesData.goo_size) != 1 && parseInt(this.dishesData.fl_is_member_level_price) == 1) {
            this.dishesData.fl_level_price = this.$refs.specSetComponents.flLevelPrice
          } else if (parseInt(this.dishesData.goo_size) != 1 && parseInt(this.dishesData.fl_is_material) == 1) {
            this.mainMaterialData = this.$refs.specSetComponents.mainMaterialData
          } else if (parseInt(this.dishesData.goo_size) == 1) {
            this.specMain = this.$refs.specSetComponents.specMain
          } else {
            this.dishesData.goo_listPrice = this.$refs.specSetComponents.dishesData.goo_listPrice
            this.dishesData.goo_purchasePrice = this.$refs.specSetComponents.dishesData.goo_purchasePrice
          }

          const params = {
            ...this.dishesData,
            specMain: this.specMain,
            attributesData: this.attributesData,
            mainMaterialData: this.mainMaterialData
          }

          if (parseInt(this.dishesData.goo_goodsOrService) == 3) {
            params.packageData = this.$refs.specSetComponents.packageData
          }

          this.$store
            .dispatch('dishes/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dishesData.id > 0 ? '修改' : '新增'}` + '菜品成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({ name: 'dishes' })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
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
        }
      })
    },
    setSpecData (value) {
      this.specMain = value
    },

    setAttributesData (value) {
      this.attributesData = value
    },
    getPrinterList () {
      this.$store
        .dispatch('cloudprinter/getDataList')
        .then((res) => {
          if (res.code == 200) {
            this.printerList = res.data ? res.data : []
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
    }

  }
}
</script>
