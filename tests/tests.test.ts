import { execFileSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterAll, describe, expect, test } from 'vitest'
import * as git from '../src/index.js'

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

test('count() returns a non-zero number', () => {
  const result = git.gitCount()

  expect(result).toBeGreaterThan(0)
})

test('count() returns a positive number', () => {
  const result = git.gitCount()

  expect(result).toBeGreaterThanOrEqual(0)
})

test('date() returns a date', () => {
  const result = git.gitDate()

  expect(result instanceof Date).toBeTruthy()
})

test('isDirty() returns a boolean', () => {
  const result = git.gitIsDirty()

  expect(typeof result).toBe('boolean')
})

test('isTagDirty() returns a boolean', () => {
  const result = git.gitIsTagDirty()

  expect(typeof result).toBe('boolean')
})

test('message() returns a string with non-zero length', () => {
  const result = git.gitMessage()

  expect(!!result.length).toBeTruthy()
})

test('tag() returns a string with non-zero length', () => {
  const result = git.gitTag()

  expect(!!result.length).toBeTruthy()
})

test('tagFirstParent() returns a string with non-zero length', () => {
  const result = git.gitTagFirstParent()

  expect(!!result.length).toBeTruthy()
})

test('remoteUrl() works', () => {
  const result = git.gitRemoteUrl()

  expect(
    result.includes('https://github.com') || result.includes('git@github.com'),
  ).toBeTruthy()
})

describe('worktrees', () => {
  const tmpDir = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), 'tiny-git-rev-sync-')),
  )
  const mainDir = path.join(tmpDir, 'main')
  const worktreeDir = path.join(tmpDir, 'worktree')

  function runGit(cwd: string, args: string[]) {
    return execFileSync(
      'git',
      ['-c', 'user.name=test', '-c', 'user.email=test@test.com', ...args],
      { cwd, encoding: 'utf8' },
    ).trim()
  }

  fs.mkdirSync(mainDir)
  runGit(mainDir, ['init', '-q', '-b', 'main'])
  runGit(mainDir, ['commit', '-q', '--allow-empty', '-m', 'init'])
  runGit(mainDir, ['worktree', 'add', '-q', '-b', 'feature', worktreeDir])
  runGit(worktreeDir, ['commit', '-q', '--allow-empty', '-m', 'feature'])

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  test('branch() returns the worktree branch', () => {
    expect(git.gitBranch(worktreeDir)).toBe('feature')
    expect(git.gitBranch(mainDir)).toBe('main')
  })

  test('long() returns the worktree HEAD', () => {
    expect(git.gitLong(worktreeDir)).toBe(
      runGit(worktreeDir, ['rev-parse', 'HEAD']),
    )
  })

  test('long() works with packed refs', () => {
    runGit(mainDir, ['pack-refs', '--all'])

    expect(git.gitLong(worktreeDir)).toBe(
      runGit(worktreeDir, ['rev-parse', 'HEAD']),
    )
    expect(git.gitLong(mainDir)).toBe(runGit(mainDir, ['rev-parse', 'HEAD']))
  })
})
