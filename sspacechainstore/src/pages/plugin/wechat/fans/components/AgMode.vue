<template>
  <div>
    <q-chip color="primary" text-color="white" key="key" v-for="(item,key) in tagid_list">
      <div  v-for="(i, k) in groupsData.groups" v-if="i.id == item">
        {{ i.name }}
      </div>


    </q-chip>
  </div>
</template>

<script>
export default {
  name: "AgMode",
  data() {
    return {
      switch1: 1,
      groupsData: [],
      tagid_list: []
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.groupsData = this.params.context.groupsData;

    if (this.params.data.tagid_list) {
      this.tagid_list = this.params.data.tagid_list.split(",");
    }
  },
  methods: {}
};
</script>

<style scoped></style>
