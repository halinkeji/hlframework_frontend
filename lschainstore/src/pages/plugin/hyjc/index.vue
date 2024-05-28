<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white">
       <q-tabs v-model="hyjcTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="record" label="寄存记录" v-if="authorityMeta('record')"/>
          <q-tab name="type" label="寄存分类" v-if="authorityMeta('type')"/>
        </q-tabs>
      </div>
      <q-separator />
      <div class="col-shrink fit bg-white">
       <q-tab-panels v-model="hyjcTab" animated class="bg-grey-3 full-height fit">
          <q-tab-panel name="record" class="q-pa-none fit">
            <hyjc-record></hyjc-record>
          </q-tab-panel>
          <q-tab-panel name="type" class="q-pa-none fit">
            <hyjc-type></hyjc-type>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>
<script>
import hyjcRecord from './Record'
import hyjcType from './Type'
export default {
  name: 'hyjc',
  components: {
    hyjcRecord,
    hyjcType
  },
  data () {
    return {
      hyjcTab: 'record'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    authorityMeta (key) {
      // return true
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
