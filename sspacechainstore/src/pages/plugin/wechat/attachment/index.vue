<template>
  <q-page class="fit bg-white">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg q-pt-sm">
        <div class="row bg-white">
          <q-tabs v-model="tab" dense class="text-black bg-white" active-color="primary" indicator-color="primary" narrow-indicator>
            <q-tab name="graphic" label="图文" :ripple="false"> </q-tab>
            <q-tab name="picture" label="图片" :ripple="false"> </q-tab>
            <q-tab name="voice" label="语音" :ripple="false"> </q-tab>
            <q-tab name="video" label="视频" :ripple="false"> </q-tab>
          </q-tabs>
        </div>
        <q-separator />
        <div class="row q-gutter-sm items-center">
          <div class="row bg-white q-px-sm q-gutter-sm">
            <q-btn color="primary" :outline="tab1 == 'all'" :flat="tab1 != 'all'" padding="sm xl" rounded @click="tab1 = 'all'" label="全部" />
            <q-btn color="primary" :outline="tab1 == 'wechat'" :flat="tab1 != 'wechat'" padding="sm xl" rounded @click="tab1 = 'wechat'" label="微信" />
            <q-btn color="primary" :outline="tab1 == 'serverss'" :flat="tab1 != 'serverss'" padding="sm xl" rounded @click="tab1 = 'serverss'" label="服务器" />
          </div>

          <q-space />
          <q-input color="grey-3" input-class="text-grey" dense placeholder="标题/作者/摘要" outlined v-model="text">
            <template v-slot:append>
              <q-btn stretch flat icon="search" />
            </template>
          </q-input>
          <div>
            <q-btn outline class="q-px-lg q-mr-md" color="blue-6 " label="同步微信" />
            <q-btn unelevated class="q-px-md " color="blue-6 " label="新建图文消息" />
          </div>
        </div>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-grey-2">
        <q-scroll-area class="fit full-height">
          <div class="row">
            <div class="col-12  col-sm-6 col-md-4 col-lg-2 q-pa-xs" v-for="i in 20">
              <q-card class="my-card" flat bordered>
                <q-card-section class="q-py-none">
                  <q-card class="my-card" flat>
                    <div class="row">
                      <div class="col-12">
                        <q-item class="q-px-none">
                          <q-item-section>
                            <q-item-label>2021年05月25日 <q-icon name="font_download" class="float-right"/></q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                    <q-separator />
                    <q-img height="150px" class="q-my-sm">
                      <div class="absolute-bottom text-subtitle1 no-padding">
                        单店版
                      </div>
                    </q-img>
                  </q-card>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row">
                    <div class="col-8">哈林智慧棋牌茶楼多店版</div>
                    <div class="col-4">
                      <q-img height="60px" />
                    </div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row">
                    <div class="col-8">加盟版</div>
                    <div class="col-4">
                      <q-img height="60px" />
                    </div>
                  </div>
                </q-card-section>

                <q-card-section class="no-padding">
                  <q-btn-group unelevated stretch spread class="bg-grey-3 q-py-md">
                    <q-btn :ripple="false" flat color="grey" icon=" near_me">
                      <q-tooltip content-class="bg-white text-black">
                        群发
                      </q-tooltip>
                    </q-btn>
                    <q-btn :ripple="false" flat outline color="grey" icon="edit">
                      <q-tooltip content-class="bg-white text-black">
                        编辑
                      </q-tooltip>
                    </q-btn>
                    <q-btn :ripple="false" flat color="grey" icon="las la-trash">
                      <q-tooltip content-class="bg-white text-black">
                        删除
                      </q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
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
      tab: 'graphic',
      text: '',
      tab1: 'all',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
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
