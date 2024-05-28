<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}场地</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="siteFormDataRef" class="row q-col-gutter-sm">
              <div class="col-4">
                <q-input
                  outlined
                  dense
                  v-model="siteFormData.cs_name"
                  label="名称"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '名称不能为空']"
                />
              </div>

              <div class="col-4">
                <q-select
                  outlined
                  label="选择场地状态"
                  v-model="siteFormData.cs_status"
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  dense
                  :options="statusOptions"
                  bottom-slots
                />
              </div>

              <div class="col-4">
                <q-select
                  outlined
                  label="选择场地属性"
                  v-model="siteFormData.cs_attribute"
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  dense
                  :options="attributeOptions"
                  bottom-slots
                />
              </div>

              <div class="col-12" v-for="(item, key) in weekTime">
                <q-card flat bordered class="full-width">
                  <q-card-section>
                    {{ item.label }}

                  </q-card-section>
                  <q-separator />
                  <q-card-section class="full-width">
                    <div v-for="(i, k) in timePeriod[item.value]">
                      <q-item>
                        <q-item-section avatar top>
                          <q-btn color="primary" outline> {{ i.start }} - {{ i.end }} </q-btn>
                        </q-item-section>
                        <q-item-section>
                          <q-select
                            outlined
                            label="状态"
                            v-model="i.ctp_status"
                            option-label="label"
                            option-value="value"
                            map-options
                            emit-value
                            dense
                            :options="whetherOptions"
                            bottom-slots
                          />
                        </q-item-section>

                        <q-item-section>
                          <q-input
                            v-if="parseInt(i.ctp_status) == 1"
                            outlined
                            dense
                            v-model="i.ctp_amount"
                            label="收费金额（每小时）"
                            maxlength="255"
                            lazy-rules
                            :rules="[(val) => /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) || '请输入正确的收费金额']"
                          />
                        </q-item-section>
                      </q-item>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'cdyySite',
  data () {
    return {
      dialogStatus: false,
      dataId: 0,

      siteFormData: {
        cs_name: '',
        cs_attribute: 1,
        cs_status: 1
      },

      statusOptions: [
        {
          label: '未使用',
          value: '0'
        },
        {
          label: '使用中',
          value: '1'
        },
        {
          label: '维护中',
          value: '2'
        }
      ],
      weekTime: [
        {
          label: '周一',
          value: 1
        },
        {
          label: '周二',
          value: 2
        },
        {
          label: '周三',
          value: 3
        },
        {
          label: '周四',
          value: 4
        },
        {
          label: '周五',
          value: 5
        },
        {
          label: '周六',
          value: 6
        },
        {
          label: '周日',
          value: 7
        }
      ],
      timePeriod: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
      },
      attributeOptions: [
        {
          label: '全场',
          value: '1'
        },
        {
          label: '半场',
          value: '2'
        }
      ],
      whetherOptions: [
        {
          label: '可以预定',
          value: '1'
        },
        {
          label: '不可预定',
          value: '2'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dialogStatus = true
      this.dataId = id
      this.getItem()
    },
    getItem () {
      this.$store
        .dispatch('cdyy/getSiteItem', {
          site_id: this.dataId
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.timePeriod = res.data && res.data.timePeriod ? res.data.timePeriod : []
            this.siteFormData = res.data && res.data.siteFormData ? res.data.siteFormData : []
          }
        })
    },

    saveData () {
      this.$refs.siteFormDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.siteFormData,
            id: this.dataId,
            timePeriod: this.timePeriod
          }
          this.$store
            .dispatch('cdyy/setSiteData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.dialogStatus = false
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '添加成功',
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
</style>
