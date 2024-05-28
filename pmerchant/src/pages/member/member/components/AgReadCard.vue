<template>
  <div v-if="params.data.relationMobile && params.data.relationMobile.length > 0">
     <span v-for="(item,key) in params.data.relationMobile"><span v-if="key > 0"> ,</span>  {{ item.phone_number }}  </span>
  </div>
</template>
<script>
export default {
  name: 'AgInactiveMemberOperating',
  components: {},
  data () {
    return {
      memberId: ''
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
