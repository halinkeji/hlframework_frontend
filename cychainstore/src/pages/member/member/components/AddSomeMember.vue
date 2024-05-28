<template>
  <q-dialog v-model="addsomeMemberDialog">
    <q-card :style="{ width: $q.screen.width * 0.5 + 'px', 'min-width': $q.screen.width * 0.5 + 'px' }" flat class="q-pa-sm">
      <q-card-section class="row">
        <div class="text-h6">批量自定义生成会员</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>
      <q-form ref="memberDataRef" class="q-gutter-md q-mt-md">
        <div class="row q-pl-xs">
          <div class="col-12 col-md-6  q-pr-lg ">
            <q-input
              label="生成会员数量"
              outlined
              v-model="number"
              dense
              lazy-rules
              :rules="[(val) => !!val || '生成会员数量是必填的', (val) => /^[1-9]\d*$/.test(val) || '生成会员数量为正整数']"
            />

            <q-input
              :label="`会员初始${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
              outlined
              v-model="mem_memberMoneyCount"
              class="q-mt-xs"
              dense
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || `会员初始${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit}为非负两位以内小数`]"
            />
          </div>
          <div class="col-12 col-md-6  q-pr-lg ">
            <q-select
              outlined
              v-model="membercardlevel_id"
              option-value="id"
              option-label="mcl_level_name"
              :options="memberCardLevelDatas"
              :error="false"
              dense
              label="会员等级"
              emit-value
              map-options
              :rules="[(val) => !!val || '会员等级是必填的']"
            />

            <q-input
              :label="`会员初始${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
              outlined
              v-model="mem_memberPointsCount"
              class="q-mt-xs"
              dense
              lazy-rules
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || `会员初始${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}为非负两位以内小数`]"
            />
          </div>
        </div>
      </q-form>

      <q-card-actions align="center">
        <q-btn label="提交" unelevated  color="primary" class="q-px-xl" @click="addSomeMember" />
        <q-btn label="返回"  unelevated @click="closeDialog" color="grey" class="q-px-xl" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddSomeMember',
  data () {
    return {
      number: 1,
      mem_memberPointsCount: 0,
      mem_memberMoneyCount: 0,
      memberCardLevelDatas: [],
      membercardlevel_id: '',
      addsomeMemberDialog: false
    }
  },
  computed: {},
  created () {
    this.getLevel()
  },
  mounted () {},
  methods: {
    init () {
      this.addsomeMemberDialog = true
    },
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.memberCardLevelDatas = res.data
            } else {
              this.memberCardLevelDatas = []
            }
          }
        })
        .catch((error) => {})
    },
    addSomeMember () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            number: this.number,
            mem_memberPointsCount: this.mem_memberPointsCount,
            mem_memberMoneyCount: this.mem_memberMoneyCount,
            membercardlevel_id: this.membercardlevel_id
          }

          this.$store
            .dispatch('member/addMembers', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功新增 ' + res.data + ' 条会员！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.addsomeMemberDialog = false
                    this.closeDialog()
                  }, 500)
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '新增会员失败',
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
    closeDialog () {
      this.$emit('closeDialog')
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
<style scoped></style>
