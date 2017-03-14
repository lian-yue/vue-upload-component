<style>
nav {
  margin-bottom: 1em
}
</style>
<script>
export default {
  render(h) {
    return (
      <div id="app">
        <header id="header">
          <h1>Upload test</h1>
          <nav>
            <h2>Navigation</h2>
            <h3>Please click on the navigation</h3>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/multi">Multi components</router-link></li>
              <li><router-link to="/cross-router">Cross router</router-link></li>
              <li><router-link to="/vuex">Vuex</router-link></li>
            </ul>
          </nav>
        </header>
        <router-view id="main"></router-view>
        <footer id="footer">
          <div>Powered by:<a href="//www.lianyue.org">LianYue</a></div>
        </footer>
      </div>
    )
  }
}
</script>
