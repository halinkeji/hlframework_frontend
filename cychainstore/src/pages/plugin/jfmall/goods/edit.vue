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
          <q-form class="q-pa-sm" ref="addJfmallGoodsRef">
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
                  :disable="!!jfmallGoodsId"
                  v-model="goodsForm.jg_attribute"
                  :options="$store.state.jfGoods.attributeDataList"
                  label="商品属性"
                />
              </div>

              <div
                class="col-12 col-md-12"
                v-if="goodsForm.jg_attribute == 'goods' || goodsForm.jg_attribute == 'service' || goodsForm.jg_attribute == 'package'"
              >
                <q-input label="绑定商品名称" class="q-mb-md" readonly outlined v-model="goodsForm.goods.goo_name" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择商品库" unelevated @click="selectBut" v-if="!jfmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12" v-if="goodsForm.jg_attribute == 'count'">
                <q-input label="绑定次卡" class="q-mb-md" readonly outlined v-model="goodsForm.recharg.grp_name" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择次卡" unelevated @click="addGroupCountSelectGoods" v-if="!jfmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12" v-if="goodsForm.jg_attribute == 'time'">
                <q-input label="绑定时卡" class="q-mb-md" readonly outlined v-model="goodsForm.time.gtg_name" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择时卡" unelevated @click="showSelectGoods" v-if="!jfmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12" v-if="goodsForm.jg_attribute == 'coupon'">
                <q-input label="绑定卡券" class="q-mb-md" readonly outlined v-model="goodsForm.coupon.cou_title" dense lazy-rules>
                  <template v-slot:after>
                    <q-btn color="primary" label="选择卡券" unelevated @click="showCoupon" v-if="!jfmallGoodsId" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-12">
                <q-input
                  label="商城商品名称"
                  outlined
                  v-model="goodsForm.jg_name"
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
                  v-model="goodsForm.jg_sort"
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
                  v-model="goodsForm.jg_status"
                  :options="stateOptions"
                  label="状态"
                />
              </div>

              <div class="col-12 col-md-3">
                <jfmall-type-tree
                  :list_width="400"
                  @getItem="
                    (item) => {
                      goodsForm.jg_type_id = item.id;
                    }
                  "
                  :dataList="typeData"
                  textName="分类"
                  :inputLabel="'jt_name'"
                  :inputValue="'id'"
                  :showValue="goodsForm.jg_type_id"
                  @resetValue="goodsForm.jg_type_id = ''"
                  ref="jfmallTypeTreeRef"
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
                  v-model="goodsForm.jg_tag"
                  :options="topOptions"
                  label="商品活动属性"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="id"
                  option-label="jl_name"
                  emit-value
                  map-options
                  v-model="goodsForm.jg_label_id"
                  :options="labelData"
                  label="商品标签"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  dense
                  option-value="id"
                  option-label="jl_name"
                  emit-value
                  map-options
                  v-model="goodsForm.jg_serve_id"
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
                  option-label="jft_name"
                  v-model="goodsForm.jg_freight_template_id"
                  :rules="[(val) => !!val || '请选择运费绑定模板']"
                  :options="freightData"
                  dense
                  label="绑定运费模板"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input label="真实出售" outlined v-model="goodsForm.jg_sell_number" dense :disable="true" :error="false" />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="虚拟出售"
                  outlined
                  v-model="goodsForm.jg_fake_sell_number"
                  dense
                  lazy-rules
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '虚拟出售为非负整数']"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="总限购数量"
                  outlined
                  v-model="goodsForm.jg_total_limit_number"
                  dense
                  lazy-rules
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '总限购数量为非负整数']"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  label="单人限购数量"
                  outlined
                  v-model="goodsForm.jg_one_limit_number"
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
                        goodsForm.jg_cover_image = val;
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
                        goodsForm.jg_loop_image = val;
                      });
                    }
                  "
                  currentDescription="建议尺寸比例1:1"
                  currentTitle="详情图"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input outlined v-model="goodsForm.jg_description" dense type="textarea" rows="2" label="商品简介" :error="false" />
              </div>
              <div class="col-12">
                <hl-editor
                  class="q-px-sm"
                  @change="
                    (v) => {
                      goodsForm.jg_content = v;
                    }
                  "
                  :content="goodsForm.jg_content"
                  titleText="商品详情"
                  :minHeight="$q.screen.height * 0.4"
                >
                </hl-editor>
              </div>
            </div>

            <div class="row q-col-gutter-sm" v-show="parseInt(malltab) == 3">
              <div class="col-12 col-md-6">
                <q-input
                  label="商城售价"
                  outlined
                  v-model="goodsForm.jg_price"
                  dense
                  lazy-rules
                  :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确商城售价']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  label="标价"
                  outlined
                  v-model="goodsForm.jg_list_price"
                  dense
                  lazy-rules
                  :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确标价']"
                />
              </div>
              <div class="col-12">
                <level-price ref="goodsLevelPriceRef"> </level-price>
              </div>
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

        <q-btn
          unelevated
          color="green"
          class="q-px-xl"
          label="下一步"
          @click="saveData('next')"
          v-if="!goodsForm.id"
          :disable="disableButton"
        />
        <q-btn
          unelevated
          color="primary"
          class="q-px-xl"
          label="保存"
          v-else
          @click="saveData('save')"
          :disable="disableButton"
        />
        <q-btn unelevated color="grey" label="返回" :to="{ name: 'jfmallGoods' }" class="q-px-xl" />
      </div>
      <select-coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
      <hl-select-time-group ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup" />
      <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"> </hl-select-count-group>
    </div>
  </q-page>
