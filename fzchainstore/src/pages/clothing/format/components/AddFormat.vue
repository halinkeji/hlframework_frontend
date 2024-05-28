<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        规格组管理
      </div>
      <div class="col-shrink bg-white q-pa-sm full-height q-my-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="dataFormRef" class="row q-col-gutter-sm">
            <div class="col-3">
              <q-input
                outlined
                bottom-slots
                dense
                label="排序"
                v-model="dataForm.cf_sort"
                placeholder="请输入排序号"
                :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
              >
              </q-input>
            </div>
            <div class="col-3">

              <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="dataForm.cf_status"
              :options="options"
              dense
              label="状态"
            />
            </div>
            <div class="col-6">
              <q-input
                outlined
                bottom-slots
                dense
                label="规格组名称"
                v-model="dataForm.cf_name"
                placeholder="请输入规格组名称"
                :rules="[(val) => (val && val.length > 0) || '请设置规格组名称']"
              >
              </q-input>
            </div>
            <div class="col-12">
              <q-input outlined bottom-slots label="简介" v-model="dataForm.cf_content" dense> </q-input>
            </div>
            <div class="col-md-6 col-12">
              <q-card flat bordered>
                <q-card-section class="row q-pa-sm items-center justify-between">
                  颜色属性
                  <q-space />
                  <q-btn color="primary" label="添加颜色属性" @click="addSpecification" unelevated icon="las la-plus-square" />
                </q-card-section>

                <q-separator />

                <q-card-section>
                  <q-item dense class="full-width " v-for="(normItem, normIndex) in colorItem" :key="normIndex">
                    <q-item-section>
                      <q-input
                        v-model="normItem.cft_code"
                        outlined
                        bottom-slots
                        dense
                        label="属性编码"
                        placeholder="请输入属性编码"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '请设置属性编码']"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        v-model="normItem.cft_name"
                        outlined
                        bottom-slots
                        dense
                        label="属性名称"
                        placeholder="请输入属性名称"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '请设置属性名称']"
                      />
                    </q-item-section>
                    <q-item-section side top>
                      <q-btn @click="deleteSpecification(normIndex)" color="red" flat round icon="delete "> </q-btn>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6 col-12 ">
              <q-card flat bordered>
                <q-card-section class="row q-pa-sm items-center justify-between">
                  尺寸属性
                  <q-space />
                  <q-btn color="primary" label="添加尺寸属性" @click="addColor" unelevated icon="las la-plus-square" />
                </q-card-section>

                <q-separator />

                <q-card-section>
                  <q-item dense class="full-width " v-for="(normItem, normIndex) in sizeItem" :key="normIndex">
                    <q-item-section>
                      <q-input
                        v-model="normItem.cft_code"
                        outlined
                        bottom-slots
                        dense
                        label="属性编码"
                        placeholder="请输入属性编码"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '请设置属性编码']"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        v-model="normItem.cft_name"
                        outlined
                        bottom-slots
                        dense
                        label="属性名称"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '请设置属性名称']"
                      />
                    </q-item-section>
                    <q-item-section side top>
                      <q-btn @click="deleteCollor(normIndex)" color="red" flat round icon="delete "> </q-btn>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center">
        <q-btn unelevated color="primary" class="q-px-md q-px-xl" @click="clothingFormatSumbit()" :disable="submitDisabled" label="提交" />
        <q-btn class="q-ml-sm q-px-md q-px-xl" unelevated color="grey" :to="{ name: 'clothingFormat' }" label="返回" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'addClothingFormat',
  data () {
    return {
      options: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '0'
        }
      ],
      dataId: 0,
      popupActive: false,
      dataForm: {
        cf_name: '',
        cf_status: '1',
        cf_content: ''
      },
      sizeItem: [],
      colorItem: [],
      submitDisabled: false
    }
  },
  created () {},
  mounted () {
    if (this.$route.query.id > 0) {
      this.getItem()
    }
  },
  computed: {},
  methods: {
    getItem () {
      this.dataId = this.$route.query.id
      this.$store
        .dispatch('clothingFormat/getItemData', this.$route.query.id)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data
            if (res.data.sizeItem) {
              this.sizeItem = res.data.sizeItem
            }
            if (res.data.colorItem) {
              this.colorItem = res.data.colorItem
            }
          }
        })
        .catch((err) => {})
    },
    clothingFormatSumbit () {
      this.$refs.dataFormRef.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          if (!(this.dataId > 0)) {
            this.dataId = 0
          }
          const obj = {
            ...this.dataForm,
            id: this.dataId,
            sizeItem: this.sizeItem,
            colorItem: this.colorItem
          }
          this.$store.dispatch('clothingFormat/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '商品规格组成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })

              this.$router.push({ name: 'clothingFormat' })
            }
          })
        }
      })
    },
    // 添加
    addSpecification () {
      const layoutArray = this.colorItem
      const newlayout = {
        cft_name: '',
        cft_code: '',
        cft_type: 'color'
      }
      layoutArray.push(newlayout)
    },
    // 删除
    deleteSpecification (mainKey) {
      setTimeout(() => {
        this.colorItem.splice(mainKey, 1)
      }, 100)
    },
    addColor () {
      const layoutArray = this.sizeItem
      const newlayout = {
        cft_code: '',
        cft_name: '',
        cft_type: 'size'
      }
      layoutArray.push(newlayout)
    },
    // 删除
    deleteCollor (mainKey) {
      setTimeout(() => {
        this.sizeItem.splice(mainKey, 1)
      }, 100)
    }
  }
}
</script>
