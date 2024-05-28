<template>

  <div>
    <q-icon :key="`star${k}`" v-for="(i,k) in params.data.gc_comment_star_level" name="star" color="red"></q-icon>
  </div>

</template>
<script>
export default {
  name: 'PictureItem',
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
<style scoped></style>
