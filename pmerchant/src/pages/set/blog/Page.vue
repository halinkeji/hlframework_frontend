<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white row q-px-xs q-py-sm">
      <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
      {{ $store.state.blog.attributeObject[attribute] }}
    </div>
    <div class="col-shrink full-height bg-white q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height">
        <q-form ref="newsDataRef" class="row q-col-gutter-sm q-mt-sm q-px-sm">
          <!-- <div class="col-6">
            <q-input
              outlined
              dense
              v-model="blogData.pb_title"
              label="信息标题"
              maxlength="255"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '信息标题不能为空']"
            />
          </div> -->

          <div class="col-2">
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

          <!-- <div class="col-4 text-center">
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
          </div> -->

          <div class="col-12">
            <hl-editor
              @change="
                (v) => {
                  blogData.pb_content = v;
                }
              "
              :content="blogData.pb_content"
              :minHeight="$q.screen.height * 0.6"
              class="fit"
              titleText="内容"
            ></hl-editor>
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-shrink bg-white q-py-sm q-mt-xs row q-gutter-sm text-center justify-center">
      <q-btn unelevated class="q-px-xl" label="保存" @click="saveData()" color="primary" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogManage',
  props: ['attribute'],
  data () {
    return {
      dataId: 0,
      blogData: {
        pb_title: '',
        pb_content: '',
        pb_picture: '',
        pb_status: '1',
        pb_type: 'page',
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
  created () {
    this.init()
  },
  methods: {
    init () {
      this.blogData.pb_attribute = this.attribute
      this.$store
        .dispatch('blog/getItem', {
          blog: this.attribute
        })
        .then((res) => {
          if (res.code == 200) {
            this.blogData = res.data
              ? res.data
              : {
                  pb_title: '',
                  pb_content: '',
                  pb_picture: '',
                  pb_status: '1',
                  pb_type: 'page',
                  pb_attribute: this.attribute
                }
          }
        })
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.stop = true

          const obj = {
            ...this.blogData
          }
          this.$store
            .dispatch('blog/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
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
</style>
