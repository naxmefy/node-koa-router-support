import * as _ from 'lodash'
import urljoin from 'urljoin'

export default function (KoaRouter) {
  /**
   *
   * @param {String} [route] The route for the resource
   * @param {Object} controller Controller instance (actions)
   * @param {Object} [options]
   * @return {Object} The KoaRouter instance
   */
  KoaRouter.prototype.resource = function (route, controller, options) {
    options = _.defaults(options, {})

    /* istanbul ignore else */
    if (_.isString(route) === false) {
      controller = route
      route = void 0
    }

    /* istanbul ignore else */
    if(route == null) {
      route = ''
    }

    /* istanbul ignore else */
    if (_.first(route) !== '/') {
      route = `/${route}`
    }

    const only = _.get(options, 'only', [
      'index',
      'create',
      'show',
      'update',
      'destroy'
    ])

    const is = o => _.includes(only, o)

    /* istanbul ignore else */
    if (is('index')) {
      this.get(urljoin(route), controller[options.index || 'index'])
    }

    /* istanbul ignore else */
    if (is('create')) {
      this.post(urljoin(route), controller[options.create || 'create'].bind(controller))
    }

    /* istanbul ignore else */
    if (is('show')) {
      this.get(urljoin(route, ':id'), controller[options.show || 'show'].bind(controller))
    }

    /* istanbul ignore else */
    if (is('update')) {
      this.put(urljoin(route, ':id'), controller[options.update || 'update'].bind(controller))
    }

    /* istanbul ignore else */
    if (is('destroy')) {
      this.delete(urljoin(route, ':id'), controller[options.destroy || 'destroy'].bind(controller))
    }

    return this
  }

  /**
   *
   * @param {String} scope The scope route
   * @param {Function} fn The function that get called for the scope
   * @returns {Object} Returns the instance of the KoaRouter
   */
  KoaRouter.prototype.scope = function (scope, fn) {
    const router = new KoaRouter({prefix: scope})
    fn.call(router, router)
    this.use(router.routes())
    return this
  }
}
