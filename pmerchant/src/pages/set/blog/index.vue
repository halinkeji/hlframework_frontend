<template>
  <q-page class="fit row">
    <div class="col-1">
      <q-tabs dense v-model="blogTab" vertical active-class="text-primary">
        <q-tab
          :icon="item.type == 'page' ? 'las la-file' : 'las la-file-alt'"
          :name="item.value"
          v-for="(item, key) in attributeData"
          @click="changeAttribute(item)"
          :key="`${key}-tab`"
          :label="item.label"
        />
      </q-tabs>
    </div>
    <div class="col-11" v-if="blogType == 'list'">
      <list ref="blogList" :attribute="blogTab" />
    </div>
    <div class="col-11 full-height" v-if="blogType == 'page'">
      <blog-page ref="blogPage" :attribute="blogTab" />
    </div>
  </q-page>
</template>
<script>
import List from './List'
import BlogPage from './Page'
export default {
  name: 'BlogManage',
  components: {
    List,
    BlogPage
  },
  data () {
    return {
      blogTab: 'gywm',
      attributeData: this.$store.state.blog.attributeData,
      blogType: 'page'
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    changeAttribute (item) {
      if (item.type != this.blogType) {
        this.blogType = item.type
      } else {
        this.$nextTick(() => {
          if (this.blogType == 'page') {
            this.$refs.blogPage.init()
          } else if (this.blogType == 'list') {
            this.$refs.blogList.getList()
          }
        })
      }
    }
  }
}
</script>
