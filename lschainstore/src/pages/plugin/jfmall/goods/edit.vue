<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-sm">
      <q-tabs v-model="malltab" indicator-color="primary" class="text-grey-8" align="left" dense>
        <q-tab name="1" label="商品信息" />
        <q-tab name="2" :disable="!jfmallGoodsData.id" label="会员价" />
        <q-tab
          name="3"
          :disable="!jfmallGoodsData.id"
          :label="`${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit}支付`"
        />
        <q-tab
          name="4"
          :disable="!jfmallGoodsData.id"
          :label="`${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit}支付`"
        />
      </q-tabs>
    </div>

    <div v-if="malltab == '1'" class="col-shrink full-height q-mt-xs bg-white">
      <div style="overflow-y: scroll;" class="fit full-height">
        <q-form class="q-pa-sm" ref="addJfmallGoodsRef">
          <div class="row">
            <div class="col-12 q-px-sm col-md-12">
              <q-input
                label="绑定商品名称"
                outlined
                readonly
                v-model="jfmallGoodsData.goods.goo_name"
                dense
                lazy-rules
                :rules="[(val) => !!val || '绑定商品名称是必填的']"
              >
                <template v-slot:after>
                  <q-btn color="primary" label="选择商品库" unelevated @click="selectBut" v-if="!jfmallGoodsId" />
                </template>
              </q-input>
            </div>
            <div class="col-12 q-px-sm col-md-12">
              <q-input
                label="商城商品名称"
                outlined
                v-model="jfmallGoodsData.jg_name"
                dense
                lazy-rules
                :rules="[(val) => !!val || '商城商品名称是必填的']"
              >
              </q-input>
            </div>
            <div class="col-12 q-px-sm col-md-3">
              <q-input
                label="排序"
                outlined
                v-model="jfmallGoodsData.jg_sort"
                dense
                lazy-rules
                :rules="[(val) => /^\d+$/.test(val) || '排序为非负整数']"
              />
            </div>
            <div class="col-12 q-px-sm col-md-3">
              <q-select
                outlined
                dense
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="jfmallGoodsData.jg_tag"
                :options="topOptions"
                label="商品类型"
              />
            </div>
            <div class="col-12 q-px-sm col-md-3">
              <q-select
                outlined
                dense
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="jfmallGoodsData.jg_status"
                :options="stateOptions"
                label="状态"
              />
            </div>
            <div class="col-12 q-px-sm col-md-3">
              <q-input label="真实出售" outlined v-model="jfmallGoodsData.jg_sell_number" dense :disable="true" :error="false" />
            </div>
            <div class="col-12 q-px-sm col-md-3">
              <q-input
                label="虚拟出售"
                outlined
                v-model="jfmallGoodsData.jg_fake_sell_number"
                dense
                lazy-rules
                :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '虚拟出售为非负整数']"
              />
            </div>
            <!-- <div class="col-12 q-px-sm col-md-3 ">
                <q-input
                label="售价"
                outlined
                v-model="jfmallGoodsData.jg_price"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确售价']"
              />
              </div>
              <div class="col-12 q-px-sm col-md-3 ">
                <q-input
                label="标价"
                outlined
                v-model="jfmallGoodsData.jg_list_price"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确标价']"
              />
              </div> -->

            <div class="col-12 q-px-sm col-md-3">
              <q-select
                outlined
                dense
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="jfmallGoodsData.jg_if_free_haul"
                :options="ifFree"
                label="是否包邮"
                :error="false"
              />
            </div>
            <div class="col-12 q-px-sm col-md-3">
              <q-input
                label="总限购数量"
                outlined
                v-model="jfmallGoodsData.jg_total_limit_number"
                dense
                lazy-rules
                :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '总限购数量为非负整数']"
              />
            </div>

            <div class="col-12 q-px-sm col-md-3">
              <q-input
                label="单人限购数量"
                outlined
                v-model="jfmallGoodsData.jg_one_limit_number"
                dense
                lazy-rules
                :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '每人限购数量为非负整数']"
              />
            </div>
          </div>
          <!-- 图片上传 -->
          <div class="row">
            <div class="col-12 q-px-sm col-md-6 q-mt-sm row">
              <hl-upload
                :multiple="false"
                :currentAttach="jfmallGoodsData.coverImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      jfmallGoodsData.jg_cover_image = val;
                    });
                  }
                "
                currentTitle="封面图"
              />
            </div>

            <div class="col-12 q-px-sm col-md-6 q-mt-sm row">
              <hl-upload
                :multiple="true"
                :maxTotal="5"
                :currentAttach="jfmallGoodsData.loopImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      jfmallGoodsData.jg_loop_image = val;
                    });
                  }
                "
                currentTitle="详情图"
              />
            </div>
          </div>

          <div class="q-mt-sm q-px-sm">
            <q-input outlined class="col-6" dense type="textarea" rows="2" label="描述" v-model="jfmallGoodsData.jg_description" :error="false" />
          </div>
          <div class="q-mt-sm q-px-sm">
            <hl-editor
              @change="
                (v) => {
                  jfmallGoodsData.jg_content = v;
                }
              "
              :content="jfmallGoodsData.jg_content"
              :minHeight="$q.screen.height * 0.4"
              titleText="详情"
            ></hl-editor>
          </div>
        </q-form>
      </div>
    </div>
    <div v-if="malltab == '2'" class="col-shrink full-height q-mt-xs">
      <jfmall-member-price :jfmallGoodsData="jfmallGoodsData" :goodsId="mainGoodsId" :formatStatus="formatStatus"></jfmall-member-price>
    </div>
    <div v-if="malltab == '3'" class="col-shrink full-height q-mt-xs">
      <jfmall-point-price :jfmallGoodsData="jfmallGoodsData" :goods="mainGoodsId" :formatStatus="formatStatus"></jfmall-point-price>
    </div>
    <div v-if="malltab == '4'" class="col-shrink full-height q-mt-xs">
      <jfmall-save-price :jfmallGoodsData="jfmallGoodsData" :goods="mainGoodsId" :formatStatus="formatStatus"></jfmall-save-price>
    </div>

    <div class="col-shrink bg-white q-mt-xs q-pb-md text-center q-gutter-sm">
      <q-btn class="q-px-xl" label="保存" @click="saveData('save')" :disable="disableButton" unelevated color="primary" v-if="malltab == '1'" />
      <q-btn unelevated color="green" class="q-px-xl" label="保存(下一步)" @click="saveData('next')" v-if="malltab == '1'" :disable="disableButton" />
      <q-btn class="q-px-xl" :to="{ name: 'jfmallGoods' }" label="返回" unelevated color="grey" />
    </div>

    <hl-goods-table
      rowSelection="single"
      ref="specificationTree"
      v-if="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
      @closeDialog="showGoodsList = false"
    ></hl-goods-table>
  </div>
