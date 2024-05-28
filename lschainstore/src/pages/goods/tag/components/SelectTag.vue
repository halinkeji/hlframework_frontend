<template>
  <q-card flat bordered class="rounded-borders q-pa-md">
    <div class="row text-center">
      <div class="col-5">当前标签</div>
      <q-separator :vertical="true" class="q-mx-sm" />
      <div class="col-5">可贴标签</div>
    </div>
    <div class="row text-center q-mt-md">
      <div class="col-5">
        <template v-if="haveTag.length > 0">
          <q-chip removable @remove="handleClose(item)" color="primary" text-color="white" v-for="(item, key) in haveTag" :key="key">
            {{ item.gt_name }}
          </q-chip>
        </template>
        <template v-else>暂无标签</template>
      </div>
      <q-separator :vertical="true" class="q-mx-sm" />
      <div class="col-5">
        <template v-if="tagData.length > 0">
          <span v-for="(item, key) in tagData" :key="key" @click="addTag(item)">
            <q-chip color="orange" text-color="white" class="q-ml-none">
              {{ item.gt_name }}
            </q-chip>
          </span>
        </template>
        <template v-else>暂无可贴标签</template>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'SelectTag',
  props: ['goodsId'],
  data () {
    return {
      tagData: [],
      haveTag: []
    }
  },
  watch: {
    haveTag (val) {
      this.$emit('getTag', val)
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
        this.tagData.splice(this.tagData.indexOf(val), 1)
      }
    },
    handleClose (val) {
      if (val) {
        this.haveTag.splice(this.haveTag.indexOf(val), 1)
        this.tagData.push(val)
      }
    },
    getTag () {
      const params = {
        goodsId: this.goodsId
      }
      this.$store
        .dispatch('goodsTag/getTagData', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.tagData = res.data.notTag
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
