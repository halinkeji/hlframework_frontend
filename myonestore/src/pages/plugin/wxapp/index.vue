<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-sm q-py-xs text-center q-mb-xs">
        <q-tabs v-model="tab" @input="changeTab" indicator-color="primary" dense active-color="primary" class="text-grey-8" align="left" inline-label>
          <q-tab name="set" label="基础设置" />
          <q-tab name="template" label="消息模板" />
           <q-tab name="code" label="上传发布" />
        </q-tabs>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == 'set'">
        <set-config />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == 'template'">
        <template-config />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == 'code'">
        <upload-code ref="uploadCodeRef" />
      </div>
      <div class="col-shrink bg-white text-center q-pb-xs">
      </div>
    </div>
  </q-page>
</template>

<script>
import templateConfig from './template.vue'
import setConfig from './set.vue'
import UploadCode from './UploadCode.vue'

export default {
  name: 'wxapp',
  components: {
    templateConfig,
    setConfig,
    UploadCode
  },
  data () {
    return {
      tab: 'set'
    }
  },
  created () {},
  mounted () {},

  computed: {},
  methods: {
    changeTab () {
      if (this.tab == 'code') {
        this.$nextTick(() => {
          this.$refs.uploadCodeRef.init()
        })
      }
    }
  }
}
</script>