</template>
<script>
import JfmallMemberPrice from './JfmallMemberPrice.vue'
import JfmallPointPrice from './JfmallPointPrice.vue'
import JfmallSavePrice from './JfmallSavePrice.vue'
export default {
  components: {
    JfmallMemberPrice,
    JfmallPointPrice,
    JfmallSavePrice
  },

  data () {
    return {
      malltab: '1',
      disableButton: false,
      match: false,
      multiple: false,
      uploadContentStatus: false,
      topOptions: [
        {
          label: '精选置顶',
          value: '1'
        },
        {
          label: '门店活动',
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
      ],
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
      jfmallGoodsData: {
        goods_id: 0,
        jg_tag: '4',
        jg_status: '1',
        jg_sort: 0,
        jg_name: '',
        jg_price: 0,
        jg_list_price: 0,
        jg_fake_sell_number: 0,
        jg_sell_number: '',
        jg_total_limit_number: 0,
        jg_one_limit_number: 0,
        jg_if_free_haul: '2',
        jg_description: '',
        jg_content: '',
        jg_cover_image: '',
        jg_loop_image: [],
        jg_is_member_price: '1',
        jg_is_point_price: 2,
        jg_is_save_price: 2,
        goods: {}
      },
      showGoodsList: false,
      formatStatus: false,
      mainGoodsId: 0,
      jfmallGoodsId: 0
    }
  },
  mounted () {
    if (this.$route.query.jfmallGoodsId) {
      this.jfmallGoodsId = this.$route.query.jfmallGoodsId
      this.getItem()
    }
  },
  created () {},
  computed: {},
  methods: {
    // 获取单条
    getItem (type) {
      this.$store.dispatch('jfgoods/getItem', { id: this.jfmallGoodsId }).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.jfmallGoodsData = res.data

            this.jfmallGoodsData.jg_loop_image = res.data.jg_loop_image ? res.data.jg_loop_image.split(',') : []

            this.mainGoodsId = res.data.goods_id

            this.formatStatus = res.data.goods ? res.data.goods.goo_size == 1 : false
            if (type == 2) {
              this.$nextTick(() => {
                this.malltab = '2'
              })
            }
          }
        }
      })
    },
    // 提交
    saveData (type) {
      const that = this
      if (!(this.jfmallGoodsData.goods_id > 0)) {
        this.$q.notify({
          message: '失败',
          caption: '请先保存商品信息',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return ''
      }
      this.$refs.addJfmallGoodsRef.validate().then((success) => {
        if (success) {
          this.disableButton = true
          const obj = {
            ...this.jfmallGoodsData
          }
          this.$store
            .dispatch('jfgoods/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.disableButton = false
                this.$q.notify({
                  message: '成功',
                  caption: `${this.jfmallGoodsData.id ? '修改' : '新增'}${
                    this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit
                  }商城商品成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                if (type == 'save') {
                  this.$router.push({ name: 'jfmallGoods' })
                } else {
                  this.jfmallGoodsId = res.data.id
                  that.getItem(2)
                }
              }
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
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1])
        }, 500)
      })
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      if (data) {
        this.$store
          .dispatch('jfgoods/verifyGoods', { jfmallGoodsId: data.id })
          .then((res) => {
            if (res.code == 200) {
              this.showGoodsList = status

              this.jfmallGoodsData = {
                jg_tag: '4',
                jg_status: '1',
                jg_sort: data.goo_sort,
                jg_name: data.goo_name,
                jg_price: data.goo_price,
                jg_list_price: data.goo_listPrice,
                jg_fake_sell_number: 0,
                jg_sell_number: '',
                jg_total_limit_number: 0,
                jg_one_limit_number: 0,
                jg_if_free_haul: '2',
                jg_description: data.goo_description,
                jg_content: data.goo_content,
                jg_cover_image: data.goo_cover_image,
                jg_loop_image: data.goo_loop_image ? data.goo_loop_image.split(',') : [],
                jg_is_member_price: '1',
                jg_is_point_price: 2,
                jg_is_save_price: 2,
                goods_id: data.id,
                goods: data
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
    }
  }
}
</script>
