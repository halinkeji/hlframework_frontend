<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        height: parseInt(this.$q.screen.width * 0.6) + 'px',
      }"
      class="bg-grey-2"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-sm q-pa-xs q-mb-xs">
          <div class="text-subtitle1">模板详情</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height q-pb-sm bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="newsDataRef" class="fit">
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-input outlined disable borderless v-model="templateData.pwt_title" dense label="模板标题" />
                </div>
                <div class="col-12">
                  <q-input outlined disable borderless v-model="templateData.pwt_scene_desc" dense label="场景说明" />
                </div>
                <div class="col-12">
                  <q-list bordered dense v-if="templateData.pwt_kid_list && templateData.pwt_kid_list.length > 0">
                    <q-item-label class="q-pa-sm text-center">内容</q-item-label>
                    <q-separator />
                    <q-item :key="'k' + key" v-for="(item, key) in templateData.pwt_kid_list">
                      <q-item-section>
                        <q-item-label> {{ item.name }}：{{ item.example }} </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-form>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm q-mt-xs text-center justify-center">
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

      templateData: {
        pwt_number: '',
        pwt_template_id: '',
        pwt_status: '1',
        pwt_kid_list: [],
        pwt_scene_desc: '',
        pwt_type: '',
        pwt_title: ''
      }

    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (templateId) {
      this.addStoreSidebar = true

      if (templateId > 0) {
        this.$store
          .dispatch('wxapp/getTemplateItem', {
            id: templateId
          })
          .then((res) => {
            if (res.code == 200) {
              this.templateData = res.data && res.data.id ? res.data : {}
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
    },

    hideNowPage () {
      this.addStoreSidebar = false
      this.$emit('getMethods')
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
