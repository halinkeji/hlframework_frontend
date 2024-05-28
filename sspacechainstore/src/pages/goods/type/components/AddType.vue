<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        {{ $route.query.id > 0 ? '编辑' : '新增' }}分类
      </div>
      <div class="col-shrink bg-white q-pa-sm full-height q-mt-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="typeDataRef">
            <div class="row q-py-lg q-px-md q-col-gutter-md">
              <div class="col-md-6 col-12 q-pt-none">
                <div>
                  <span>排序</span>
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="goodsTypeData.gt_sort"
                    placeholder="请输入排序"
                    :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']"
                  >
                  </q-input>
                </div>
                <div>
                  <span>分类名称</span>
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="goodsTypeData.gt_name"
                    placeholder="请输入分类名称"
                    :rules="[(val) => (val && val.length > 0) || '请设置分类名称']"
                  >
                  </q-input>
                </div>
                <div>
                  <span>商品属性</span>
                  <q-select
                    outlined
                    dense
                    emit-value
                    map-options
                    option-value="value"
                    option-label="label"
                    v-model="goodsTypeData.gt_goods_type"
                    :options="attribute"
                    :disable="goodsTypeData.gt_pid > 0 ? true : false"
                  />
                </div>
                <div class="q-mt-md">
                  <span>选择上级分类</span>

                  <hl-select-tree
                    :list_width="400"
                    @getItem="getNowItem"
                    :dataList="goodsTypeListData"
                    textName="分类"
                    :inputLabel="'gt_name'"
                    :inputValue="'id'"
                    :showValue="goodsTypeData.gt_pid"
                  />
                </div>
                <div class="q-mt-md">
                  <span>简介</span>
                  <q-input outlined bottom-slots v-model="goodsTypeData.gt_description" :rows="3" dense type="textarea"> </q-input>
                </div>
                <div>
                  <div class="row">
                    <span class="q-mt-sm">状态</span>
                    <q-option-group v-model="goodsTypeData.gt_ifSetStore" :options="statusOptions" color="primary" inline class="q-ml-sm" />
                  </div>
                </div>
                <div class="col-md-6 col-12">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="goodsTypeData.pictureUrl"
                    @input="
                      (val) => {
                        $nextTick(() => {
                          goodsTypeData.gt_pictureUrl = val;
                        });
                      }
                    "
                    currentDescription="建议尺寸比例1:1"
                    currentTitle="封面图"
                  />
                </div>
                <div class="col-md-6 col-12 q-pt-none" v-if="is_main_store">
                  <span>可操作门店</span>
                  <div class="q-pa-md row">
                    <div class="col-auto" v-for="item in libInStoreList">
                      <q-checkbox v-model="selectStoreData" :val="item.id" :label="item.name" color="primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-md text-center q-mt-xs">
        <q-btn unelevated color="primary" class="q-px-xl" @click="saveBut()" :disable="submitDisabled" label="提交" />

        <q-btn class="q-ml-sm q-px-xl" unelevated color="grey" :to="{ name: 'goodsType' }" label="返回" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'AddType',
  data () {
    return {
      goodsTypeListData: [],
      multiple: false,
      uploadImgStatus: false,
      goodsTypeData: {
        gt_pid: 0,
        gt_sort: 0,
        gt_name: '',
        gt_description: '',
        gt_pictureUrl: '',
        gt_goods_type: 1,
        gt_ifSetStore: '1'
      },
      imageData: false,
      submitDisabled: false,
      attribute: [
        {
          label: '实物商品',
          value: 1
        },
        {
          label: '服务商品',
          value: 2
        },
        {
          label: '套餐商品',
          value: 3
        }
      ],
      mode: [
        { title: '可用', id: '1' },
        { title: '不可用', id: '2' }
      ],
      statusOptions: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '0'
        }
      ],
      libInStoreList: [],
      selectStoreData: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.getList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    if (this.$route.query.id > 0) {
      this.getGoodsType()
    }
  },

  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },

    getGoodsType () {
      this.$store.dispatch('goodstype/getItem', this.$route.query.id).then((res) => {
        if (res.code == 200) {
          this.goodsTypeData = res.data

          this.goodsTypeData.gt_ifSetStore = res.data.gt_ifSetStore.toString()
          this.goodsTypeData.gt_pid = res.data.gt_pid.toString()
          this.goodsTypeData.gt_goods_type = parseInt(res.data.gt_goods_type)

          if (this.goodsTypeData && this.goodsTypeData.goodsTypeStore && this.goodsTypeData.goodsTypeStore.length > 0) {
            const goodsTypeStore = this.goodsTypeData.goodsTypeStore
            this.selectStoreData = _.map(goodsTypeStore, 'store_id')
          }
        }
      })
    },
    getNowItem (item) {
      if (item.id) {
        this.goodsTypeData.gt_pid = item.id
        this.goodsTypeData.gt_goods_type = parseInt(item.gt_goods_type)
      }
    },
    saveBut () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          const obj = {
            id: this.$route.query.id,
            ...this.goodsTypeData,
            selectStoreData: this.selectStoreData
          }
          this.$store
            .dispatch('goodstype/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '商品分类信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.submitDisabled = false
                this.$router.push({ name: 'goodsType' })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },

    // 获取分类
    getList () {
      const params = {
        nowType: this.$route.query.id
      }
      this.$store
        .dispatch('goodstype/getTreeList', params)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeListData = res.data
            } else {
              this.goodsTypeListData = []
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
