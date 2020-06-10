export default async ({store, app}) => {
  app.router.afterEach(function(route) {
    const matchRoute = route.matched || []
    const routeList = matchRoute.map(v => {
      return {
        name: v.name,
        path: v.path,
        meta: v.meta || {},
      }
    })

    store.commit('SET_BREADCRUMB', routeList)
    // document.title = routeList[0].meta.tile
  })
}
