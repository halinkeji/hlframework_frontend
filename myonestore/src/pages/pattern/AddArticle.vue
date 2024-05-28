<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>

    <q-card
      :style="{
        width: this.$q.screen.width * 0.5 + 'px',
        'min-width': this.$q.screen.width * 0.5 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
          <q-card-section class="row items-center q-pa-none">
            <div class="text-h6">{{ articleData.id > 0 ? '修改' : '新增' }}文章</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white ">
          <div style="overflow-y: scroll;" class="fit full-height">
            <q-form ref="articleDataRef">
              <div class="row">
                <div class="col-6 row q-col-gutter-xs">
                   <div class="col-12">
                    <q-input
                      outlined
                      dense
                      v-model="articleData.ppa_sort"
                      label="排序"
                      lazy-rules
                      :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']"
                    />
                  </div>
                  <div class="col-12">
                    <q-input outlined dense v-model="articleData.ppa_title" label="标题" lazy-rules :rules="[(val) => !!val || '请输入标题']" />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="articleData.ppa_property"
                      :options="sortTypeData"
                      option-label="label"
                      option-value="value"
                      map-options
                      emit-value
                      dense
                      outlined
                      label="选择属性"
                      :rules="[(val) => !!val || '请选择属性']"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="articleData.ppa_type_id"
                      :options="typeList"
                      option-label="ppt_name"
                      option-value="id"
                      map-options
                      emit-value
                      dense
                      outlined
                      label="选择分类"
                      :rules="[(val) => !!val || '请选择分类']"
                    />
                  </div>

                  <div class="col-12">
                    <q-select
                      v-model="articleData.ppa_reward_user_id"
                      :options="userData"
                      option-label="pru_name"
                      option-value="id"
                      map-options
                      emit-value
                      dense
                      outlined
                      label="选择发布员工"
                      :rules="[(val) => !!val || '请选择发布员工']"
                    />
                  </div>
                </div>
                <div class="col-6 q-px-sm">

                  <hl-upload
                    :multiple="true"
                    :maxTotal="5"
                    :currentAttach="articleData.loopImage"
                    @input="(val)=>{ $nextTick(()=>{ articleData.ppa_loop_image = val })}"
                    currentDescription="尺寸建议800*800，最多为5张"
                    currentTitle="款式图片"
                  />

                </div>
              </div>

              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-scroll-area style="height: 200px;">
                    <q-list bordered separator class="full-width" v-if="allGoodsData && allGoodsData.length > 0">
                      <q-item-label header>选择服务项</q-item-label>
                      <q-separator />
                      <q-item @click="checkGoodsData(item)" :key="'goods-' + key" clickable v-for="(item, key) in allGoodsData">
                        <q-item-section>{{ item.goo_name }}</q-item-section>
                        <q-item-section side>
                          <q-icon color="purple" name="las la-check-circle" v-if="bindGoodsData.indexOf(item.id) > -1"></q-icon>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </div>
                <div class="col-6">
                  <q-card flat square bordered>
                    <div class="q-pa-sm">
                      选择标签
                    </div>
                    <q-separator />

                    <q-card-section class="q-gutter-sm q-pa-sm row" v-if="tagList.length > 0">
                      <div class="col-auto" v-for="(item, key) in tagList">
                        <q-btn
                          @click="pushSelectedTag(item)"
                          :label="item.ppt_name"
                          color="accent"
                          rounded
                          :unelevated="selectedTagData.indexOf(item.id) > -1 ? true : false"
                          :outline="selectedTagData.indexOf(item.id) > -1 ? false : true"
                        >
                        </q-btn>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
              <div>
                <hl-editor
                  :content="articleData.ppa_content"
                  @change="
                    (content) => {
                      articleData.ppa_content = content;
                    }
                  "
                  :minHeight="$q.screen.height * 0.4"
                  titleText="内容"
                ></hl-editor>
              </div>
            </q-form>
          </div>
        </div>

        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm q-mb-sm">
          <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'PatternAddArticle',
  components: {},
  data () {
    return {

      persistent: true,

      showDialog: true,
      addButtonDisabled: false,
      articleData: {
        ppa_sort: '0',
        ppa_title: '',
        ppa_content: '',
        ppa_loop_image: [],
        ppa_type_id: '',
        ppa_property: 'none'
      },
      tagList: [],
      typeList: [],
      selectedTagData: [],
      bindGoodsData: [],
      allGoodsData: [],
      userData: [],
      sortTypeData: [
        {
          label: '推荐',
          value: 'top'
        },
        {
          label: '热门',
          value: 'hot'
        },
        {
          label: '无',
          value: 'none'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    getTagList () {
      this.$store
        .dispatch('pattern/getTagList')
        .then((res) => {
          if (res.code == 200) {
            this.tagList = res.data && res.data.tagList ? res.data.tagList : []
            this.typeList = res.data && res.data.typeList ? res.data.typeList : []
            this.allGoodsData = res.data && res.data.allGoodsData ? res.data.allGoodsData : []
            this.userData = res.data && res.data.userData ? res.data.userData : []
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
    },
    checkGoodsData (item) {
      if (this.bindGoodsData.indexOf(item.id) > -1) {
        this.bindGoodsData.splice(this.bindGoodsData.indexOf(item.id), 1)
      } else {
        this.bindGoodsData.push(item.id)
      }
    },
    init (id) {
      this.getTagList()
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('pattern/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.articleData = res.data ? res.data : {}

              if (res.data && res.data.tag) {
                this.selectedTagData = res.data.tag.map((item) => {
                  return item.pat_tag_id
                })
              }
              if (res.data && res.data.goods && res.data.goods.length > 0) {
                this.bindGoodsData = res.data.goods.map((item) => {
                  return item.pat_tag_id
                })
              }
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
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
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData () {
      this.$refs.articleDataRef.validate().then((success) => {
        if (success) {
          // if (this.selectedTagData.length == 0) {
          //   this.$q.notify({
          //     message: '请选择标签',
          //     color: 'red',
          //     icon: 'ion-close-circle-outline',
          //     timeout: 500,
          //     position: 'top-right'
          //   })
          //   return false
          // }
          // if (this.articleData.ppa_loop_image.length == 0) {
          //   this.$q.notify({
          //     message: '请添加图片',
          //     color: 'red',
          //     icon: 'ion-close-circle-outline',
          //     timeout: 500,
          //     position: 'top-right'
          //   })
          //   return false
          // }
          this.addButtonDisabled = true
          const params = {
            ...this.articleData,
            selectedTagData: this.selectedTagData,
            bindGoodsData: this.bindGoodsData
          }
          this.$store
            .dispatch('pattern/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.articleData.id > 0 ? '修改' : '新增'}` + '文章成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
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

    // 选中的标签
    pushSelectedTag (item) {
      const tagPosition = this.selectedTagData.indexOf(item.id)
      if (tagPosition >= 0) {
        this.selectedTagData.splice(tagPosition, 1)
      } else {
        this.selectedTagData.unshift(item.id)
      }
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
