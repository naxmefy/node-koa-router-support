import Koa from 'koa'
import KoaRouter from 'koa-router'
import supertest from 'supertest'

import koaRouterSupport from '../src'

class MockController {
  async index (ctx) {
    ctx.body = [{msg: 'index'}]
  }

  async show (ctx) {
    ctx.body = {msg: 'show'}
  }

  async create (ctx) {
    ctx.body = {msg: 'create'}
  }

  async update (ctx) {
    ctx.body = {msg: 'update'}
  }

  async destroy (ctx) {
    ctx.body = {msg: 'destroy'}
  }
}

koaRouterSupport(KoaRouter)

const app = new Koa()
const router = new KoaRouter()

router.scope('/foo', r => {
  r.get('/bar', async ctx => {
    ctx.body = 'foobar'
  })

  r.resource(new MockController())
})

app.use(router.routes(), router.allowedMethods())

const request = supertest(app.listen())

describe('KoaRouterSupport', function () {

  describe('prototype scope', function () {
    it('should exists and be a function', function () {
      KoaRouter.prototype.should.have.a.property('scope')
      KoaRouter.prototype.scope.should.be.a.Function()
    })

    it('should return 200 scope /foo and GET /bar as /foo/bar', function * () {
      const resp = yield request.get('/foo/bar')
      resp.status.should.be.eql(200)
      resp.text.should.be.eql('foobar')
    })
  })

  describe('prototype resource', function () {
    it('should exists and a function', function () {
      KoaRouter.prototype.should.have.a.property('resource')
      KoaRouter.prototype.resource.should.be.a.Function()
    })

    it('should response 200 for GET /foo', function * () {
      const response = yield request.get('/foo')
      response.status.should.be.eql(200)
      response.body.should.be.an.Array()
    })

    it('should response 200 for POST /foo', function * () {
      const response = yield request.post('/foo')
      response.status.should.be.eql(200)
      response.body.should.have.property('msg')
      response.body.should.containEql({msg: 'create'})
    })

    it('should response 200 for GET /foo/:id', function * () {
      const response = yield request.get('/foo/1')
      response.status.should.be.eql(200)
      response.body.should.have.property('msg')
      response.body.should.containEql({msg: 'show'})
    })

    it('should response 200 for PUT /foo/:id', function * () {
      const response = yield request.put('/foo/1')
      response.status.should.be.eql(200)
      response.body.should.have.property('msg')
      response.body.should.containEql({msg: 'update'})
    })


    it('should response 200 for DELETE /dummy/:id', function * () {
      const response = yield request.delete('/foo/1')
      response.status.should.be.eql(200)
      response.body.should.have.property('msg')
      response.body.should.be.containEql({msg: 'destroy'})
    })
  })
})
