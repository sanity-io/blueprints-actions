const tap = require('tap')
const mockRequire = require('mock-require')

const testToken = 'test-token'
const testProjectId = 'test-project-id'
const testOrgId = 'test-organization-id'
const testStackId = 'test-stack-id'

// Helper to create a simple mock function
function createMockFn() {
  const calls = []
  const fn = (...args) => {
    calls.push({arguments: args})
    return fn.returnValue !== undefined ? fn.returnValue : Promise.resolve()
  }
  fn.calls = calls
  fn.callCount = () => calls.length
  fn.mockImplementation = (impl) => {
    fn.implementation = impl
    return fn
  }
  fn.mockReturnValue = (value) => {
    fn.returnValue = value
    return fn
  }
  // Override to use custom implementation if set
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      calls.push({arguments: args})
      if (target.implementation) {
        return target.implementation(...args)
      }
      return target.returnValue !== undefined ? target.returnValue : Promise.resolve()
    },
  })
}

tap.test('index.js tests', (t) => {
  let mockCore
  let mockExec

  t.beforeEach(() => {
    // Reset mocks before each test
    mockCore = {
      getInput: createMockFn(),
      setFailed: createMockFn(),
      info: createMockFn(),
      exportVariable: createMockFn(),
    }

    mockExec = {
      exec: createMockFn(),
    }

    mockRequire('@actions/core', mockCore)
    mockRequire('@actions/exec', mockExec)

    // Clear module cache to get fresh instance
    delete require.cache[require.resolve('../src/index.js')]
  })

  t.afterEach(() => {
    mockRequire.stopAll()
  })

  t.test('should fail if both project_id and organization_id inputs are missing', async (t) => {
    mockCore.getInput.mockImplementation((key) => {
      if (key === 'sanity_token') return testToken
      if (key === 'stack_id') return testStackId
      if (key === 'project_id') return ''
      if (key === 'organization_id') return ''
      return ''
    })
    mockExec.exec.mockImplementation(() => Promise.resolve(0))

    require('../src')
    await new Promise((resolve) => setImmediate(resolve))

    t.equal(mockCore.setFailed.callCount(), 1, 'setFailed should be called once')
    t.match(
      mockCore.setFailed.calls[0].arguments[0],
      /Missing either a `project_id` or an `organization_id`/,
      'should fail with missing project_id or organization_id message',
    )
  })

  t.test('should export SANITY_AUTH_TOKEN', async (t) => {
    mockCore.getInput.mockImplementation((key) => {
      if (key === 'sanity_token') return testToken
      if (key === 'stack_id') return testStackId
      if (key === 'project_id') return testProjectId
      return ''
    })
    mockExec.exec.mockImplementation(() => Promise.resolve(0))

    require('../src')
    await new Promise((resolve) => setImmediate(resolve))

    const exportCalls = mockCore.exportVariable.calls
    const authTokenCall = exportCalls.find((call) => call.arguments[0] === 'SANITY_AUTH_TOKEN')
    t.ok(authTokenCall, 'SANITY_AUTH_TOKEN should be exported')
    t.equal(authTokenCall.arguments[1], testToken, 'should export correct token value')
  })

  t.test(
    'should export SANITY_ORGANIZATION_ID when organization_id input is provided',
    async (t) => {
      mockCore.getInput.mockImplementation((key) => {
        if (key === 'sanity_token') return testToken
        if (key === 'stack_id') return testStackId
        if (key === 'organization_id') return testOrgId
        return ''
      })
      mockExec.exec.mockImplementation(() => Promise.resolve(0))

      require('../src')
      await new Promise((resolve) => setImmediate(resolve))

      const exportCalls = mockCore.exportVariable.calls
      const orgIdCall = exportCalls.find((call) => call.arguments[0] === 'SANITY_ORGANIZATION_ID')
      t.ok(orgIdCall, 'SANITY_ORGANIZATION_ID should be exported')
      t.equal(orgIdCall.arguments[1], testOrgId, 'should export correct organization_id value')
    },
  )

  t.test('should export SANITY_PROJECT_ID when project_id input is provided', async (t) => {
    mockCore.getInput.mockImplementation((key) => {
      if (key === 'sanity_token') return testToken
      if (key === 'stack_id') return testStackId
      if (key === 'project_id') return testProjectId
      return ''
    })
    mockExec.exec.mockImplementation(() => Promise.resolve(0))

    require('../src')
    await new Promise((resolve) => setImmediate(resolve))

    const exportCalls = mockCore.exportVariable.calls
    const projectIdCall = exportCalls.find((call) => call.arguments[0] === 'SANITY_PROJECT_ID')
    t.ok(projectIdCall, 'SANITY_PROJECT_ID should be exported')
    t.equal(projectIdCall.arguments[1], testProjectId, 'should export correct project_id value')
  })

  t.test('should successfully deploy with valid inputs', async (t) => {
    mockCore.getInput.mockImplementation((key) => {
      if (key === 'sanity_token') return testToken
      if (key === 'stack_id') return testStackId
      if (key === 'project_id') return testProjectId
      return ''
    })
    mockExec.exec.mockImplementation(() => Promise.resolve(0))

    require('../src')
    await new Promise((resolve) => setTimeout(resolve, 100))

    t.equal(mockExec.exec.callCount(), 1, 'exec should be called once')
    t.equal(mockCore.setFailed.callCount(), 0, 'setFailed should not be called')

    const execCall = mockExec.exec.calls[0]
    t.equal(execCall.arguments[0], 'npx', 'should call npx')
    t.same(execCall.arguments[1], ['@sanity/runtime-cli', 'blueprints', 'deploy'])
  })

  t.test('should handle CLI execution failure', async (t) => {
    mockCore.getInput.mockImplementation((key) => {
      if (key === 'sanity_token') return testToken
      if (key === 'stack_id') return testStackId
      if (key === 'project_id') return testProjectId
      return ''
    })
    mockExec.exec.mockImplementation(() => Promise.reject(new Error('CLI error')))

    require('../src')
    await new Promise((resolve) => setTimeout(resolve, 100))

    t.equal(mockCore.setFailed.callCount(), 1)
    t.match(mockCore.setFailed.calls[0].arguments[0], /CLI error/)
  })

  t.end()
})
