<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.4) + 'px',
        'max-width': parseInt($q.screen.width * 0.4) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle2">{{ depotData.id > 0 ? '修改仓库信息' : '新增仓库信息' }}</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="depotDataRef">
          <q-input
            outlined
            dense
            v-model="depotData.cd_code"
            label="编号"
            lazy-rules
            :rules="[(val) => /^[0-9a-zA-Z]*$/g.test(val) || '请输入正确的编号']"
          >
          </q-input>
          <q-input
            outlined
            dense
            v-model="depotData.cd_name"
            label="仓库名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请填写名称']"
          />
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            bottom-slots
            v-model="depotData.cd_status"
            :options="statusRadio"
            dense
            label="状态"
          />
          <!-- <q-input
                class="col-12 col-md-6 q-pr-sm q-mt-xs"
                outlined
                dense
                v-model="depotData.cd_place"
                label="仓库位置"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '请填写仓库位置']"
              /> -->
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            bottom-slots
            v-model="depotData.cd_if_owe_stock"
            :options="statusRadio"
            dense
            label="是否允许负库存"
          />

          <q-input bottom-slots outlined type="textarea" dense :rows="2" v-model="depotData.cd_note" label="说明" />

          <hl-address
            :province="depotData.cd_province"
            :city="depotData.cd_city"
            :area="depotData.cd_district"
            @province="provinceupdate"
            @city="cityupdate"
            @area="areaupdate"
          ></hl-address>

          <q-input label="联系地址" outlined v-model="depotData.cd_address" dense bottom-slots class="q-mt-md" />

          <q-card-actions align="center" >
            <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
            <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
export default {
  name: 'AddDepot',
  data () {
    return {
      depotData: {
        cd_code: '',
        cd_name: '',
        cd_place: '',
        cd_note: '',
        cd_status: '1',
        cd_if_owe_stock: '0',
        cd_province: '',
        cd_province_code: '',
        cd_city: '',
        cd_city_code: '',
        cd_district: '',
        cd_district_code: '',
        cd_address: ''
      },
      statusRadio: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      dialogWidth: '1020px',
      showDialog: true,
      addButtonDisabled: false,
      filterOptions: stringOptions
    }
  },
  created () {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.depotData.id = id
        this.$store
          .dispatch('clothingDepot/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.depotData = res.data
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
          .catch((err) => {})
      }
    },
    // 新增或修改仓库信息方法
    setData () {
      this.$refs.depotDataRef.validate().then((success) => {
        // 验证表单提交是否正确
        if (success) {
          // 成功执行

          const data = {
            ...this.depotData
          }
          this.$store
            .dispatch('clothingDepot/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.depotData.id > 0 ? '修改' : '新增'}` + '仓库信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addButtonDisabled = true
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: error.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
              this.showDialog = false
            })
            .catch((error) => {})
        }
      })
    },
    provinceupdate (a) {
      this.depotData.cd_province = a.value
      this.depotData.cd_province_code = a.code
    },
    cityupdate (a) {
      this.depotData.cd_city = a.value
      this.depotData.cd_city_code = a.code
    },
    areaupdate (a) {
      this.depotData.cd_district = a.value
      this.depotData.cd_district_code = a.code
    },
    // 隐藏仓库信息弹窗
    hideNowPage () {
      this.depotData.id = ''

      this.depotData = {
        cd_code: '',
        cd_name: '',
        cd_place: '',
        cd_note: '',
        cd_status: '1',
        cd_if_owe_stock: '0',
        cd_province: '',
        cd_province_code: '',
        cd_city: '',
        cd_city_code: '',
        cd_district: '',
        cd_district_code: '',
        cd_address: ''
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
