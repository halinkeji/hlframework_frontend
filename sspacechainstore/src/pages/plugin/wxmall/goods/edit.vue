<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs v-model="malltab" indicator-color="primary" class="text-grey-8" align="left" dense>
          <q-tab name="1" label="商品信息" />
          <q-tab name="3" :disable="!goodsForm.id" label="价格设置" />
          <q-tab name="2" :disable="!goodsForm.id" label="商品详情" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height q-mt-xs bg-white">
        <div style="overflow-y: scroll" class="fit full-height">
          <q-form class="q-pa-sm" ref="addWxmallGoodsRef">
            <div class="row q-col-gutter-sm" v-show="parseInt(malltab) == 1">
              <div class="col-12 col-md-12">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  bottom-slots
                  :disable="!!wxmallGoodsId"
                  v-model="goodsForm.wg_attribute"
                  :options="$store.state.wxMallGoods.attributeDataList"
                  label="商品属性"
                />
              </div>

              <div
                class="col-12 col-md-12"
                v-if="goodsForm.wg_attribute == 'goods' || goodsForm.wg_attribute == 'service' || goodsForm.wg_attribute == 'package'"
              >
                <q-input label="绑定商品名称" class="q-mb-md" readonly outlined v-model="goodsForm.goods.goo_name" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择商品库" unelevated @click="selectBut" v-if="!wxmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12" v-if="goodsForm.wg_attribute == 'count'">
                <q-input label="绑定次卡" class="q-mb-md" readonly outlined v-model="goodsForm.recharg.grp_name" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择次卡" unelevated @click="addGroupCountSelectGoods" v-if="!wxmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12" v-if="goodsForm.wg_attribute == 'time'">
                <q-input label="绑定时卡" class="q-mb-md" readonly outlined v-model="goodsForm.time.gtg_name" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择时卡" unelevated @click="showSelectGoods" v-if="!wxmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12" v-if="goodsForm.wg_attribute == 'coupon'">
                <q-input label="绑定卡券" class="q-mb-md" readonly outlined v-model="goodsForm.coupon.cou_title" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择卡券" unelevated @click="showCoupon" v-if="!wxmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12">
                <q-input
                  label="商城商品名称"
                  outlined
                  v-model="goodsForm.wg_name"
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '商城商品名称是必填的']"
                >
                </q-input>
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="排序"
                  outlined
                  v-model="goodsForm.wg_sort"
                  dense
                  lazy-rules
                  :rules="[(val) => /^\d+$/.test(val) || '排序为非负整数']"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="goodsForm.wg_status"
                  :options="stateOptions"
                  label="状态"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="id"
                  option-label="wt_name"
                  emit-value
                  map-options
                  v-model="goodsForm.wg_type_id"
                  :options="typeData"
                  label="商品分类"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="goodsForm.wg_tag"
                  :options="topOptions"
                  label="商品活动属性"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="id"
                  option-label="wl_name"
                  emit-value
                  map-options
                  multiple
                  use-chips
                  v-model="goodsForm.wg_label_id"
                  :options="labelData"
                  label="商品标签"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="id"
                  option-label="wl_name"
                  emit-value
                  map-options
                  multiple
                  use-chips
                  v-model="goodsForm.wg_serve_id"
                  :options="serviceData"
                  label="商品服务"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  emit-value
                  map-options
                  option-value="id"
                  option-label="wft_name"
                  v-model="goodsForm.wg_freight_template_id"
                  :rules="[(val) => !!val || '请选择运费绑定模板']"
                  :options="freightData"
                  dense
                  label="绑定运费模板"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input label="真实出售" outlined v-model="goodsForm.wg_sell_number" dense :disable="true" :error="false" />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="虚拟出售"
                  outlined
                  v-model="goodsForm.wg_fake_sell_number"
                  dense
                  lazy-rules
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '虚拟出售为非负整数']"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="总限购数量"
                  outlined
                  v-model="goodsForm.wg_total_limit_number"
                  dense
                  lazy-rules
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '总限购数量为非负整数']"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="单人限购数量"
                  outlined
                  v-model="goodsForm.wg_one_limit_number"
                  dense
                  lazy-rules
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '每人限购数量为非负整数']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm" v-show="parseInt(malltab) == 2">
              <div class="col-12 col-md-6">
                <hl-upload
                  :multiple="false"
                  :currentAttach="goodsForm.coverImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        goodsForm.wg_cover_image = val;
                      });
                    }
                  "
                  currentDescription="建议尺寸比例1:1"
                  currentTitle="封面图"
                />
              </div>

              <div class="col-12 col-md-6">
                <hl-upload
                  :multiple="true"
                  :maxTotal="5"
                  :currentAttach="goodsForm.loopImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        goodsForm.wg_loop_image = val;
                      });
                    }
                  "
                  currentDescription="建议尺寸比例1:1"
                  currentTitle="详情图"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input outlined v-model="goodsForm.wg_description" dense type="textarea" rows="2" label="商品简介" :error="false" />
              </div>
              <div class="col-12">
                <hl-editor
                  class="q-px-sm"
                  @change="
                    (v) => {
                      goodsForm.wg_content = v;
                    }
                  "
                  :content="goodsForm.wg_content"
                  titleText="商品详情"
                  :minHeight="$q.screen.height * 0.4"
                >
                </hl-editor>
              </div>
            </div>

            <div class="row q-col-gutter-sm" v-show="parseInt(malltab) == 3">
              <div class="col-12 col-md-4">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="goodsForm.wg_is_member_price"
                  :options="statusOption"
                  label="是否开启会员价"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  label="商城售价"
                  outlined
                  v-model="goodsForm.wg_price"
                  dense
                  lazy-rules
                  :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确商城售价']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  label="标价"
                  outlined
                  v-model="goodsForm.wg_list_price"
                  dense
                  lazy-rules
                  :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确标价']"
                />
              </div>

              <div class="col-9" v-if="parseInt(goodsForm.wg_is_member_price) == 1 && goodsForm.goodsLevelPriceData && goodsForm.goodsLevelPriceData.length > 0">
                <q-markup-table border="1" separator="cell" flat bordered>
                  <thead>
                    <tr>
                      <th class="text-center">等级</th>
                      <th class="text-center">会员价</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, key) in goodsForm.goodsLevelPriceData" :key="key">
                      <td class="text-center full-height table_td_border">
                         {{ item.mcl_level_name }}
                      </td>
                      <td class="text-center full-height table_td_border">
                         <q-input v-model="item.wmp_member_price" outlined bottom-slots dense> </q-input>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>

              <div class="col-9" v-if="parseInt(goodsForm.wg_is_member_price) == 1 && goodsForm.specPriceData && goodsForm.specPriceData.length > 0">
                <q-markup-table border="1" separator="cell" flat bordered>
                  <thead>
                    <tr>
                      <th class="text-center" v-for="(item, key) in goodsForm.specPriceHeaderData">{{ item.value }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, key) in goodsForm.specPriceData" :key="key">
                      <td
                        v-if="showRow(i, key, item)"
                        :rowspan="rowSpan(i, key, item)"
                        class="text-center full-height table_td_border"
                        v-for="(i, k) in goodsForm.specPriceHeaderData"
                      >
                        <div v-if="parseInt(i.type) == 1">
                          {{ item[i.field] }}
                        </div>
                        <div v-else-if="parseInt(i.type) == 2">
                          <q-input v-model="item[i.field]" outlined bottom-slots dense> </q-input>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>

              <!-- <div
                class="col-12 row q-col-gutter-sm"
                v-if="parseInt(goodsForm.wg_is_member_price) == 1 && goodsForm.specPriceData && goodsForm.specPriceData.length > 0"
              >
                <div class="col-3 q-pa-xs" v-for="(item, key) in goodsForm.specPriceData" :key="key">
                  <q-card flat bordered>
                    <q-card-section class="q-pa-xs">
                      <q-item>
                        <q-item-section>
                          <q-item-label overline>{{ item.main_lable }}</q-item-label>
                          <q-item-label class="text-center">{{ item.lable }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="row q-pa-xs">
                      <div class="col-12" v-if="item.chil && item.chil.length > 0">
                        <spec-show :specPriceData="item.chil" />
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div> -->
            </div>
          </q-form>
        </div>
      </div>

      <hl-goods-table
        ref="specificationTree"
        v-if="showGoodsList"
        @getSelectedGoodsData="getSelectedGoodsData"
        @closeDialog="showGoodsList = false"
      ></hl-goods-table>

      <div class="col-shrink q-mt-xs bg-white q-pb-md q-gutter-sm text-center">
        <q-btn unelevated color="green" class="q-px-xl" label="下一步" @click="saveData('next')" v-if="!goodsForm.id" :disable="disableButton" />
        <q-btn unelevated color="primary" class="q-px-xl" label="保存" v-else @click="saveData('save')" :disable="disableButton" />
        <q-btn unelevated color="grey" label="返回" :to="{ name: 'wxmallGoods' }" class="q-px-xl" />
      </div>
      <select-coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
      <hl-select-time-group ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup" />
      <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"> </hl-select-count-group>
    </div>
  </q-page>
</template>
<script>
import SelectCoupon from 'src/pages/plugin/hlcoupon/components/SelectCoupon.vue'

import SpecShow from './SpecShow.vue'

export default {
  components: {
    SpecShow,
    SelectCoupon
  },

  data () {
    return {
      malltab: '1',
      disableButton: false,
      ifMultiple: false,
      multiple: false,
      uploadContentStatus: false,
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      labelData: [],
      serviceData: [],
      stateOptions: [
        {
          label: '上架',
          value: '1'
        },
        {
          label: '下架',
          value: '2'
        }
      ],
      ifFree: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ],
      statusOption: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '0'
        }
      ],
      goodsForm: {
        wg_status: '1',
        wg_name: '',
        wg_type_id: '',
        wg_tag: '',
        wg_label_id: [],
        wg_serve_id: [],
        wg_sort: '0',
        wg_if_free_haul: '1',
        wg_list_price: '',
        wg_price: '',
        wg_total_limit_number: '0',
        wg_total_limit_number_oneuser: '0',
        wg_cover_image: '',
        wg_loop_image: [],
        wg_description: '',
        wg_content: '',
        wg_fake_sell_number: '0',
        wg_one_limit_number: '0',
        goods_id: 0,
        id: 0,
        wg_sell_number: '',
        goods: {},
        recharg: {},
        time: {},
        coupon: {},
        wg_is_member_price: '0',
        wg_attribute: 'goods'
      },

      freightData: [],
      typeData: [],
      showGoodsList: false,
      formatStatus: false,
      mainGoodsId: 0,
      wxmallGoodsId: 0,
      topOptions: this.$store.state.wxMallGoods.topOptions
    }
  },
  mounted () {
    if (this.$route.query.wxmallGoodsId) {
      this.wxmallGoodsId = this.$route.query.wxmallGoodsId
      this.getItem()
    }
  },
  created () {
    this.getFreightData()
  },
  computed: {},
  methods: {
    getFreightData () {
      this.$store.dispatch('wxMallSetting/getConfig').then((res) => {
        if (res.code == 200) {
          this.typeData = res.data && res.data.typeData ? res.data.typeData : []
          this.freightData = res.data && res.data.freightData ? res.data.freightData : []
          this.serviceData = res.data && res.data.serviceData ? res.data.serviceData : []
          this.labelData = res.data && res.data.labelData ? res.data.labelData : []
        }
      })
    },

    // 获取单条
    getItem () {
      this.$store
        .dispatch('wxMallGoods/getItem', { id: this.wxmallGoodsId })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.goodsForm = res.data
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
    saveData (type) {
      // if (!(this.goodsForm.goods_id > 0)) {
      //   this.$q.notify({
      //     message: '失败',
      //     caption: '未找到绑定商品',
      //     icon: 'ion-close-circle-outline',
      //     timeout: 500,
      //     position: 'top-right',
      //     color: 'red'
      //   })
      //   return false
      // }
      this.$refs.addWxmallGoodsRef.validate().then((success) => {
        if (success) {
          this.disableButton = true
          const obj = {
            ...this.goodsForm
          }
          this.$store
            .dispatch('wxMallGoods/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.goodsForm.id ? '修改' : '新增'}微信商品成功`,
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                if (type == 'save') {
                  this.$router.push({ name: 'wxmallGoods' })
                } else {
                  this.wxmallGoodsId = res.data.id
                  this.malltab = '3'
                  this.$nextTick(() => {
                    this.getItem()
                  })
                }
              }
              this.disableButton = false
            })
            .catch((error) => {
              this.disableButton = false
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },

    // 选择商品
    selectBut () {
      this.showGoodsList = true
      var type = 1
      if (this.goodsForm.wg_attribute == 'goods') {
        var type = 1
      } else if (this.goodsForm.wg_attribute == 'service') {
        var type = 2
      } else {
        var type = 3
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([type])
        }, 500)
      })
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      if (data) {
        this.$store
          .dispatch('wxMallGoods/verifyGoods', { wxmallGoodsId: data.id })
          .then((res) => {
            if (res.code == 200) {
              this.showGoodsList = status

              this.goodsForm = {
                wg_attribute: this.goodsForm.wg_attribute,
                wg_status: '1',
                wg_tag: '1',
                wg_label_id: [],
                wg_name: data.goo_name,
                wg_sort: data.goo_sort,
                wg_if_free_haul: '',
                wg_list_price: data.goo_listPrice || 0,
                wg_price: data.goo_price || 0,
                wg_total_limit_number: '0',
                wg_total_limit_number_oneuser: '0',
                wg_cover_image: data.goo_cover_image,
                wg_loop_image: data.goo_loop_image ? JSON.parse(data.goo_loop_image) : [],
                wg_description: data.goo_description,
                wg_content: data.goo_content,
                wg_fake_sell_number: '0',
                wg_one_limit_number: '0',
                goods_id: data.id,
                wg_sell_number: '',
                goods: data,
                wg_is_member_price: '0'
              }
              this.formatStatus = data.goo_size
              this.mainGoodsId = data.id
            } else {
              this.$q.notify({
                message: '失败',
                caption: '商品已存在',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
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
      }
    },
    showCoupon () {
      this.couponPoppupStatus = true
    },
    showSelectGoods () {
      this.selectGoodsPoppupStatus = true
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsTimeRef.info()
      })
    },
    hideCouponPoppup (item) {
      this.goodsForm.coupon = item
      this.goodsForm.goods_id = item.id

      this.goodsForm.wg_name = item.cou_title
      this.goodsForm.wg_list_price = 0
      this.goodsForm.wg_price = 0
      this.goodsForm.wg_content = item.cou_description

      this.couponPoppupStatus = false
    },
    hideSelectGoodsPoppup (item) {
      this.goodsForm.time = item
      this.goodsForm.goods_id = item.id

      this.goodsForm.wg_name = item.gtg_name
      this.goodsForm.wg_list_price = item.gtg_selling_price
      this.goodsForm.wg_price = item.gtg_selling_price
      this.goodsForm.wg_content = item.gtg_description
      this.goodsForm.wg_cover_image = item.gtg_cover_image

      this.selectGoodsPoppupStatus = false
    },
    addGroupCountSelectGoods () {
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsRef.info()
      })
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    setCount (packageId, item) {
      this.goodsForm.recharg = item
      this.goodsForm.goods_id = packageId

      this.goodsForm.wg_name = item.grp_name
      this.goodsForm.wg_list_price = item.grp_packagePrice
      this.goodsForm.wg_price = item.grp_packagePrice
      this.goodsForm.wg_content = item.grp_content
      this.goodsForm.wg_cover_image = item.grp_coverImage
    },

    showRow (params, key, item) {
      const data = this.goodsForm.specPriceData

      const row = item
      const rowIndex = key
      const property = params.field
      const cellValue = row[property]

      if (cellValue && parseInt(params.type) == 1) {
        const prevRow = data[rowIndex - 1]
        if (prevRow && prevRow[property] === cellValue) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    rowSpan (params, key, item) {
      const data = this.goodsForm.specPriceData

      const row = item
      const rowIndex = key
      const property = params.field
      const cellValue = row[property]

      if (cellValue && parseInt(params.type) == 1) {
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
      return 1
    }
  }
}
</script>
<style scoped>
.table_td_border {
  /* border: 1px solid; */
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.12);
}
</style>
