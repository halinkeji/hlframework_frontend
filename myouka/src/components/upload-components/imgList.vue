<template>
  <q-dialog @hide="closeUpload" v-model="imgPopupStatus">
    <q-card
      flat
      bordered
      class="bg-white column"
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
    >
      <q-card-section class="q-pa-none col-1 q-px-md">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-subtitle2">图片管理</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" class="q-pa-none" round flat v-close-popup icon="ion-close-circle-outline"> </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <div class="row col-9 fit q-pt-xs">
        <div class="col-12 col-md-3">
          <file-group
            ref="groupRef"
            @showOperateIndex="
              (v) => {
                showOperateIndex = v;
              }
            "
          ></file-group>
        </div>
        <div class="col-12 col-md-9" v-if="showOperateIndex == 'upload'">
          <img-upload :multiple="multiple" @uploadSuccess="uploadSuccess" @changeUploadBtn="changeUploadBtn" ref="imgUploadRef"></img-upload>
        </div>
        <div class="col-12 col-md-9" v-else>
          <q-layout
            view="lHr Lpr lFr"
            container
            :style="{
              height: dialogHeight,
              'mix-height': dialogHeight,
            }"
          >
            <q-page-container>
              <q-header reveal class="row q-gutter-sm q-px-sm bg-white">
                <div class="col">
                  <q-input outlined clearable v-model="search_data.name" label="文件名称" dense>
                    <template v-slot:append>
                      <q-btn @click="getImageList" round dense flat icon="ion-search" />
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-select
                    outlined
                    v-model="search_data.type"
                    :options="statusList"
                    option-value="code"
                    option-label="name"
                    option-disable="inactive"
                    emit-value
                    dense
                    map-options
                    @input="getImageList"
                  />
                </div>
                <div class="col">
                  <q-input label="选择日期" clearable v-model="search_time" dense outlined readonly>
                    <template v-slot:append>
                       <q-icon color="grey" v-if="search_time" @click="search_time = '';search_data.time = ''" name="cancel"></q-icon>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                           <q-date minimal v-model="search_time" @input="changeDate">
                             <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat  />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <q-btn @click="getImageList" color="primary"  unelevated label="搜索" />
              </q-header>

              <q-page>
                <div class="row q-col-gutter-sm q-px-sm " v-if="list.length > 0">
                  <div class="col-6 col-md-2 " v-for="(img, imgKey) in list">
                    <q-img
                      :src="$q.localStorage.getItem('myouka_system_local').attach_url + img.path"
                      style="width: 100%"
                      :ratio="1"
                      native-context-menu
                      @click="handleSelectImage(img)"
                      :class="{
                        selected_img_border: img.selected,
                      }"
                    >
                      <q-icon size="sm" color="red" v-if="img.selected" name="ion-checkmark-circle absolute-top-right"></q-icon>

                      <div class="absolute-bottom text-body2 text-center">
                        <div>{{ img.filename }}</div>
                        <div v-if="img.label">{{ img.label }}</div>
                      </div>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">图片请求错误</div>
                      </template>

                      <template v-if="!img.path">
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">图片丢失</div>
                      </template>
                    </q-img>
                  </div>
                </div>
                <div v-else class="text-center q-pt-xl">
                  <div>
                    <q-icon name="ion-ios-cloud-outline" size="150px" color="primary"> </q-icon>
                  </div>

                  <div class="text-primary">暂无图片</div>
                </div>
              </q-page>

              <q-footer class="bg-white q-py-sm">
                <hl-pagination
                  @current-change="currentChangeHandle"
                  @size-change="sizeChangeHandle"
                  :inputCol="3"
                  :current-page="imgRes.pageIndex"
                  :page-sizes="[18,36,54,108]"
                  :page-size="imgRes.pSize"
                  :total="imgRes.pageTotal"
                ></hl-pagination>
              </q-footer>
            </q-page-container>
          </q-layout>
        </div>
      </div>

      <q-separator class="q-my-xs" />

      <div class="justify-center q-mr-md row q-gutter-md q-py-sm">
        <q-btn @click="handleCancelAll" unelevated color="grey" class="text-dark q-px-xl" label="取消已选">
          <q-badge v-if="parseInt(selectedImgNum) > 0" color="red" floating>{{ selectedImgNum }}</q-badge>
        </q-btn>
        <q-btn unelevated color="red" @click="updataImageData('del')" class="q-px-xl" label="确定删除">
          <q-badge v-if="parseInt(selectedImgNum) > 0" color="red" floating>{{ selectedImgNum }}</q-badge>
        </q-btn>
        <q-btn unelevated color="amber-7" @click="openChangeSearchData" class="q-px-xl" label="更换分组">
          <q-badge v-if="parseInt(selectedImgNum) > 0" color="red" floating>{{ selectedImgNum }}</q-badge>
        </q-btn>
        <q-btn unelevated color="positive" @click="clickUploadBtn" class="q-px-xl" v-if="uploadBtnStatus" label="上传">

        </q-btn>
        <q-btn unelevated color="primary" @click="getImageData" class="q-px-xl" label="确定">
          <q-badge v-if="parseInt(selectedImgNum) > 0" color="red" floating>{{ selectedImgNum }}</q-badge>
        </q-btn>
      </div>
    </q-card>

    <q-dialog v-model="groupPopupStatus" @hide="closeUploadGroup" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">分组管理</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            outlined
            v-model="newGroupId"
            :options="groupList"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat @click="updataImageData('updata')" v-close-popup label="保存" />
          <q-btn flat label="关闭" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import fileGroup from './fileGroup.vue'
