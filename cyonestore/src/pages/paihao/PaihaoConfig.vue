<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white">
      <div style="overflow-y: scroll;" class="fit full-height">
        <q-form ref="configRef" class="row q-col-gutter-sm">
          <div class="col-3">
            <q-select
              outlined
              dense
              v-model="paihaoConfigData.fpc_status"
              option-label="label"
              :options="statusOptions"
              label="预约状态"
              emit-value
              map-options
            />
          </div>

          <div class="col-3">
            <q-input
              outlined
              dense
              v-model="paihaoConfigData.fpc_max_people_number"
              label="最大支持总人数"
              :rules="[(val) => (val && !!val) || '请输入最大支持总人数']"
            />
          </div>
          <q-space />

          <div class="col-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">排号项</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-item :key="'time' + key" v-for="(item, key) in paihaoConfigData.fpc_paihao_item">
                  <q-item-section>
                    <q-input outlined dense v-model="item.min" :rules="[(val) => (val && !!val) || '请输入最小容纳人数']" label="最小容纳人数"></q-input>
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined dense v-model="item.max" :rules="[(val) => (val && !!val) || '请输入最大容纳人数']" label="最大容纳人数"></q-input>
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined dense v-model="item.title" :rules="[(val) => (val && !!val) || '请输入排号项名称']" label="排号项名称"></q-input>
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined dense v-model="item.prefix" :rules="[(val) => (val && !!val) || '请输入编号前缀']" label="编号前缀"></q-input>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn unelevated color="negative" @click="removePaihaoItem(key)" round icon="las la-trash-alt"></q-btn>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn unelevated color="primary" @click="pushPaihaoItem" class="q-px-sm">新增排号项</q-btn>
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">排号时间段</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-item :key="'time' + key" v-for="(item, key) in paihaoConfigData.fpc_time_period">
                  <q-item-section>
                    <q-input outlined readonly dense :rules="[(val) => (val && !!val) || '请输入开始时间']" v-model="item.start" label="开始时间">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="item.start" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined readonly :rules="[(val) => (val && !!val) || '请输入结束时间']" dense label="结束时间" v-model="item.end">
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="item.end" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined  dense :rules="[(val) => (val && !!val) || '请输入时间段说明']" label="时间段说明" v-model="item.title"> </q-input>
                  </q-item-section>

                  <q-item-section side top>
                    <q-btn unelevated color="negative" @click="removeTimePeriod(key)" round icon="las la-trash-alt"></q-btn>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-separator />

              <q-card-actions align="center">
                <q-btn unelevated color="primary" @click="pushTimePeriod" class="q-px-sm">新增时间段</q-btn>
              </q-card-actions>
            </q-card>
          </div>

           <div class="col-6">

             <q-card flat bordered class="q-mt-sm ">
              <q-card-section class="text-subtitle2 text-center">指定小票打印机</q-card-section>
              <q-separator />
              <q-card-section v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                <div v-for="(item, k) in printerList" :key="`y${k}`">
                  <q-checkbox v-model="paihaoConfigData.fpc_printer_bind" :val="item.id" />{{ item.ps_name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-grey" v-else>
                没有找到可用打印机
              </q-card-section>
            </q-card>
           </div>

          <div class="col-6">
            <hl-upload
              :multiple="true"
              :maxTotal="5"
              :currentAttach="paihaoConfigData.loopImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    paihaoConfigData.fpc_loop_image = val;
                  });
                }
              "
              currentDescription="轮播图:尺寸建议宽度为600*350,最多为5张"
            />
          </div>

          <div class="col-12 q-px-sm">
            <hl-editor
              :content="paihaoConfigData.fpc_description"
              @change="
                (content) => {
                  paihaoConfigData.fpc_description = content;
                }
              "
              :minHeight="$q.screen.height * 0.4"
              titleText="详情说明"
            ></hl-editor>
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn unelevated label="保存" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'reserveConfig',
  data () {
    return {
      match: false,
      persistent: true,
      multiple: false,
      addButtonDisabled: false,
      paihaoConfigData: {
        fpc_status: '1',
        fpc_max_people_number: 10,
        fpc_loop_image: [],
        fpc_description: '',
        fpc_paihao_item: [],
        fpc_printer_width: '',
        fpc_printer_bind: [],
        fpc_time_period: []
      },

      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '-1' }
      ],
      printerList: []

    }
  },
  created () {
    this.getPrinterList()
  },
  mounted () {
    this.getReserveConfigData()
  },
  computed: {},
  methods: {
    getReserveConfigData () {
      this.$store
        .dispatch('foodPaihao/getConfig')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.paihaoConfigData = res.data ? res.data : {}
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setData () {
      this.$refs.configRef.validate().then((success) => {
        if (success) {
          const params = {
            ...this.paihaoConfigData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('foodPaihao/setConfig', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getReserveConfigData()
                this.addButtonDisabled = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisable = false
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    getPrinterList () {
      this.$store
        .dispatch('cloudprinter/getDataList')
        .then((res) => {
          if (res.code == 200) {
            this.printerList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    pushTimePeriod () {
      this.paihaoConfigData.fpc_time_period.push({
        start: '',
        end: '',
        title: ''
      })
    },

    removeTimePeriod (key) {
      this.paihaoConfigData.fpc_time_period.splice(key, 1)
    },

    pushPaihaoItem () {
      this.paihaoConfigData.fpc_paihao_item.push({
        min: '1',
        max: '10',
        title: '',
        key: 'ph-' + Date.now(),
        prefix: ''
      })
    },

    removePaihaoItem (key) {
      this.paihaoConfigData.fpc_paihao_item.splice(key, 1)
    }
  }
}
</script>
