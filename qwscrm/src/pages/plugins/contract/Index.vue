<template>
  <div>
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2  text-left">
      <q-btn unelevated color="primary" label="新增合同" @click="addContract" />
    </div>
    <q-separator />
    <div class="col-shrink q-pa-sm full-height bg-white ">
      <!-- <q-scroll-area class="fit full-height"> -->
      <div :key="`item-${key}`" v-for="(item, key) in contractListData">
        <q-card flat class=" q-mb-sm">
          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle1">{{ item.no }}</div>
                <div class="text-subtitle2">签约企业：{{ item.company }}</div>
              </div>
              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list class="q-menu-list-width">
                      <q-item clickable class="q-px-sm" @click="addContract(item.id)">
                      <q-item-section>合同信息</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>

                       <q-item clickable class="q-px-sm" @click="updateStoreStatus(item.id)">
                      <q-item-section>合同状态</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>

                    <q-item clickable class="q-px-sm" @click="clickBindWorker(item)">
                      <q-item-section>售后人员</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label>{{  parseInt(item.type) == 1 ? '纸质合同' : '电子合同'  }}</q-item-label>
                  <q-item-label caption>签约日期：{{ formatDate(item.contract_time) }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{  parseInt(item.pay_type) == 1 ? '对公转账' : '对私转账'  }}</q-item-label>
                  <q-item-label caption>合同金额：{{ item.money }}元</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label>售后技术服务费：</q-item-label>
                  <q-item-label>{{ item.service_money }}元/年</q-item-label>
                </q-item-section>
                  <q-item-section>
                      <q-item-label >授权站点</q-item-label>
                  <q-item-label>{{ item.authorize_url }}</q-item-label>

              </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>{{ formatDate(item.contract_starttime) }}</q-item-label>
                  <q-item-label caption>合同开始时间</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ formatDate(item.contract_endtime) }}</q-item-label>
                  <q-item-label caption>合同结束时间</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption lines="3"><span class="text-dark">合同备注：</span>{{ item.remark }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="item.file_attach">
                <q-item-section>
                  <q-item-label class="q-my-sm">
                    <div
                      class="fixed-full image-gallery__blinder bg-grey-8"
                      :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0"
                      @click="zoomImage()"
                    />

                    <div class="row justify-left q-gutter-sm q-mx-auto scroll relative-position">
                      <q-img
                        v-for="(src, index) in item.imageData"
                        :key="index"
                        ref="refThumb"
                        class="image-gallery__image"
                        :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
                        :src="$q.localStorage.getItem('qwscrm_system_local').attach_url + src.path"
                        @click="zoomImage(index, item.imageData)"
                      />
                    </div>
                  </q-item-label>
                  <q-item-label class="q-mt-sm text-italic" :key="`label-${k}`" v-for="(i, k) in item.fileData">
                    <q-icon name="attach_file" color="primary" />
                    <span class="text-primary" @click="openFile($q.localStorage.getItem('qwscrm_system_local').attach_url + i.path)" >
                      {{ i.name }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-pa-none" dense v-if="item.product && item.product.length > 0">
                <q-item-section>
                  <q-expansion-item dense header-class="bg-grey-2">
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon color="primary" name="apps" />
                      </q-item-section>

                      <q-item-section>
                        合同签约产品
                      </q-item-section>
                    </template>

                    <q-card>
                      <q-card-section class="q-pa-xs">
                        <q-list bordered separator dense>
                          <q-item clickable v-ripple :key="`produck-${k}`" v-for="(i, k) in JSON.parse(item.product)">
                            <q-item-section>
                              <q-item-label>{{ i.name }}</q-item-label>
                              <q-item-label caption>授权价格： {{ i.money }} 元 ，售后技术服务费： {{ i.service_money }} 元/年</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="around">
          <q-btn outline dense color="deep-orange">{{ contractStatusObject[item.status] }}</q-btn>

          <q-btn outline dense>{{ item.serviceWorker && item.serviceWorker.name ? item.serviceWorker.name : '' }}</q-btn>
          <q-btn outline dense v-if="parseInt(item.status) < 8" @click="updateRefundStatus(item.id)">退款</q-btn>
        </q-card-actions>
        </q-card>
      <q-separator />
      </div>

      <!-- </q-scroll-area> -->
    </div>
    <q-img
      ref="refFull"
      class="image-gallery__image image-gallery__image-full fixed-center"
      :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
      :src="$q.localStorage.getItem('qwscrm_system_local').attach_url +  currentImage[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />
    <edit-contract v-if="addContractStatus" ref="editContractRef" @closeDialog="getData" />
    <bind-worker ref="bindWorkerRef" v-if="bindWorkerStatus" @closeDialog="getData" />
    <set-status ref="setStatusDialogRef" v-if="setStatusDialog" @closeDialog="getData" />
    <set-refund ref="setRefundDialogRef" v-if="setRefundStatusDialog" @closeDialog="getData" />
  </div>
</template>

<script>
import { date, morph } from 'quasar'
import EditContract from './EditContract'
import BindWorker from './BindWorker.vue'
import SetStatus from './SetStatus.vue'
import SetRefund from './SetRefund.vue'
export default {
  name: 'PageContract',
  props: ['contact_id'],
  components: {
    EditContract,
    BindWorker,
    SetStatus,
    SetRefund
  },
  data () {
    return {
      contractListData: [],
      addContractStatus: false,
      contractStatusObject: this.$store.state.contract.contractStatusObject,
      indexZoomed: void 0,
      imgLoaded: {
        promise: Promise.resolve(),
        resolve: () => {},
        reject: () => {}
      },
      currentImage: [],
      bindWorkerStatus: false,
      setStatusDialog: false,
      setRefundStatusDialog: false
    }
  },
  computed: {},
  mounted () {
    this.getData()
  },
  created () {},
  methods: {
    openFile (url) {
      if (url) {
        if (url.indexOf('docx') > -1 || url.indexOf('xlsx') > -1 || url.indexOf('pptx') > -1 || url.indexOf('doc') > -1 || url.indexOf('xls') > -1 || url.indexOf('ppt') > -1) {
          window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url, '_blank')
        } else {
          window.open(url, '_blank')
        }
      }
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日')
      }
      return '未授权'
    },
    addContract (contartId) {
      this.addContractStatus = true
      this.$nextTick(() => {
        this.$refs.editContractRef.init(contartId, this.contact_id)
      })
    },
    getData () {
      this.addContractStatus = false
      this.bindWorkerStatus = false
      this.setStatusDialog = false
      this.setRefundStatusDialog = false
      this.$store
        .dispatch('contract/getData', { contact_id: this.contact_id })
        .then((res) => {
          if (res.code == 200) {
            this.contractListData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    imgLoadedResolve () {
      this.imgLoaded.resolve()
    },

    imgLoadedReject () {
      this.imgLoaded.reject()
    },
    zoomImage (index, imageArr) {
      const { indexZoomed } = this
      if (imageArr && imageArr.length > 0) {
        this.currentImage = imageArr.map
        this.currentImage = imageArr.map((item) => {
          return item.path
        })
      }

      this.imgLoaded.reject()

      const zoom = () => {
        if (index !== void 0 && index !== indexZoomed) {
          this.imgLoaded.promise = new Promise((resolve, reject) => {
            this.imgLoaded.resolve = () => {
              this.imgLoaded.resolve = () => {}
              this.imgLoaded.reject = () => {}

              resolve()
            }
            this.imgLoaded.reject = () => {
              this.imgLoaded.resolve = () => {}
              this.imgLoaded.reject = () => {}

              reject()
            }
          })

          this.cancel = morph({
            from: this.$refs.refThumb[index].$el,
            to: this.$refs.refFull.$el,
            onToggle: () => {
              this.indexZoomed = index
            },
            waitFor: this.imgLoaded.promise,
            duration: 400,
            hideFromClone: true,
            onEnd: (end) => {
              if (end === 'from' && this.indexZoomed === index) {
                this.indexZoomed = void 0
              }
            }
          })
        }
      }

      if (indexZoomed !== void 0 && (this.cancel === void 0 || this.cancel() === false)) {
        morph({
          from: this.$refs.refFull.$el,
          to: this.$refs.refThumb[indexZoomed].$el,
          onToggle: () => {
            this.indexZoomed = void 0
          },
          duration: 200,
          keepToClone: true,
          onEnd: zoom
        })
      } else {
        zoom()
      }
    },
    clickBindWorker (item) {
      this.bindWorkerStatus = true
      this.$nextTick(() => {
        this.$refs.bindWorkerRef.init(item.id)
      })
    },
    updateStoreStatus (eventId) {
      this.setStatusDialog = true
      this.$nextTick(() => {
        this.$refs.setStatusDialogRef.init(eventId)
      })
    },
    updateRefundStatus (eventId) {
      this.setRefundStatusDialog = true
      this.$nextTick(() => {
        this.$refs.setRefundDialogRef.init(eventId)
      })
    }
  }
}
</script>
<style lang="scss">
.q-menu-list-width {
  min-width: 100px;
}
.q-item__section--main ~ .q-item__section--side {
  align-items: flex-end;
  padding-right: 0;
  padding-left: 0px;
}
.q-btn--fab .q-btn__wrapper {
  padding: 6px;
  min-height: 40px;
  min-width: 40px;
}
</style>

<style lang="sass">
.image-gallery
  &__image
    border-radius: 3%/5%
    width: 150px
    max-width: 20vw
    cursor: pointer

    &-full
      width: 800px
      max-width: 70vw
      z-index: 2002
      pointer-events: none

      &--active
        pointer-events: all
  &__blinder
    opacity: 0
    z-index: 2000
    pointer-events: none
    transition: opacity 0.3s ease-in-out

    &--active
      opacity: 0.6
      pointer-events: all

      + div > .image-gallery__image
        z-index: 2001
</style>
