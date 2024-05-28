<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-tabs v-model="patternTab" dense class="text-grey" active-color="primary"  indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="文章" />
          <q-tab name="2" label="分类/标签" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height  " v-if="parseInt(patternTab) == 1">
        <pattern-article></pattern-article>
      </div>
      <div class="col-shrink full-height  " v-if="parseInt(patternTab) == 2">
        <pattern-tag></pattern-tag>
      </div>
    </div>
  </q-page>
</template>
<script>
import patternArticle from './Article'
import patternTag from './Tag'
export default {
  name: 'patternIndex',
  components: {
    patternArticle,
    patternTag
  },
  data () {
    return {
      patternTab: '1'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
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
