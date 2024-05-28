<template>
  <div>
    <q-markup-table square separator="cell" flat bordered class="text-center">
      <thead>
        <tr>
          <th :colspan="columns.length">
            <div class="row no-wrap items-center">
              <div class="text-h6 text-dark">{{ tableTitle }}</div>
            </div>
          </th>
        </tr>
        <tr>
          <th :class="`text-${item.align}`" v-for="(item, key) in columns">
            {{ item.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in pageData">
          <td v-for="(i, k) in columns">
            {{ item[i.field] }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <!-- <q-table
      :title="tableTitle"
      flat
      bordered
      table-header-class="table-bg"
      :data="pageData"
      :columns="columns"
      row-key="name"
      square
      hide-bottom
    >
      <template v-for="slotName in Object.keys($slots)" v-slot:[slotName]>
        <slot :name="slotName" />
      </template>
      <template
        v-for="slotName in Object.keys($scopedSlots)"
        v-slot:[slotName]="prop"
      >
        <slot :name="slotName" v-bind="prop" />
      </template>
    </q-table> -->
  </div>
</template>
<script>
export default {
  name: "hlTable",
  props: {
    listData: {
      type: Array,
      default: []
    },
    listColumns: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      columns: [],
      pageData: [],
      tableTitle: ""
    };
  },
  watch: {
    listData(v) {
      if (v.length > 0) {
        this.pageData = v;
      }
    },
    listColumns(v) {
      if (v.length > 0) {
        this.columns = v;
      }
    },
    title(v) {
      if (v.length > 0) {
        this.tableTitle = v;
      }
    }
  },
  created() {
    if (this.listData.length > 0) {
      this.pageData = this.listData;
    }
    if (this.listColumns.length > 0) {
      this.columns = this.listColumns;
    }
    if (this.title) {
      this.tableTitle = this.title;
    }
  }
};
</script>
<style>
.table-bg {
  background-color: #f8f8f9;
}
</style>
