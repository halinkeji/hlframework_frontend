<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height">
      <q-scroll-area class="fit full-height">
        <q-form ref="modelConfigRef" class="q-gutter-md row">
          <q-card flat class="bg-white q-pa-md col-6">
            <q-list separator bordered padding>
              <q-item>
                <q-item-section>
                  <q-item-label>营业开始时间</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input outlined dense label="开始时间" v-model="configData.job_start_time" readonly>
                    <template v-slot:append>
                      <q-icon color="grey" v-if="configData.job_start_time" @click="configData.job_start_time = ''" name="cancel"></q-icon>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="configData.job_start_time" mask="HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>营业休息时间</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input outlined dense label="休息时间" v-model="configData.job_end_time" readonly>
                    <template v-slot:append>
                      <q-icon color="grey" v-if="configData.job_end_time" @click="configData.job_end_time = ''" name="cancel"></q-icon>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="configData.job_end_time" mask="HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>营业说明</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input outlined dense label="营业说明" v-model="configData.job_caption" type="textarea"></q-input>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <q-btn class="q-px-xl" unelevated label="保存" @click="saveData" color="primary" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'OtherSet',
  data () {
    return {
      configData: {
        job_start_time: '',
        job_end_time: '',
        job_caption: ''
      },
      paramsKey: 'store_other_config'
    }
  },
  components: {},
  mounted () {
    this.getItem()
  },

  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('settings/getSuperModel', { key: this.paramsKey }).then((res) => {
        if (res.code == 200) {
          this.setConfigContent(res.data)
        }
      })
    },
    setConfigContent (data) {
      for (const key in this.configData) {
        this.configData[key] = data[key] ? data[key] : ''
      }
    },
    // 提交
    saveData () {
      this.$refs.modelConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            value: this.configData,
            key: this.paramsKey
          }
          this.$store
            .dispatch('settings/setSuperModel', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
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
    }
  }
}
</script>
