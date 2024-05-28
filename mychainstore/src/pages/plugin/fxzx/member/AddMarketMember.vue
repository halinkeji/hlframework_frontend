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
          <div class="text-subtitle1">新增</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="addTemplateRef">
              <hl-card-reading ref="memberCardReading" class="q-mb-md" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
              <q-select
                outlined
                v-model="memberData.pfm_level_id"
                :options="levelOptions"
                option-label="pfl_name"
                emit-value
                map-options
                @input="setWeights"
                option-value="id"
                dense
                :rules="[(val) => !!val || '请选择']"
                label="选择级别"
              />
              <template-components ref="templateComponentsRef" />
            </q-form>
          </q-scroll-area>
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
import TemplateComponents from './TemplateComponents.vue'
export default {
  name: 'AddNews',
  components: {
    TemplateComponents
  },
  data () {
    return {
      dialogStatus: false,
      memberData: {
        pfm_member_id: '',
        pfm_level_id: '',
        pfm_weights: '0',
        pfm_form_id: ''
      },
      levelOptions: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberData.pfm_member_id = val.id
        }
      }
    },
    getConfig () {
      this.$store
        .dispatch('fxzx/getConfigData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data.pfc_form_id) {
              this.memberData.pfm_form_id = res.data.pfc_form_id
              this.$refs.templateComponentsRef.getList({
                formId: res.data.pfc_form_id
                // memberId: 1,
                // otherId: 1
              })
            }
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

    setWeights () {
      const that = this
      const findIndex = _.findIndex(this.levelOptions, function (o) {
        return parseInt(o.id) == parseInt(that.memberData.pfm_level_id)
      })
      if (findIndex > 0) {
        const levelItem = this.levelOptions[findIndex]
        if (levelItem && levelItem.id) {
          that.memberData.pfm_weights = levelItem.pfl_weights
        }
      }
    },

    init () {
      this.getConfig()
      this.getLevelData()

      this.dialogStatus = true
    },

    getLevelData () {
      this.$store
        .dispatch('fxzx/getLevelList')
        .then((res) => {
          if (res.code == 200) {
            this.levelOptions = res.data ? res.data : []
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

    saveData () {
      this.$refs.addTemplateRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.$refs.templateComponentsRef.setData(),
            ...this.memberData
          }

          this.$store
            .dispatch('fxzx/setMarketMember', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              } else {
                this.$q.notify({
                  message: '错误',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
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
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
    }
  }
}
</script>
