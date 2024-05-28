<template>
  <div class="q-mt-sm">
    <div class="q-px-xs">{{ currentTitle }}</div>
    <div class="row q-gutter-sm" v-if="currentAttachData && currentAttachData.length > 0 && multiple">
      <div v-for="(item, key) in currentAttachData">
        <div v-if="item && item.path">
          <q-img :src="$q.localStorage.getItem('pmerchant_system_local').attach_url + item.path" :width="`${size}px`" :height="`${size}px`">
            <div
              class="transparent absolute-bottom-right text-subtitle2 flex flex-center cursor-pointer q-pa-none no-padding row q-gutter-xs q-ma-xs"
            >
              <div class="col">
                <q-btn
                  size="sm"
                  color="primary"
                  :ripple="false"
                  dense
                  v-if="item.path"
                  icon="remove_red_eye"
                  class="full-width"
                  unelevated
                  @click="openImageDialog(key)"
                ></q-btn>
              </div>
              <div class="col">
                <q-btn
                  size="sm"
                  color="red"
                  :ripple="false"
                  dense
                  v-if="item.path"
                  icon="delete_forever"
                  class="full-width"
                  unelevated
                  @click="delImage(key)"
                ></q-btn>
              </div>
            </div>
            <template v-if="!item.path">
              <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                <q-icon name="wallpaper" color="grey" :size="`${size * 0.5}px`"> </q-icon>
              </div>
            </template>

            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                <q-icon name="wallpaper" color="grey" :size="`${size * 0.5}px`"> </q-icon>
              </div>
            </template>
          </q-img>
        </div>
      </div>
    </div>
    <div v-if="multiple && (!currentAttachData || currentAttachData.length <= 0)">
      <q-img :width="`${size}px`" :height="`${size}px`">
        <template>
          <div class="absolute-full flex flex-center bg-grey-3 text-dark">
            <q-icon name="wallpaper" color="grey" :size="`${size * 0.5}px`"> </q-icon>
          </div>
        </template>
      </q-img>
    </div>
    <div v-if="!multiple">
      <div v-if="currentAttachObject && currentAttachObject.path">
        <q-img
          :src="$q.localStorage.getItem('pmerchant_system_local').attach_url + currentAttachObject.path"
          :width="`${size}px`"
          :height="`${size}px`"
        >
          <div class="transparent absolute-bottom-right text-subtitle2 flex flex-center cursor-pointer q-pa-none no-padding row q-gutter-xs q-ma-xs">
            <div class="col">
              <q-btn
                size="sm"
                color="primary"
                :ripple="false"
                dense
                v-if="currentAttachObject.path"
                icon="remove_red_eye"
                class="full-width"
                unelevated
                @click="openImageDialog(0)"
              ></q-btn>
            </div>
            <div class="col">
              <q-btn
                size="sm"
                color="red"
                :ripple="false"
                dense
                v-if="currentAttachObject.path"
                icon="delete_forever"
                class="full-width"
                unelevated
                @click="delOneImage"
              ></q-btn>
            </div>
          </div>
          <template v-if="!currentAttachObject.path">
            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
              <q-icon name="wallpaper" color="grey" :size="`${size * 0.5}px`"> </q-icon>
            </div>
          </template>

          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
              <q-icon name="wallpaper" color="grey" :size="`${size * 0.5}px`"> </q-icon>
            </div>
          </template>
        </q-img>
      </div>
      <div v-else>
        <q-img :width="`${size}px`" :height="`${size}px`">
          <template>
            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
              <q-icon name="wallpaper" color="grey" :size="`${size * 0.5}px`"> </q-icon>
            </div>
          </template>
        </q-img>
      </div>
    </div>

    <div class="text-caption text-grey">
      {{ currentDescription }}
    </div>
    <div>
      <q-btn :style="`width:${btnSize}px`" :dense="btnDense" unelevated color="primary" class="q-my-sm" label="选择图片" @click="clickImage" />
    </div>

    <upload-img v-if="uploadImgStatus" @imageData="getImageData" :multiple="multiple" @closeUpload="closeUpload"></upload-img>
  </div>
</template>

