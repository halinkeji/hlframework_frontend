<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class=" row q-gutter-sm q-pa-sm q-pb-md bg-white justify-start">
        <div class="col-md-3 col-12">
          <q-select outlined dense v-model="type" :options="typeData" option-label="title" label="选择设置" />
        </div>
        <div class="col">
          <q-btn color="primary" label="添加设置" @click="addSpecification" unelevated icon="las la-plus-square" />
        </div>
        <div class="col-auto">
          <q-chip square color="red" text-color="white" icon="report_problem" label="编码设置在保存以后生效，删除时请谨慎操作。" />
        </div>
      </div>
      <div class="col-shrink bg-white q-pa-sm full-height q-my-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="dataFormRef">
            <div class="row q-py-lg q-px-md ">
              <div class="col-md-11 col-12 q-pt-none">
                <div class="row q-col-gutter-md" v-for="(normItem, normIndex) in configData" :key="normIndex">
                  <div class="col-md-3 col-12">
                    <q-input
                      v-model="normItem.cc_sort"
                      outlined
                      bottom-slots
                      dense
                      label="属性排序"
                      placeholder="请输入属性排序"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请设置属性排序']"
                    />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input
                      v-model="normItem.cc_type"
                      outlined
                      bottom-slots
                      dense
                      label="属性类型"
                      readonly
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请设置属性编码']"
                    />
                  </div>
                  <div class="col-md-3 col-12 ">
                    <q-input
                      v-model="normItem.cc_name"
                      outlined
                      bottom-slots
                      dense
                      readonly
                      label="属性名称"
                      placeholder="请输入属性名称"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请设置属性名称']"
                    />
                  </div>
                  <div class="col">
                    <q-btn @click="deleteSpecification(normIndex)" color="red" round flat icon="delete "> </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-md text-center">
        <q-btn unelevated color="primary" class="q-px-md q-px-xl" :disable="submitDisabled" @click="clothingFormatSumbit()" label="保存" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'config',
  data () {
    return {
      submitDisabled: false,
      type: null,
      typeData: [],
      configData: []
    }
  },
  created () {},
  mounted () {
    this.getItem()
  },
  computed: {},
  methods: {
    getItem () {
      this.$store
        .dispatch('clothingConfig/getList')
        .then((res) => {
          if (res.code == 200) {
            this.typeData = res.data.defaultData
            this.configData = res.data.configData ? res.data.configData : []
            this.reschConfig()
            this.submitDisabled = false
          }
        })
        .catch((err) => {})
    },
    clothingFormatSumbit () {
      this.$refs.dataFormRef.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          if (!(this.dataId > 0)) {
            this.dataId = 0
          }
          const obj = {
            configData: this.configData
          }
          this.$store.dispatch('clothingConfig/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '保存设置成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getItem()
            }
          })
        }
      })
    },
    // 添加
    addSpecification () {
      const type = this.type
      if (type) {
        console.log('type', type)
        const layoutArray = this.configData
        const newlayout = {
          cc_sort: '',
          cc_type: type.value,
          cc_name: type.title
        }
        layoutArray.push(newlayout)
        this.type = null
      }
      this.reschConfig()
    },
    // 删除
    deleteSpecification (mainKey) {
      const data = {
        value: this.configData[mainKey].cc_type,
        title: this.configData[mainKey].cc_name
      }
      this.typeData.push(data)
      setTimeout(() => {
        this.configData.splice(mainKey, 1)
      }, 100)
    },
    reschConfig () {
      this.configData.forEach((value, index) => {
        const data = this.typeData.findIndex(function (x) {
          return x.value == value.cc_type
        })
        if (data > -1) {
          this.typeData.splice(data, 1)
        }
      })
    }
  }
}
</script>
