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
        <div class="col-shrink bg-white row q-px-sm q-pa-xs q-mb-xs">
          <div class="text-subtitle1">新增模板</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height q-pb-sm bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="newsDataRef" class="fit">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-select
                    outlined
                    option-value="pwt_number"
                    option-label="title"
                    emit-value
                    map-options
                    :options="defaultTemplateData"
                    v-model="templateData.pwt_number"
                    dense
                    label="选择模板"
                    @input="changeDefaultTemplate"
                    :rules="[(val) => (val && val.length > 0) || '请选择模板']"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    v-model="templateData.pwt_scene_desc"
                    dense
                    label="场景说明"
                    :rules="[(val) => (val && val.length > 0) || '场景说明不能为空']"
                  />
                </div>
                <div class="col-6">
                  <q-list bordered dense v-if="notTextArr && notTextArr.length > 0">
                    <q-item-label class="q-pa-sm text-center">已选择</q-item-label>
                    <q-separator />
                    <q-item :key="'k' + key" v-for="(item, key) in notTextArr">
                      <q-item-section>
                        <q-item-label> {{ item.name }}：{{ item.example }} </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="col-6">
                  <q-list bordered v-if="templateKeywords && templateKeywords.length > 0">
                   <q-item-label class="q-pa-sm text-center">关键词</q-item-label>
                   <q-separator />
                    <q-item clickable :key="'k' + key" v-for="(item, key) in templateKeywords">
                      <q-item-section avatar>
                        <q-checkbox
                          v-model="checkKeywords"
                          @input="changeCheckData"
                          :val="item.kid"
                          :disable="checkKeywords.length >= 5 && checkKeywords.indexOf(item.kid) < 0 ? true : false"
                        />
                      </q-item-section>

                      <q-item-section>{{ item.name }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-form>
          </q-scroll-area>
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
  name: 'EditTemplate',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      templateData: {
        pwt_number: '',
        pwt_template_id: '',
        pwt_status: '1',
        pwt_kid_list: [],
        pwt_scene_desc: '',
        pwt_type: '',
        pwt_title: ''
      },
      multiple: false,
      uploadImgStatus: false,

      statusOptions: [
        { label: '显示', value: '1' },
        { label: '隐藏', value: '0' }
      ],
      defaultTemplateData: [],
      templateKeywords: [],
      checkKeywords: [],
      notTextArr: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init () {
      this.addStoreSidebar = true
      this.getNotUseTemplate()
    },
    changeCheckData () {
      const that = this
      that.notTextArr = []

      if (this.checkKeywords && this.checkKeywords.length > 0) {
        if (this.templateKeywords && this.templateKeywords.length > 0) {
          this.checkKeywords.forEach((item, key) => {
            const index = _.findIndex(that.templateKeywords, function (o) {
              return o.kid == item
            })

            if (index > -1) {
              const i = that.templateKeywords[index]
              that.notTextArr.push({
                name: i.name,
                example: i.example,
                value: i.rule + i.kid,
                rule: i.rule,
                kid: i.kid
              })
            }
          })
        }
      }
    },

    changeDefaultTemplate () {
      const that = this
      this.$store
        .dispatch('wxapp/getTemplateKeywords', {
          tid: this.templateData.pwt_number
        })
        .then((res) => {
          if (res.code == 200) {
            this.templateKeywords = res.data ? res.data : []
            const index = _.findIndex(that.defaultTemplateData, function (o) {
              return o.pwt_number == that.templateData.pwt_number
            })
            if (index > -1) {
              this.templateData.pwt_title = that.defaultTemplateData[index].title
            }
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
        })
    },

    getNotUseTemplate () {
      this.$store
        .dispatch('wxapp/getNotUseTemplate', {})
        .then((res) => {
          if (res.code == 200) {
            this.defaultTemplateData = res.data ? res.data : {}
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
        })
    },

    saveData () {
      if (!(this.notTextArr && this.notTextArr.length > 1)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请选择关键字，最少2个',
          color: 'red'
        })
        return false
      }
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.templateData.pwt_kid_list = this.notTextArr
          const obj = {
            ...this.templateData,
            checkKeywords: this.checkKeywords
          }

          this.$store
            .dispatch('wxapp/setTemplateData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.addStoreSidebar = false
                this.$q.notify({
                  message: '成功',
                  caption: '保存模板成功',
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
