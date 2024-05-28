<template>
  <div class="text-center">
    <hl-upload
      :multiple="false"
      :size="50"
      :btnSize="60"
      :btnDense="true"
      :currentAttach="pictureData.coverImageObject"
      @input="
        (val, o) => {
          $nextTick(() => {
            pictureData.coverImageObject = o;
            pictureData.coverImage = val;
          });
        }
      "
    />
  </div>
</template>

<script>
export default {
  name: 'AgPictureItem',
  data () {
    return {
      pictureData: {}
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.pictureData = this.params.data
  },
  methods: {}
}
</script>

<style scoped></style>
