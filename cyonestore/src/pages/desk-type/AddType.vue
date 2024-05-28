<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">{{ typeData.id > 0 ? '修改' : '新增' }}餐区</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="typeDataRef" class="row q-col-gutter-sm">
          <div class="col-12 col-md-4 ">
            <q-input outlined dense v-model="typeData.dt_name" label="餐区名称" lazy-rules :rules="[(val) => !!val || '请输入餐区名称']" />
          </div>
          <div class="col-12 col-md-4 ">
            <q-input
              outlined
              dense
              v-model="typeData.dt_sort"
              label="餐区排序"
              lazy-rules
              :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
            />
          </div>
          <div class="col-12 col-md-4 ">
            <q-input
              outlined
              dense
              v-model="typeData.dt_box_price"
              label="包厢费"
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '包厢费为非负两位以内小数']"
            />
          </div>
          <div class="col-12 col-md-4 ">
            <q-input
              outlined
              dense
              v-model="typeData.dt_min_consume"
              label="最低消费"
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '最低消费为非负两位以内小数']"
            />
          </div>
          <div class="col-12 col-md-4 ">
            <q-input
              outlined
              dense
              v-model="typeData.dt_deposit"
              label="预约押金"
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '预约押金为非负两位以内小数']"
            />
          </div>
          <div class="col-12 col-md-4 ">
            <q-input
              outlined
              dense
              v-model="typeData.dt_extra_consume"
              label="低于最低消费加收"
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '低于最低消费加收为非负两位以内小数']"
            />
          </div>
          <div class="col-12 col-md-4 ">
            <q-select
              outlined
              dense
              class="q-mb-md"
              v-model="typeData.dt_is_order_merge"
              :options="[
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' },
              ]"
              label="分单合并"
              emit-value
              map-options
            />
          </div>

          <div class="col-12  col-md-8">
            <q-input v-model="typeData.dt_description" outlined :rows="3" dense label="说明" />
          </div>
          <div class="col-12 col-md-6 ">
            <q-card flat bordered class="q-mt-sm ">
              <q-card-section class="text-subtitle2 text-center">预结单</q-card-section>
              <q-separator />
              <q-card-section v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                <div v-for="(item, k) in printerList" :key="`y${k}`">
                  <q-checkbox v-model="typeData.dt_yujie_order_print" :val="item.id" />{{ item.ps_name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-grey" v-else>
                没有找到可用打印机
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6 ">
            <q-card flat bordered class="q-mt-sm ">
              <q-card-section class="text-subtitle2 text-center">对账单</q-card-section>
              <q-separator />
              <q-card-section v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                <div v-for="(item, k) in printerList" :key="`d${k}`">
                  <q-checkbox v-model="typeData.dt_duizhang_order_print" :val="item.id" />{{ item.ps_name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-grey" v-else>
                没有找到可用打印机
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6 ">
            <q-card flat bordered class="q-mt-sm ">
              <q-card-section class="text-subtitle2 text-center">结账单</q-card-section>
              <q-separator />
              <q-card-section v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                <div v-for="(item, k) in printerList" :key="`j${k}`">
                  <q-checkbox v-model="typeData.dt_jiezhang_order_print" :val="item.id" />{{ item.ps_name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-grey" v-else>
                没有找到可用打印机
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6 ">
            <q-card flat bordered class="q-mt-sm ">
              <q-card-section class="text-subtitle2 text-center">退单</q-card-section>
              <q-separator />
              <q-card-section v-if="printerList.length > 0" class="row q-mb-md q-mt-sm">
                <div v-for="(item, k) in printerList" :key="`t${k}`">
                  <q-checkbox v-model="typeData.dt_tuidan_order_print" :val="item.id" />{{ item.ps_name }}
                </div>
              </q-card-section>
              <q-card-section class="text-center text-grey" v-else>
                没有找到可用打印机
              </q-card-section>
            </q-card>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="justify-center row q-gutter-sm">
        <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddType',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      typeData: {
        dt_name: '',
        dt_sort: '0',
        dt_box_price: '0',
        dt_description: '',
        dt_min_consume: '0',
        dt_extra_consume: '0',
        dt_deposit: '0',
        dt_is_order_merge: '0'
      },
      printerList: []

    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      this.getPrinterList()
      if (id > 0) {
        this.$store
          .dispatch('desk/getTypeItem', { id })
          .then((res) => {
            if (res.code == 200) {
              this.typeData = res.data ? res.data : {}
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
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
    },
    setData () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          const params = {
            ...this.typeData

          }
          this.$store
            .dispatch('desk/setTypeData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.typeData.id > 0 ? '修改' : '新增'}` + '餐区成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
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
    hideNowPage () {
      this.typeData.id = ''
      this.typeData = {
        dt_name: '',
        dt_sort: '0',
        dt_box_price: '0',
        dt_description: '',
        dt_min_consume: '0',
        dt_extra_consume: '0',
        dt_deposit: '0'
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    getPrinterList () {
      this.$store
        .dispatch('dishes/getPrinterList')
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
    }
  }
}
</script>
