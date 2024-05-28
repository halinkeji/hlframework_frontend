<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="popupActive" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}计量单位</div>

          <q-space />
          <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="dataForm">
            <q-input outlined v-model="dataForm.gu_sort" dense label="排序" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']" />

            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="dataForm.gu_goodsOrService"
              :options="options"
              dense
              label="属性"
              bottom-slots
            />

            <div v-if="dataForm.gu_goodsOrService == 1">
              <q-select
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="dataForm.gu_is_many"
                :options="typeOptions"
                dense
                label="是否启用计量单位换算"
                bottom-slots
              />
            </div>

            <q-input
              outlined
              v-model="dataForm.gu_name"
              dense
              :label="parseInt(dataForm.gu_is_many) == 1 && parseInt(dataForm.gu_goodsOrService) == 1 ? '单位名称（大）' : '基本单位'"
              lazy-rules
              :rules="[(val) => !!val || '请填写名称']"
            />
            <q-input
              outlined
              v-model="dataForm.gu_small_name"
              dense
              v-if="parseInt(dataForm.gu_is_many) == 1 && parseInt(dataForm.gu_goodsOrService) == 1"
              label="单位名称（小）"
              lazy-rules
              :rules="[(val) => !!val || '请填写名称']"
            />
            <q-input
              outlined
              v-model="dataForm.gu_convert_proportion"
              dense
              v-if="parseInt(dataForm.gu_is_many) == 1 && parseInt(dataForm.gu_goodsOrService) == 1"
              lazy-rules
              label="比例"
              hint=""
              :rules="[(val) => /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(val) || '请输入保留两位小数的正数']"
            >
            </q-input>
            <div class="text-red q-px-xs">
              <q-icon name="las la-question-circle" color="red" size="sm"></q-icon> 说明：一大单位 = N 小单位 （示例：1公斤 = 2斤）
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="确定" unelevated @click="goodsUnitSumbit()" color="primary" :disable="submitDisabled" class="q-px-xl" />
          <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="q-px-xl" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddUnit',
  data () {
    return {
      options: [
        {
          label: '实物属性',
          value: '1'
        },
        // {
        //   label: '服务属性',
        //   value: '2'
        // },
        {
          label: '套餐属性',
          value: '3'
        }
      ],
      typeOptions: [
        {
          label: '基础单位',
          value: '0'
        },
        {
          label: '多单位',
          value: '1'
        }
      ],
      dataId: 0,
      popupActive: false,
      dataForm: {
        gu_sort: '0',
        gu_name: '',
        gu_is_many: '0',
        gu_goodsOrService: '1',
        gu_small_name: '',
        gu_convert_proportion: ''
      },

      submitDisabled: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.popupActive = true
      this.dataId = id
      if (id > 0) {
        this.$store
          .dispatch('goodsunit/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              const dataForm = res.data

              if (parseInt(res.data.gu_is_many) == 1 && res.data.smallUnit) {
                const smallUnit = res.data.smallUnit

                dataForm.gu_small_name = smallUnit.gu_name ? smallUnit.gu_name : ''
                dataForm.small_unit_id = smallUnit.id
              }
              this.dataForm = dataForm
            }
          })
          .catch((err) => {})
      }
    },
    goodsUnitSumbit () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.submitDisabled = true
          if (!(this.dataId > 0)) {
            this.dataId = 0
          }
          if (parseInt(this.dataForm.gu_goodsOrService) != 1) {
            this.dataForm.gu_is_many = '0'
          }
          const obj = {
            ...this.dataForm,
            id: this.dataId
          }
          this.$store.dispatch('goodsunit/addData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: `${this.dataId > 0 ? '修改' : '新增'}` + '计量单位成功',
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
        }
      })
    },
    hideNowPage () {
      this.popupActive = false
      this.submitDisabled = false
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
