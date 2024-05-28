<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-py-xs full-height q-mb-xs">
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
                    v-model="typeData.gt_sort"
                    placeholder="请输入排序号"
                    :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
                  >
                  </q-input>
                </div>
                <div>
                  <span>编码</span>
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="typeData.gt_code"
                    placeholder="请输入编码"
                    :rules="[(val) => /^\d+$/.test(val) || '请输入正确的编码']"
                  >
                  </q-input>
                </div>
                <div>
                  <span>类目名称</span>
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="typeData.gt_name"
                    placeholder="请输入类目名称"
                    :rules="[(val) => (val && val.length > 0) || '请设置类目名称']"
                  >
                  </q-input>
                </div>

                <div class="q-mt-md">
                  <span>选择上级类目</span>

                  <hl-select-tree
                    :list_width="400"
                    @getItem="getNowItem"
                    :dataList="typeListData"
                    textName="类目"
                    :inputLabel="'gt_name'"
                    :inputValue="'id'"
                    :showValue="typeData.gt_pid"
                  />
                </div>
                <div class="q-mt-md">
                  <span>简介</span>
                  <q-input outlined bottom-slots v-model="typeData.gt_description" :rows="3" dense type="textarea"> </q-input>
                </div>
                <div>
                  <div class="row">
                    <span class="q-mt-sm">状态</span>
                    <q-option-group v-model="typeData.gt_status" :options="statusOptions" color="primary" inline class="q-ml-sm" />
                  </div>
                </div>
                <div class="col-md-6 col-12">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="typeData.pictureUrl"
                    @input="(val)=>{ $nextTick(()=>{ typeData.gt_pictureUrl = val })}"
                    currentDescription="建议尺寸比例1:1"
                    currentTitle="封面图"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-md text-center">
        <q-btn unelevated color="primary" class="q-px-md q-px-xl" @click="saveBut()" :disable="submitDisabled" label="提交" />

        <q-btn class="q-ml-sm q-px-md q-px-xl" unelevated color="grey" :to="{ name: 'clothingType' }" label="返回" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'AddType',
  data () {
    return {
      typeListData: [],
      multiple: false,
      uploadImgStatus: false,
      typeData: {
        gt_pid: 0,
        gt_sort: 0,
        gt_code: '',
        gt_name: '',
        gt_description: '',
        gt_pictureUrl: '',
        gt_goods_type: 1,
        gt_status: '1'
      },
      imageData: false,
      submitDisabled: false,

      statusOptions: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '0'
        }
      ]
    }
  },
  computed: {},
  created () {
    this.getList()
  },
  mounted () {
    if (this.$route.query.id > 0) {
      this.getGoodsType()
    }
  },

  methods: {
    getGoodsType () {
      this.$store.dispatch('clothingType/getItem', this.$route.query.id).then((res) => {
        if (res.code == 200) {
          this.typeData = res.data

          this.typeData.gt_status = res.data.gt_status.toString()
          this.typeData.gt_pid = res.data.gt_pid.toString()
          this.typeData.gt_goods_type = parseInt(res.data.gt_goods_type)
        }
      })
    },
    getNowItem (item) {
      if (item.id) {
        this.typeData.gt_pid = item.id
        this.typeData.gt_goods_type = parseInt(item.gt_goods_type)
      }
    },
    saveBut () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          const obj = {
            id: this.$route.query.id,
            ...this.typeData
          }
          this.$store
            .dispatch('clothingType/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '商品类目信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.submitDisabled = false
                this.$router.push({ name: 'clothingType' })
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

    // 获取类目
    getList () {
      const params = {
        nowType: this.$route.query.id
      }
      this.$store
        .dispatch('clothingType/getTreeList', params)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeListData = res.data
            } else {
              this.typeListData = []
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
    }
  }
}
</script>
