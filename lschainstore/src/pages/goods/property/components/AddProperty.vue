<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.4) + 'px',
          'max-width': parseInt($q.screen.width * 0.4) + 'px',
        }"
      >
        <q-card-section class="row q-py-sm">
          <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}</div>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-card-section class="q-py-sm">
          <q-form ref="propertyDataRef">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="propertyFrom.cp_type"
              :options="propertyData"
              dense
              label="类型"
              :error="false"
            />
            <q-input
              outlined
              dense
              v-model="propertyFrom.cp_sort"
              label="排序:数字越小，排序越靠前"
              lazy-rules
              disable
              maxlength="11"
              :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
            />
            <q-input outlined dense v-model="propertyFrom.cp_code" label="编码" lazy-rules maxlength="11" :rules="[(val) => !!val || '请输入编码']" />
            <q-input outlined dense v-model="propertyFrom.cp_name" label="名称" lazy-rules maxlength="11" :rules="[(val) => !!val || '请输入名称']" />
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="propertyFrom.cp_status"
              :options="options"
              dense
              label="状态"
              bottom-slots
            />

            <q-input outlined bottom-slots v-model="propertyFrom.cp_content" :rows="3" dense type="textarea" label="属性描述"></q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn class="q-px-xl" label="提交" unelevated color="primary" @click="saveData()" />
          <q-btn class="q-px-xl" label="关闭" unelevated @click="hideNowPage()" color="grey" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddProperty',
  props: ['type'],
  data () {
    return {
      dataId: '',
      FastExpensedataId: 0,
      isSidebarActiveLocal: false,
      propertyData: [
        // {
        //   label: '面料类型',
        //   value: 'fabric'
        // },
        // {
        //   label: '安全类型',
        //   value: 'safetytype'
        // },
        {
          label: '品牌',
          value: 'brand'
        }
        // {
        //   label: '年份',
        //   value: 'years'
        // },
        // {
        //   label: '季度',
        //   value: 'season'
        // },
        // {
        //   label: '波段',
        //   value: 'band'
        // },
        // {
        //   label: '系列',
        //   value: 'series'
        // },
        // {
        //   label: '风格',
        //   value: 'style'
        // }
      ],
      options: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '0'
        }
      ],

      propertyFrom: {
        cp_type: 'brand',
        cp_sort: 0,
        cp_name: '',
        cp_code: '',
        cp_status: '1',
        cp_content: ''
      },
      disabledStatus: false
    }
  },
  mounted () {},
  created () {
    this.getItemSort()
  },
  computed: {},
  methods: {
    getItemSort () {
      const obj = {
        type: 'brand'
      }

      this.$store.dispatch('goodsProperty/getItem', obj).then((res) => {
        if (res.code == 200) {
          this.propertyFrom.cp_sort = res.data ? parseInt(parseInt(res.data.cp_sort) + 1) : 1
        }
      })
    },
    init (id) {
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.dataId = id
        const obj = {
          id: this.dataId
        }
        this.$store.dispatch('goodsProperty/getItemData', obj).then((res) => {
          if (res.code == 200) {
            this.propertyFrom = res.data
          }
        })
      }
    },
    saveData () {
      this.$refs.propertyDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const obj = {
            ...this.propertyFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('goodsProperty/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '基础属性成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                  this.isSidebarActiveLocal = false
                  this.disabledStatus = false
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '新增基础属性错误！',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        }
      })
    },
    hideNowPage () {
      this.$emit('dataList', 'brand')
    }
  }
}
</script>
