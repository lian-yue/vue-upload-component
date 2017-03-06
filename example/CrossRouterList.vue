<template>
  <div>
    <h2>List</h2>
    <div class="lists">
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Name</th>
            <th>Size</th>
            <th>Progress</th>
            <th>Speed</th>
            <th>Active</th>
            <th>Error</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in files">
              <td>{{index}}</td>
              <td>{{file.id}}</td>
              <td>{{file.name}}</td>
              <td>{{file.size | formatSize}}</td>
              <td>{{file.progress}}</td>
              <td>{{file.speed | formatSize}}</td>
              <td>{{file.active}}</td>
              <td>{{file.error}}</td>
              <td>{{file.success}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  }
}
</script>
