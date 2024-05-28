<template>
  <q-card class="my-card" flat bordered>
    <q-item>
      <q-item-section top>
        <q-item-label class="text-center q-my-md">当前标签</q-item-label>
        <q-separator inset />
        <q-item-label caption class="text-center">
          <q-card-section v-if="haveTag.length > 0">
            <q-chip removable @remove="handleClose(item)" color="primary" text-color="white" v-for="(item, key) in haveTag" :key="key">
              {{ item.mti_name }}
            </q-chip>
          </q-card-section>
          <q-card-section v-else>暂无标签</q-card-section>
        </q-item-label>
      </q-item-section>
      <q-separator vertical />
      <q-item-section top>
        <q-item-label class="text-center q-my-md">可贴标签</q-item-label>
        <q-separator inset />
        <q-item-label caption class="text-center">
          <q-card-section v-if="membertagData.length > 0">
            <span v-for="(item, key) in membertagData" :key="key" @click="addTag(item)">
              <q-chip color="orange" text-color="white" class="q-ml-none">
                {{ item.mti_name }}
              </q-chip>
            </span>
          </q-card-section>
          <q-card-section v-else>暂无可贴标签</q-card-section>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
export default {
  name: 'SelectMembertag',
  props: ['memberId'],
  data () {
    return {
      membertagData: [],
      haveTag: []
    }
  },
  watch: {
    haveTag (val) {
      this.$emit('getMembertag', val)
    }
  },
  created () {},
  mounted () {
    setTimeout(() => {
      this.getTag()
    }, 200)
  },
  computed: {},
  methods: {
    addTag (val) {
      if (val) {
        this.haveTag.push(val)
        this.membertagData.splice(this.membertagData.indexOf(val), 1)
      }
    },
    handleClose (val) {
      if (val) {
        this.haveTag.splice(this.haveTag.indexOf(val), 1)
        this.membertagData.push(val)
      }
    },
    getTag () {
      const params = {
        memberId: this.memberId
      }
      this.$store
        .dispatch('membertag/getTagData', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.membertagData = res.data.notTag
            this.haveTag = res.data.haveTag
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red',
            message: '失败',
            caption: error.message,
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>

<style></style>