</template>
<script>
import LevelPrice from './LevelPrice.vue'
import SelectCoupon from 'src/pages/plugin/hlcoupon/components/SelectCoupon.vue'
import JfmallTypeTree from '../type/select-tree/index.vue'
export default {
  components: {
    LevelPrice,

    SelectCoupon,
    JfmallTypeTree
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
      goodsForm: {
        jg_status: '1',
        jg_name: '',
        jg_type_id: '',
        jg_tag: '',
        jg_label_id: '',
        jg_serve_id: '',
        jg_sort: '0',
        jg_if_free_haul: '1',
        jg_list_price: '',
        jg_price: '',
        jg_total_limit_number: '0',
        jg_total_limit_number_oneuser: '0',
        jg_cover_image: '',
        jg_loop_image: [],
        jg_description: '',
        jg_content: '',
        jg_fake_sell_number: '0',
        jg_one_limit_number: '0',
        goods_id: 0,
        id: 0,
        jg_sell_number: '',
        goods: {},
        recharg: {},
        time: {},
        coupon: {},
        jg_is_member_price: '1',
        jg_attribute: 'goods'
      },

      freightData: [],
      typeData: [],
      showGoodsList: false,
      formatStatus: false,
      mainGoodsId: 0,
      jfmallGoodsId: 0,
      topOptions: [
        {
          label: '精选置顶',
          value: '1'
        },
        {
          label: '热门活动',
          value: '2'
        },
        {
          label: '人气推荐',
          value: '3'
        },
        {
          label: '默认推荐',
          value: '4'
        }
      ]
    }
  },
  mounted () {
    if (this.$route.query.jfmallGoodsId) {
      this.jfmallGoodsId = this.$route.query.jfmallGoodsId
      this.getItem()
    }
  },
  created () {
    this.getFreightData()
  },
  computed: {},
  methods: {
    getFreightData () {
      this.$store.dispatch('jfSetting/getConfig').then((res) => {
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
        .dispatch('jfGoods/getItem', { id: this.jfmallGoodsId })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsForm = res.data

              this.$nextTick(() => {
                this.$refs.goodsLevelPriceRef.setLevelPriceData(res.data.levelMemberPriceList)
              })
            }
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
      this.$refs.addJfmallGoodsRef.validate().then((success) => {
        if (success) {
          this.disableButton = true
          const obj = {
            ...this.goodsForm,
            levelPriceList: this.$refs.goodsLevelPriceRef.levelMemberPriceList
          }
          this.$store
            .dispatch('jfGoods/setData', obj)
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
                  this.$router.push({ name: 'jfmallGoods' })
                } else {
                  this.jfmallGoodsId = res.data.id
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
      if (this.goodsForm.jg_attribute == 'goods') {
        var type = 1
      } else if (this.goodsForm.jg_attribute == 'service') {
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
          .dispatch('jfGoods/verifyGoods', { mainGoodsId: data.id })
          .then((res) => {
            if (res.code == 200) {
              this.showGoodsList = status

              this.goodsForm = {
                jg_attribute: this.goodsForm.jg_attribute,
                jg_status: '1',
                jg_tag: '1',
                jg_label_id: '',
                jg_name: data.goo_name,
                jg_sort: data.goo_sort,
                jg_if_free_haul: '',
                jg_list_price: data.goo_listPrice || 0,
                jg_price: data.goo_price || 0,
                jg_total_limit_number: '0',
                jg_total_limit_number_oneuser: '0',
                jg_cover_image: data.goo_cover_image,
                jg_loop_image: data.goo_loop_image ? JSON.parse(data.goo_loop_image) : [],
                jg_description: data.goo_description,
                jg_content: data.goo_content,
                jg_fake_sell_number: '0',
                jg_one_limit_number: '0',
                goods_id: data.id,
                jg_sell_number: '',
                goods: data,
                jg_is_member_price: '1'
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

      this.goodsForm.jg_name = item.cou_title
      this.goodsForm.jg_list_price = 0
      this.goodsForm.jg_price = 0
      this.goodsForm.jg_content = item.cou_description

      this.couponPoppupStatus = false
    },
    hideSelectGoodsPoppup (item) {
      this.goodsForm.time = item
      this.goodsForm.goods_id = item.id

      this.goodsForm.jg_name = item.gtg_name
      this.goodsForm.jg_list_price = item.gtg_selling_price
      this.goodsForm.jg_price = item.gtg_selling_price
      this.goodsForm.jg_content = item.gtg_description
      this.goodsForm.jg_cover_image = item.gtg_cover_image

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

      this.goodsForm.jg_name = item.grp_name
      this.goodsForm.jg_list_price = item.grp_packagePrice
      this.goodsForm.jg_price = item.grp_packagePrice
      this.goodsForm.jg_content = item.grp_content
      this.goodsForm.jg_cover_image = item.grp_coverImage
    }
  }
}
</script>
