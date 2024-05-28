<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">{{ deskData.dp_name }}-开台</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="addDeskLinkRef">
          <div >
            <q-select
              outlined
              dense
              v-model="linkData.dol_principal_id"
              option-value="id"
              option-label="pru_name"
              :options="userOptions"
              label="请选择负责人"
              emit-value
              map-options
              bottom-slots
            />
          </div>
          <div class=" row q-gutter-sm" v-if="deskData.dp_dine_people_number > 0">
            <div v-for="(item, key) of deskData.dp_dine_people_number" :key="key">
              <q-btn unelevated color="positive" @click="getPeopleNumber(item)">{{ item }}</q-btn>
            </div>
          </div>

          <div class="q-mt-sm">
            <q-input
              outlined
              dense
              bottom-slots
              v-model="linkData.dol_people_number"
              label="就餐人数"
              :rules="[(val) => /(^[1-9]\d*$)/.test(val) || '请输入就餐人数']"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-gutter-sm">
        <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="positive" @click="setDeskLinkData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'PeopleNumber',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      deskData: {
        id: ''
      },
      linkData: {
        dol_desk_id: '',
        dol_principal_id: '',
        dol_people_number: '',
        dol_status: '1'
      },
      userOptions: []
    }
  },
  created () {
    this.getUserList()
  },
  mounted () {},
  computed: {},
  methods: {
    getUserList () {
      this.$store
        .dispatch('consumeorder/getUserList')
        .then((res) => {
          if (res.code == 200) {
            this.userOptions = res.data ? res.data : []
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
    init (id) {
      this.deskData.id = id
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('consumeorder/getDeskItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.deskData = res.data ? res.data : {}
              this.deskData.dp_dine_people_number = parseInt(res.data.dp_dine_people_number)
            } else {
              this.$q.notify({
                message: '失败',
                caption: '操作失败',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
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
    setDeskLinkData () {
      this.$refs.addDeskLinkRef.validate().then((success) => {
        if (success) {
          this.linkData.dol_desk_id = this.deskData.id
          const params = {
            ...this.linkData
          }
          this.$store
            .dispatch('consumeorder/setDeskLinkData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$router.push({
                  name: 'addOrder',
                  query: {
                    id: this.deskData.id,
                    memberId: this.linkData.dol_member_id
                  }
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
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
      })
    },
    hideNowPage () {
      this.linkData.dol_people_number = ''
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    getPeopleNumber (item) {
      this.linkData.dol_people_number = item
    }
  }
}
</script>
