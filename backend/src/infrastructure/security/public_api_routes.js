const publicApiRoutes = [
  { method: 'GET', path: '/api/health' },
  { method: 'POST', path: '/api/auth/login' },
]

function isPublicApiRoute(method, requestUrl) {
  const path = requestUrl.split('?')[0]
  return publicApiRoutes.some(
    (route) => route.method === method && route.path === path,
  )
}

module.exports = { isPublicApiRoute, publicApiRoutes }