import imgUpload from './imgUpload.vue'
export default {
  name: 'PageIndex',
  props: ['multiple'],
  components: {
    fileGroup,
    imgUpload
  },
  data () {
    return {
      groupPopupStatus: false,
      drawerLeft: true,
      imgPopupStatus: true,
      search_data: {
        type: 'timeDesc',
        name: '',
        time: ''
      },
      statusList: [
        {
          code: 'timeAsc',
          name: '上传时间正序'
        },
        {
          code: 'timeDesc',
          name: '上传时间倒序'
        },
        {
          code: 'nameAsc',
          name: '名称正序'
        },
        {
          code: 'nameDesc',
          name: '名称倒序'
        }
      ],
      imgRes: {
        pageIndex: 1,
        pSize: 18,
        pageTotal: 0
      },
      list: [],
      selectedImgs: [],
      selectedImgUrl: [],
      showOperateIndex: 'all',
      groupList: [],
      newGroupId: '',
      search_time: '',
      dialogWidth: '600px',
      dialogHeight: '650px',
      uploadBtnStatus: false
    }
  },
  watch: {
    showOperateIndex (v) {
      if (v != 'upload') {
        this.getImageList()
      }
    }
  },
  computed: {
    selectedImgNum () {
      if (this.selectedImgs) {
        return this.selectedImgs.length
      }
      return 0
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + 'px'
    }
    if (this.$q.screen.height) {
      this.dialogHeight = parseInt(this.$q.screen.height * 0.61) + 'px'
    }
  },
  beforeMount () {},
  mounted () {
    this.getImageList()
  },
  methods: {
    changeUploadBtn (status) {
      this.uploadBtnStatus = status
    },
    clickUploadBtn () {
      this.$refs.imgUploadRef.confirmUpload()
    },
    changeDate () {
      this.search_data.time = this.$q_date.formatDate(this.search_time, 'X')
    },

    openChangeSearchData () {
      this.getFileGroupList()
      this.$nextTick(() => {
        this.groupPopupStatus = true
      })
    },
    getFileGroupList () {
      const payload = {}
      this.$store
        .dispatch('upload/getGroupList', payload)
        .then((res) => {
          this.groupList = res.data
        })
        .catch((error) => {})
    },
    handleSelectImage (img) {
      const index = this.selectedImgUrl.indexOf(img.base_url)
      // if (this.multiple) {
      if (index === -1) {
        this.selectedImgUrl.push(img.base_url)
        this.selectedImgs.push(img)
        img.selected = true
      } else {
        this.selectedImgs.splice(index, 1)
        this.selectedImgUrl.splice(index, 1)
        img.selected = false
      }
      // } else {
      //   // 单选时，取消已选
      //   this.handleCancelAll()
      //   this.selectedImgs.push(img)

      //   img.selected = true
      // }
    },
    updataImageData (model = 'updata') {
      if (this.selectedImgs.length > 0) {
        const updataIds = this.selectedImgs.map((i) => {
          return i.id
        })

        const payload = {
          updataIds,
          newGroupId: this.newGroupId,
          model
        }
        this.$store
          .dispatch('upload/setImageData', payload)
          .then((res) => {
            if (res.code == 200) {
              this.newGroupId = ''

              this.$q.notify({
                message: `成功${(model == 'updata' ? '修改' : '删除') + res.data.sCount}、失败${res.data.eCount}`,
                color: 'green',
                position: 'top'
              })
              this.selectedImgs = []
              this.getImageList()
            } else {
              this.$q.notify({
                message: `${model == 'updata' ? '修改' : '删除'}失败，${model == 'updata' ? '修改' : '删除'}图片信息失败`,
                color: 'red',
                position: 'top'
              })
              this.selectedImgs = []
            }
          })
          .catch((error) => {})
      } else {
        this.$q.notify({
          message: '请选择需要更改的图片',
          color: 'red',
          position: 'top'
        })
      }
    },
    /**
     *  取消已选
     */
    handleCancelAll () {
      this.selectedImgs = []
      for (const i in this.list) {
        this.list[i].selected = false
      }
    },

    getImageList () {
      const payload = {
        ...this.imgRes,
        ...this.search_data,
        gid: parseInt(this.showOperateIndex)
      }
      this.$store
        .dispatch('upload/getImageList', payload)
        .then((res) => {
          if (res.code == 200) {
            const imgs = []
            if (res.data && res.data.list) {
              for (const i in res.data.list) {
                const img = res.data.list[i]
                img.selected = false
                imgs.push(img)
              }
              this.list = imgs

              this.imgRes.pageTotal = parseInt(res.data.page.totalCount)
            } else {
              this.list = []
              this.imgRes.pageTotal = 0
            }
          } else {
            this.$q.notify({
              message: '图片加载失败！',
              color: 'red',
              position: 'top'
            })
          }
        })
        .catch((error) => {})
    },

    /**
     * 多选时同步已选图片数量
     */
    syncSelectedImgCount () {
      this.selectedImgCount = this.selectedImgs.length
    },

    // 当前页
    currentChangeHandle (pageIndex) {
      this.imgRes.pageIndex = pageIndex
      this.getImageList(pageIndex)
    },
    sizeChangeHandle (val) {
      this.imgRes.pSize = val
      this.getImageList()
    },
    getImageData () {
      const selectedImgs = this.selectedImgs

      this.$emit('imageData', selectedImgs)
    },
    closeUpload () {
      this.$emit('closeUpload', false)
    },
    closeUploadGroup () {
      this.newGroupId = ''
    },

    uploadSuccess () {
      this.showOperateIndex = 'all'
      this.$nextTick(() => {
        this.getImageList()
      })
    }
  }
}
</script>
<style>
.selected_img_border {
  border-style: solid;
  border-width: 2px;

  border-color: red;
}
</style>
