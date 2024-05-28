<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="bg-grey-2"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-sm q-pa-xs  q-mb-xs">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height q-pb-sm bg-white">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="newsDataRef" class="fit">
              <div class="row q-pa-xs items-start">
                <div class="col-10">
                  <div class="row items-start q-gutter-xs">
                    <div class="col-12">
                      <q-input
                        outlined
                        dense
                        v-model="blogData.pb_title"
                        label="信息标题"
                        maxlength="255"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '信息标题不能为空']"
                      />
                    </div>

                    <div class="col-5">
                      <q-select
                        outlined
                        option-value="value"
                        option-label="label"
                        emit-value
                        map-options
                        :options="statusOptions"
                        v-model="blogData.pb_status"
                        dense
                        label="状态"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-2 text-center">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="blogData.coverImage"
                    @input="
                      (val) => {
                        $nextTick(() => {
                          blogData.pb_picture = val;
                        });
                      }
                    "
                    currentTitle="信息封面图"
                    urrentDescription="建议尺寸比例4:3"
                  />
                </div>

                <div class="col-12">
                  <hl-editor
                    @change="
                      (v) => {
                        blogData.pb_content = v;
                      }
                    "
                    :content="blogData.pb_content"
                    :minHeight="$q.screen.height * 0.45"
                    class="fit"
                    titleText="内容"
                  ></hl-editor>
                </div>
              </div>
            </q-form>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm q-mt-xs text-center justify-center">

          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'BlogManage',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      blogData: {
        pb_title: '',
        pb_content: '',
        pb_picture: '',
        pb_status: '1',
        pb_type: 'list',
        pb_attribute: ''
      },
      stop: false,
      multiple: false,
      uploadImgStatus: false,

      statusOptions: [
        { label: '显示', value: '1' },
        { label: '隐藏', value: '0' }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id, attribute) {
      this.dataId = id
      this.addStoreSidebar = true
      this.blogData.pb_attribute = attribute
      if (id > 0) {
        this.$store
          .dispatch('blog/getItem', {
            blog_id: id
          })
          .then((res) => {
            if (res.code == 200) {
              this.blogData = res.data ? res.data : {}
            }
          })
      }
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.stop = true
          this.addStoreSidebar = false
          const obj = {
            ...this.blogData,
            id: this.dataId
          }
          this.$store
            .dispatch('blog/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存信息成功',
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
                message: '错误',
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
.blog-xxx
</style>
