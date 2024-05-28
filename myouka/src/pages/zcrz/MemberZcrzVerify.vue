<template>
  <q-dialog v-model="verifyAttest" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.2) + 'px',
        'max-width': parseInt($q.screen.width * 0.2) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="row items-center q-pa-none q-px-sm">
        审核
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </div>

      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label>{{ carInfoData.zi_name }}</q-item-label>
            <q-item-label caption>姓名</q-item-label>
          </q-item-section>

          <q-item-section side> <q-icon name="las la-user-alt" color="teal" /> </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ carInfoData.zi_nick_name }}</q-item-label>
            <q-item-label caption>昵称</q-item-label>
          </q-item-section>

          <q-item-section side> <q-icon name="las la-user-alt" color="pink" /> </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ carInfoData.zi_mobile }}</q-item-label>
            <q-item-label caption>电话</q-item-label>
          </q-item-section>

          <q-item-section side> <q-icon name="las la-phone-alt" color="blue" /> </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ carInfoData.zi_number_plate }}</q-item-label>
            <q-item-label caption>车牌号</q-item-label>
          </q-item-section>

          <q-item-section side> <q-icon name="las la-car" color="teal" /> </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ carInfoData.zcrzType.zg_name }}</q-item-label>
            <q-item-label caption>认证类型</q-item-label>
          </q-item-section>

          <q-item-section side> <q-icon name="las la-car" color="blue" /> </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ status }}</q-item-label>
            <q-item-label caption>审核状态</q-item-label>
          </q-item-section>

          <q-item-section side> <q-icon name="las la-bell" color="pink" /> </q-item-section>
        </q-item>
      </q-list>

      <div class="q-mt-sm">
        <div>驾驶证：</div>
        <div class="row">
          <div class="col-3 q-pa-xs" v-for="(item, key) in carInfoData.driverLicenseImage">
            <q-img
              :src="$q.localStorage.getItem('myouka_system_local').attach_url + (item ? item.path : '')"
              width="80px"
              height="80px"
              :ratio="1"
            ></q-img>
          </div>
        </div>
      </div>
      <div class="q-mt-sm">
        <div>车辆图片：</div>
        <div class="row">
          <div class="col-3 q-pa-xs" v-for="(item, key) in carInfoData.carImage">
            <q-img
              :src="$q.localStorage.getItem('myouka_system_local').attach_url + (item ? item.path : '')"
              width="80px"
              height="80px"
              :ratio="1"
            ></q-img>
          </div>
        </div>
      </div>
      <div class="q-mt-md" v-if="carInfoData.zi_status == 2">
        <q-btn-group unelevated class="full-width" spread>
          <q-btn unelevated @click="modifyStatus(3)" color="red" label="不通过" />
          <q-btn unelevated @click="modifyStatus(4)" color="green" label="通过" />
        </q-btn-group>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'MemberZcrzVerify',
  data () {
    return {
      dataId: 0,
      status: '',

      verifyAttest: false,
      carInfoData: {
        zcrzType: {}
      }
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (val) {
      this.dataId = val.id
      this.verifyAttest = true

      if (this.dataId > 0) {
        this.$store.dispatch('zcrz/getItemData', this.dataId).then((res) => {
          if (res.code == 200 && res.data) {
            this.carInfoData = res.data

            if (parseInt(res.data.zi_status) == 1) {
              this.status = '未提交'
            } else if (parseInt(res.data.zi_status) == 2) {
              this.status = '待审核'
            } else if (parseInt(res.data.zi_status) == 3) {
              this.status = '未通过'
            } else if (parseInt(res.data.zi_status) == 4) {
              this.status = '已通过'
            }
          }
        })
      }
    },

    modifyStatus (val) {
      const obj = {
        zi_status: val,
        id: this.dataId
      }
      this.$store
        .dispatch('zcrz/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新状态成功',
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
    },

    hideNowPage () {
      this.verifyAttest = false
      this.$emit('getMethods')
    }
  }
}
</script>
