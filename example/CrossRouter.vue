<style>
.cross-router {
  margin-top: 2em
}

.cross-router .file-uploads {
  font-size: 18px;
  padding: .6em;
  font-weight: bold;
  border: 1px solid #888;
  background: #f3f3f3
}

.cross-router button {
  padding: .6em;
}

.cross-router  .list li {
  border-bottom: 1px solid #888;
}
.cross-router  .list span {
  display: inline-block;
  padding: .4em
}
</style>
<template>
  <main class="cross-router">
    <nav>
      <h3>Sub navigation</h3>
      <ul>
        <li><router-link to="/cross-router">File upload</router-link></li>
        <li><router-link to="/cross-router/list">File list</router-link></li>
      </ul>
    </nav>
    <keep-alive>
      <router-view :files="files"></router-view>
    </keep-alive>
  </main>
</template>


<script>
export default {
  data() {
    return {
      files: [],
    }
  },
}
</script>
