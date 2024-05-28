<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="row items-center q-pb-none">
        {{ dataId > 0 ? '修改' : '新增' }}
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </div>

      <q-form ref="typeDataRef" class="q-mt-sm">
        <q-select
          v-if="!dataId"
          outlined
          option-value="value"
          option-label="label"
          emit-value
          map-options
          v-model="carTypeData.zg_type"
          :options="carType"
          dense
          label="请选择分类属性"
          :error="false"
        />

        <div v-if="carTypeData.zg_type == 1">
          <q-input
            outlined
            dense
            v-model="carTypeData.zg_group_name"
            label="分组名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '分组名称不能为空']"
          />
          <!-- <q-input outlined dense class="q-my-sm" v-model="carTypeData.zg_quiet_warning_days" label="沉寂天数" lazy-rules /> -->
        </div>

        <div v-else>
          <q-select
            outlined
            option-value="id"
            option-label="zg_group_name"
            emit-value
            map-options
            v-model="carTypeData.zg_group_id"
            :options="typeDataList"
            dense
            label="请选择分组"
            :rules="[(val) => !!val || '请选择分组']"
          />

          <!-- <q-input outlined dense class="q-my-sm" v-model="carTypeData.zg_quiet_warning_days" label="沉寂天数" lazy-rules /> -->

          <q-input
            outlined
            dense
            v-model="carTypeData.zg_name"
            label="分类名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '分类名称不能为空']"
          />
        </div>

        <div v-if="carTypeData.zg_type == 2" class="text-center">

          <hl-upload
            :multiple="false"
            :currentAttach="carTypeData.coverImage"
            @input="(val)=>{ $nextTick(()=>{ carTypeData.zg_cover_image = val })}"
            currentDescription="建议尺寸比例1:1"
            currentTitle="分类图片"
          />

        </div>

        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
          <q-btn class="q-px-xl" label="提交" @click="saveData()" color="primary" unelevated />
          <q-btn class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" unelevated />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddCarType',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      carType: [
        { label: '分组', value: 1 },
        { label: '分类', value: 2 }
      ],
      typeDataList: [],
      carTypeData: {
        zg_type: 1,
        zg_name: '',
        zg_group_id: '',
        zg_group_name: '',
        zg_cover_image: ''
        // zg_quiet_warning_days: 0
      },
      stop: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.getTypeData()
      this.dataId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.$store.dispatch('zcrz/getItem', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.carTypeData = res.data
          }
        })
      }
    },
    // 获取分类列表，无分页
    getTypeData () {
      this.$store
        .dispatch('zcrz/getTypeData', { type: 1 })
        .then((res) => {
          if (res.code == 200) {
            this.typeDataList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    // 提交数据
    saveData () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          if (parseInt(this.carTypeData.zg_type) == 1) {
            this.carTypeData.zg_name = ''
            this.carTypeData.zg_group_id = 0
            this.carTypeData.zg_cover_image = ''
          }
          this.addStoreSidebar = false
          const obj = {
            ...this.carTypeData,
            id: this.dataId
          }

          this.$store
            .dispatch('zcrz/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存认证类型成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
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
      this.addStoreSidebar = false
      this.$emit('getMethods')
    }
  }
}
</script>
