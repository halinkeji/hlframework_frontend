<template>
  <q-dialog @hide="hideNowPage" v-model="bindStoreStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
      }"
      class="q-pa-sm fit "
    >
      <div class="fit column no-wrap  justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md text-h6 q-mb-xs">
          绑定操作门店
        </div>
        <div class="col-shrink q-pa-sm full-height ">
          <q-scroll-area class="fit full-height">
            <q-list padding>
              <q-item tag="label" v-ripple v-for="(i, k) in storeList" :key="k">
                <q-item-section avatar>
                  <q-avatar>
                    <q-img :src="i.logo">
                      <template v-slot:error>
                        <img class="full-width" :src="`/default_store_avatar.png`" />
                      </template>

                      <template v-if="!i.logo">
                        <img class="full-width" :src="`/default_store_avatar.png`" />
                      </template>
                    </q-img>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ i.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle color="blue" v-model="i.accountOne" :false-value="false" :true-value="true" @input="bindOperate(i.id, i.accountOne)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated color="grey" @click="bindStoreStatus = false" class="q-px-xl" label="关闭" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  components: {},
  name: 'index',
  props: {

  },
  data () {
    return {
      storeList: [],
      bindStoreStatus: false,
      user_id: ''
    }
  },
  computed: {},
  created () {

  },
  mounted () {},
  methods: {
    init (userId) {
      this.bindStoreStatus = true
      if (userId && parseInt(userId) > 0) {
        this.user_id = userId
        this.getLibStoreList()
      }
    },
    hideNowPage () {
      this.$emit('closeDialog')
    },

    saveBindData () {
      const payload = {
        user_id: parseInt(this.user_id),
        bindMemberId: this.bindMemberId
      }

      this.$store
        .dispatch('user/setMobileInfo', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.bindMobileStatus = false
            this.$q.notify({
              message: '成功',
              caption: '设置成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    getLibStoreList () {
      this.$store
        .dispatch('merchant/getAccountDataList', {
          user_id: this.user_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.storeList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    bindOperate (store_id, status) {
      const item = { store_id, status: status ? 1 : 2, user_id: this.user_id }
      this.$store
        .dispatch('merchant/setAccount', item)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '绑定成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '绑定失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
