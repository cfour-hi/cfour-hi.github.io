const scrolls = {}

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => (document.scrollingElement.scrollTop = scrolls[to.name]))
  },
  beforeRouteLeave (to, from, next) {
    scrolls[from.name] = document.scrollingElement.scrollTop
    next()
  },
}