<script>
export default {
  name: 'hlUpload',
  props: {
    currentTitle: {
      type: String,
      required: false,
      default: ''
    },
    currentAttach: {
      type: [Array, String, Object],
      required: false,
      default: null
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },

    currentDescription: {
      type: String,
      required: false,
      default: ''
    },
    maxTotal: {
      type: Number,
      required: false
    },
    size: {
      type: Number,
      required: false,
      default: 100
    },
    btnDense: {
      type: Boolean,
      required: false,
      default: false
    },
    btnSize: {
      type: Number,
      required: false,
      default: 100
    }
  },
  data () {
    return {
      uploadImgStatus: false,
      currentAttachData: [],
      currentAttachObject: {},
      viewPageStatus: false,
      miniState: -1
    }
  },
  watch: {
    currentAttach (newValue, oldValue) {
      this.$nextTick(() => {
        if (this.multiple) {
          if (newValue) {
            this.$nextTick(() => {
              this.currentAttachData = newValue
              this.emitImageIds(newValue)
            })
          }
        } else {
          this.$nextTick(() => {
            if (newValue) {
              this.currentAttachObject = newValue
              this.emitImageIds(newValue)
            }
          })
        }
      })
    }
  },
  created () {
    if (this.multiple) {
      this.$nextTick(() => {
        if (this.currentAttach) {
          this.currentAttachData = this.currentAttach
        }
      })
    } else {
      this.$nextTick(() => {
        if (this.currentAttach) {
          this.currentAttachObject = this.currentAttach
        }
      })
    }
    this.emitImageIds(2)
  },
  methods: {
    mouseoverImage (key) {
      console.log('111')
      this.miniState = key
    },
    mouseoutImage () {
      console.log('222')
      this.miniState = -1
    },
    clickImage () {
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },

    closeUpload () {
      this.uploadImgStatus = false
    },
    getImageData (val) {
      const that = this
      this.uploadImgStatus = false
      if (that.multiple && val) {
        val.forEach(function (item, key) {
          if (that.currentAttachData.length < that.maxTotal) {
            that.currentAttachData.push(item)
          }
        })
        const idsData = []
        that.currentAttachData.forEach(function (item) {
          idsData.push(item.id)
        })

        that.$emit('input', idsData, that.currentAttachData)
      } else {
        val.forEach(function (item) {
          that.currentAttachObject = item
          that.$emit('input', item.id, that.currentAttachObject)
        })
      }
    },
    delOneImage () {
      this.currentAttachObject = {}
      this.$emit('input', '')
    },

    emitImageIds () {
      const that = this

      if (this.multiple) {
        const idsData = []
        that.currentAttachData.forEach(function (item) {
          idsData.push(item.id)
        })
        this.$emit('input', idsData, that.currentAttachData)
      } else {
        this.$nextTick(() => {
          that.$emit('input', that.currentAttachObject.id, that.currentAttachObject)
        })
      }
    },
    delImage (key) {
      const that = this
      this.currentAttachData.splice(key, 1)
      const idsData = []
      that.currentAttachData.forEach(function (item) {
        idsData.push(item.id)
      })
      this.$emit('input', idsData, that.currentAttachData)
    },
    openImageDialog (index) {
      let imagesData = []
      const initialViewIndex = index
      if (this.$q.localStorage.getItem('pmerchant_system_local')) {
        const attachUrl = this.$q.localStorage.getItem('pmerchant_system_local').attach_url
        if (this.currentAttachData && this.currentAttachData.length > 0 && this.multiple) {
          imagesData = this.currentAttachData.map((item) => {
            return attachUrl + item.path
          })
        }

        if (this.currentAttachObject && this.currentAttachObject.path && !this.multiple) {
          imagesData.push(attachUrl + this.currentAttachObject.path)
        }
        if (imagesData && imagesData.length > 0) {
          this.$viewerApi({
            options: {
              zIndex: 9999,
              toolbar: {
                zoomIn: true,
                zoomOut: true,
                oneToOne: true,
                reset: true,
                prev: true,
                // play: true,
                next: true,
                rotateLeft: true,
                rotateRight: true,
                flipHorizontal: true,
                flipVertical: true
              },
              // url: 'data-source',
              initialViewIndex: initialViewIndex
            },
            images: imagesData
          })
        }
      }
    }
  },
  computed: {}
}
</script>
