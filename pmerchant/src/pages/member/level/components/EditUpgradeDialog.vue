<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="bg-grey-2"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-pa-sm ">
          <div class="text-subtitle1">级别升级规则</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height q-mt-xs bg-white">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="ruleFormRef" v-if="lastMemberCardLevelDatas && lastMemberCardLevelDatas.length > 0">
              <q-item class="full-width q-px-none">
                <q-item-section>
                  <q-select
                    outlined
                    v-model="upgradeRuleForm.lur_before_level_id"
                    option-value="id"
                    option-label="mcl_level_name"
                    :options="memberCardLevelDatas"
                    dense
                    label="升级前会员级别"
                    emit-value
                    map-options
                    bottom-slots
                    clearable
                    disable
                  />
                </q-item-section>

                <q-item-section>
                  <q-select
                    outlined
                    v-model="upgradeRuleForm.lur_after_level_id"
                    option-value="id"
                    option-label="mcl_level_name"
                    :options="lastMemberCardLevelDatas"
                    dense
                    label="升级后会员级别"
                    emit-value
                    map-options
                    bottom-slots
                    clearable
                  />
                </q-item-section>

                <q-item-section>
                  <q-input
                    label="累计成长值"
                    outlined
                    v-model="upgradeRuleForm.lur_total_grow_rate"
                    dense
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '成长值为非负两位以内小数']"
                  />
                </q-item-section>

                <q-item-section side top>
                  <q-btn color="positive" @click="saveData" unelevated label="新增" />
                </q-item-section>
              </q-item>
            </q-form>

            <q-table
              flat
              bordered
              :pagination="{
                rowsPerPage: 0,
              }"
              :data="ruleData"
              :columns="columns"
              row-key="name"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <!-- <q-td key="lur_sort" :props="props">
                    {{ props.row.lur_sort }}
                  </q-td> -->
                  <q-td key="lur_before_level_id" :props="props">
                    {{  props.row.beforeLevel && props.row.beforeLevel.mcl_level_name ? props.row.beforeLevel.mcl_level_name : '' }}
                  </q-td>

                  <q-td key="lur_after_level_id" :props="props">
                    {{  props.row.afterLevel && props.row.afterLevel.mcl_level_name ? props.row.afterLevel.mcl_level_name : '' }}
                  </q-td>

                  <q-td key="lur_total_grow_rate" :props="props">
                    {{ props.row.lur_total_grow_rate }}
                  </q-td>

                  <q-td key="id" :props="props">
                    <q-btn color="negative" @click="delUpgradeRule(props.row.id)" unelevated label="删除" />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm q-mt-xs row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="完成" @click="hideNowPage" color="primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EditUpgradeDialog',
  data () {
    return {
      addStoreSidebar: false,

      memberCardLevelDatas: [],
      upgradeRuleForm: {
        lur_before_level_id: '',
        lur_after_level_id: '',
        lur_total_grow_rate: '',
        lur_sort: ''
      },

      columns: [
        // { name: 'lur_sort', align: 'center', label: '排序', field: 'lur_sort' },
        { name: 'lur_before_level_id', align: 'center', label: '升级前会员级别', field: 'lur_before_level_id' },
        { name: 'lur_after_level_id', align: 'center', label: '升级后会员级别', field: 'lur_after_level_id' },
        { name: 'lur_total_grow_rate', align: 'center', label: '累计成长值', field: 'lur_total_grow_rate' },
        { name: 'id', align: 'center', label: '操作', field: 'id' }
      ],
      ruleData: [],
      lastMemberCardLevelDatas: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init () {
      this.addStoreSidebar = true
      this.getLevel()
    },

    getLevel () {
      this.$store
        .dispatch('level/getAllData', {
          mclType: 'default'
        })
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelDatas = res.data && res.data.length > 0 ? res.data : []

            this.$nextTick(() => {
              this.getItem()
            })
          }
        })
        .catch((error) => {})
    },
    getItem () {
      this.$store.dispatch('level/getUpgrade').then((res) => {
        if (res.code == 200) {
          this.ruleData = res.data ? res.data : []

          if (this.memberCardLevelDatas && this.memberCardLevelDatas.length > 0) {
            if (this.ruleData && this.ruleData.length == 0) {
              const findIndex = _.findIndex(this.memberCardLevelDatas, function (o) { return parseInt(o.mcl_default) == 1 })
              if (findIndex > -1) {
                this.upgradeRuleForm.lur_before_level_id = this.memberCardLevelDatas[findIndex].id
              } else {
                this.upgradeRuleForm.lur_before_level_id = this.memberCardLevelDatas[0].id
              }
            } else {
              this.upgradeRuleForm.lur_before_level_id = this.ruleData[0].lur_after_level_id
            }

            this.$nextTick(() => {
              this.filtrUseLevel()
            })
          }
        }
      })
    },

    filtrUseLevel () {
      this.lastMemberCardLevelDatas = []
      if (this.ruleData && this.ruleData.length > 0) {
        this.memberCardLevelDatas.forEach((item) => {
          const afterIndex = _.findIndex(this.ruleData, function (o) { return parseInt(o.lur_after_level_id) == parseInt(item.id) })

          const beforeIndex = _.findIndex(this.ruleData, function (o) { return parseInt(o.lur_before_level_id) == parseInt(item.id) })
          if (afterIndex < 0 && beforeIndex < 0) {
            this.lastMemberCardLevelDatas.push(item)
          }
        })
      } else {
        this.memberCardLevelDatas.forEach((item) => {
          if (parseInt(this.upgradeRuleForm.lur_before_level_id) != parseInt(item.id)) {
            this.lastMemberCardLevelDatas.push(item)
          }
        })
      }
    },
    saveData () {
      this.$refs.ruleFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.upgradeRuleForm
          }
          this.$store
            .dispatch('level/setUpgradeData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '新增规则成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.upgradeRuleForm = {
                  lur_before_level_id: '',
                  lur_after_level_id: '',
                  lur_total_grow_rate: '',
                  lur_sort: ''
                }

                this.$nextTick(() => {
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '错误',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '错误',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.addStoreSidebar = false
      this.$emit('getMethods')
    },

    delUpgradeRule (id) {
      this.$store
        .dispatch('level/delUpgrade', {
          id
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除规则成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {
              this.getItem()
            })
          } else {
            this.$q.notify({
              message: '错误',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: res.message,
              color: 'red'
            })
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
