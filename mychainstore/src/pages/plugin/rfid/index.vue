<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="text-subtitle2">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          RFID&IC卡&M1卡读写器设置
        </div>
        <div class="row q-ma-none q-pa-none">
          <div class="q-mt-sm">
            是否启用RFID硬件读写器
          </div>

          <q-space />
          <div class="q-ma-none ">
            <q-toggle
              class="q-ma-none"
              v-model="rfidDataForm.rfid_rfid_rfid1"
              color="green"
              v-if="authorityMeta('edit')"
              :true-value="'1'"
              :false-value="'0'"
              @input="handleSwitchChange(rfidDataForm.rfid_rfid_rfid1, 'rfid_rfid_rfid1')"
            />
          </div>
        </div>
        <div class="text-grey">
          硬件设备采用智能卡读写器，型号：YW-605HA、YW-607（推荐：YW-605HA）。支持高频IC卡,例如M1系列卡片。（推荐M1卡）。
          <span class="q-mt-sm text-red">
            注意！该设置关闭后以下所有设置全部失效
          </span>
        </div>
      </div>

      <div class="col-shrink q-pa-xs full-height bg-grey-2">
        <q-scroll-area class="fit full-height">
          <q-table flat :data="obtianData" :columns="integralData" row-key="name" binary-state-sort :pagination.sync="pagination" :rows-per-page-options="[0]" hide-pagination>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="title" :props="props">{{ props.row.title }}</q-td>
                <q-td key="note" :props="props">{{ props.row.note }}</q-td>
                <q-td>
                  <q-input
                    :disable="!reference"
                    v-model="props.row.value"
                    dense
                    outlined
                    v-if="authorityMeta('edit')"
                    :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '扇区编号是正整数']"
                    @change="inputChange(props.row.value, 'rfid_rfid_' + props.row.value_key)"
                  />
                </q-td>
                <q-td>
                  <q-toggle
                    :disable="!reference"
                    :true-value="'1'"
                    :false-value="'0'"
                    v-model="props.row.switch"
                    color="green"
                    v-if="authorityMeta('edit')"
                    @input="handleSwitchChange(props.row.switch, 'rfid_rfid_' + props.row.switch_key)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-scroll-area>
      </div>

    </div>
  </q-page>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      reference: false,
      rfidDataForm: {
        rfid_rfid_rfid1: ''
      },
      pagination: {
        rowsPerPage: 0
      },
      integralData: [
        {
          name: 'title',
          label: '设置项目',
          align: 'left',
          field: (row) => row.title,
          required: true,
          format: (val) => `${val}`
        },
        {
          name: 'note',
          align: 'left',
          label: '说明',
          field: 'note',
          required: true
        },
        {
          name: 'value',
          label: '扇区编号',
          align: 'left',
          field: 'value',
          required: true
        },
        {
          name: 'switch',
          label: '是否启用',
          align: 'left',
          field: 'switch',
          required: true
        }
      ],
      obtianData: []
    }
  },
  mounted () {},
  created () {
    this.getlist()
  },
  computed: {},
  methods: {
    getlist () {
      this.$store
        .dispatch('rfidPlugin/getListData')
        .then((res) => {
          if (res.code == 200) {
            this.rfidDataForm = res.data ? res.data.rfidDataForm : {}
            this.reference = this.rfidDataForm.rfid_rfid_rfid1 > 0
            this.obtianData = res.data ? res.data.obtianData : []
          }
        })
        .catch((error) => {})
    },

    handleSwitchChange (val, keyName) {
      const vald = val
      const obj = {}
      obj[keyName] = vald
      this.$store
        .dispatch('rfidPlugin/addData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新状态成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getlist()
          }
        })
        .catch((error) => {})
    },
    inputChange (val, keyName) {
      const regu = /^[0-9]*[0-9][0-9]*$/
      if (!regu.test(val)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的数值',
          color: 'red'
        })
        return false
      }

      const obj = {}
      obj[keyName] = val
      this.$store
        .dispatch('rfidPlugin/addData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新状态成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getlist()
          }
        })
        .catch((error) => {})
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
