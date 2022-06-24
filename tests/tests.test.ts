import { expect, test } from 'vitest'
import * as git from '../src'

test('short() returns string of length 4+', () => {
  expect(git.gitShort().length > 3).toBeTruthy()

  expect(
    git.gitShort({
      length: 8,
    }).length,
  ).toBe(8)
})

test('long() returns string of length 39+', () => {
  const result = git.gitLong()

  expect(result.length > 38).toBeTruthy()
})

test('branch() returns a string with non-zero length', () => {
  const result = git.gitBranch()

  expect(!!result).toBeTruthy()
})

// result = git.count()
// assert.notEqual(result, 0, 'count() returns a non-zero number')
// assert.equal(Math.abs(result), result, 'count() returns a positive number')

// result = git.date()
// assert.equal(result instanceof Date, true, 'date() returns a date')

// result = git.isDirty()
// assert.equal(typeof result, 'boolean', 'isDirty() returns a boolean')

// result = git.isTagDirty()
// assert.equal(typeof result, 'boolean', 'isTagDirty() returns a boolean')

// result = git.message()
// assert.equal(
//   !!result.length,
//   true,
//   'message() returns a string with non-zero length',
// )

// result = git.tag()
// assert.equal(
//   !!result.length,
//   true,
//   'tag() returns a string with non-zero length',
// )

// result = git.tagFirstParent()
// assert.equal(
//   result.length !== 0,
//   true,
//   'tagFirstParent() returns a string with non-zero length',
// )

// result = git.remoteUrl()
// assert.equal(
//   result.indexOf('https://github.com') === 0 ||
//     result.indexOf('git@github.com') === 0,
//   true,
//   "remoteUrl() returns unexpected value: '" + result + "'",
// )
