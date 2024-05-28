<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        语音播报模板设置
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-my-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="ttlockConfigFormRef" class="row q-gutter-sm">
            <div class="col-12" :key="'card-' + key" v-for="(item, key) in speakTemplateData">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  {{ item.label }}
                </q-card-section>
                <q-separator />

                <q-card-section class="q-pa-none">
                  <q-list separator>
                    <q-item :key="'item-' + k" v-for="(i, k) in item.data">
                      <q-item-section avatar top class="q-pt-md">
                        <q-item-label>{{ i.label }}</q-item-label>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>
                          <q-input outlined dense label="内容" :rules="[(val) => !!val || '必填项']" v-model="i.value" maxlength="100"> </q-input>
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-toggle v-model="i.status" color="green" true-value="1" false-value="0" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'speak-tempate',
  data () {
    return {
      speakTemplateData: []
    }
  },
  mounted () {
    this.getConfigData()
  },
  created () {},
  computed: {},
  methods: {
    getConfigData () {
      this.$store
        .dispatch('speakTempate/getTemplatData', {})
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.speakTemplateData = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },

    // 提交
    saveData () {
      this.$refs.ttlockConfigFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.speakTemplateData
          }
          this.$store
            .dispatch('speakTempate/setTemplatData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '保存成功',
                  color: 'green'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
