<template>
  <q-page class="fit bg-white">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink q-pa-sm full-height bg-white row">
        <div class="col-3 bg-grey-2 q-px-sm q-pt-sm ">
          <q-scroll-area class="fit full-height">
            <q-card class="my-card" flat square bordered>
              <q-card-section class="q-pa-none cursor-pointer">
                <q-img height="200px">
                  <div class="absolute-bottom text-subtitle1 no-padding">
                    单店版
                  </div>
                </q-img>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-none cursor-pointer">
                <q-card-section horizontal class="items-center " :class="{ 'border-primary': key == 1 }">
                  <q-card-section class="q-pt-xs col-7 ">
                    <div class="text-body11 q-mt-sm q-mb-xs">Title</div>
                  </q-card-section>

                  <q-card-section class="col-5 text-right">
                    <q-img class="rounded-borders" width="50px" :ratio="1" src="https://cdn.quasar.dev/img/parallax2.jpg" />
                  </q-card-section>
                </q-card-section>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-none cursor-pointer">
                <q-card-section horizontal class="items-center ">
                  <q-card-section class="q-pt-xs col-7 ">
                    <div class="text-body11 q-mt-sm q-mb-xs">Title</div>
                  </q-card-section>

                  <q-card-section class="col-5 text-right">
                    <q-img class="rounded-borders" width="50px" :ratio="1" src="https://cdn.quasar.dev/img/parallax2.jpg" />
                  </q-card-section>
                </q-card-section>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center cursor-pointer">
                <q-icon color="grey" size="80px" name="add"></q-icon>
              </q-card-section>
            </q-card>
          </q-scroll-area>
        </div>

        <div class="col-5 offset-md-2 ">
          <q-scroll-area class="fit full-height">
            <q-form class="q-gutter-sm q-mt-sm">
              <!-- 注意这个细节、将上传图片事件放到点击图片上 -->
              <div>
                文章封面
              </div>
              <div>
                <q-img :src="`${$q.localStorage.getItem('cychainstore_system_local').attach_url}` + img" width="160px" height="80px">
                  <template v-if="!img">
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                    </div>
                  </template>
                  <q-btn round size="md" color="red" v-else :ripple="false" flat @click="delImage" class="absolute-top-right" icon="delete_forever"></q-btn>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3  text-dark">
                      <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                    </div>
                  </template>
                </q-img>

                <div class="q-mt-sm text-grey-8">
                  点击图片选择封面；建议尺寸比例2:1
                </div>
              </div>

              <div>
                标题
              </div>
              <q-input dense outlined v-model="name" lazy-rules />
              <div>
                作者
              </div>
              <q-input dense outlined v-model="name" lazy-rules />
              <div>
                链接地址
              </div>
              <q-input dense outlined v-model="name" lazy-rules />
              <div>
                摘要
              </div>
              <q-input dense outlined v-model="name" rows="3" type="textarea" lazy-rules />
              <div>
                内容
              </div>
              <hl-editor
                @change="
                  (v) => {
                    name = v
                  }
                "
                :content="name"
              ></hl-editor>
            </q-form>
          </q-scroll-area>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-md q-mt-sm">
        <q-btn color="primary" unelevated label="保存到本地" />
        <q-btn color="primary" unelevated label="保存并上传到公众号" />
        <q-btn color="grey" unelevated label="返回列表" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  // props:[],
  components: {},
  data () {
    return {
      name: '',
      img: '',
      key: 1
    }
  },
  watch: {},
  created () {},
  mounted () {},
  computed: {},
  methods: {
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
<style scoped>
.border-primary {
  border-style: solid;
  border-width: 2px;
  color: #027be3;
}
</style>
