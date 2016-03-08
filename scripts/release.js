const resolvePath = require('path').resolve
const readFileSync = require('fs').readFileSync
const execSync = require('child_process').execSync
const prompt = require('readline-sync').question

const exec = (command) =>
  execSync(command, { stdio: 'inherit' })

const getPackageVersion = () =>
  JSON.parse(readFileSync(resolvePath(__dirname, '../package.json'))).version

if (process.cwd() !== resolvePath(__dirname, '..')) {
  console.error('The release script must be run from the repo root')
  process.exit(1)
}

// Get the next version, which may be specified as a semver
// version number or anything `npm version` recognizes. This
// is a "pre-release" if nextVersion is premajor, preminor,
// prepatch, or prerelease
const nextVersion = prompt(`Next version (current version is ${getPackageVersion()})? `)
const isPrerelease = nextVersion.substring(0, 3) === 'pre'

// 1) Increment the package version in package.json
// 2) Create a new commit
// 3) Create a v* tag that points to that commit
exec(`npm version ${nextVersion} -m "Version %s"`)

// 4) Push to GitHub master. Do this before we publish in
// case anyone has pushed to GitHub since we last pulled
exec('git push origin master')

// 5) Publish to npm. Use the "next" tag for pre-releases,
// "latest" for all others
exec(`npm publish --tag ${isPrerelease ? 'next' : 'latest'}`)

// 6) Push the v* tag to GitHub
exec(`git push -f origin v${getPackageVersion()}`)

// 7) Push the "latest" tag to GitHub
if (!isPrerelease) {
  exec('git tag -f latest')
  exec('git push -f origin latest')
}
