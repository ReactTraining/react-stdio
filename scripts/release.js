const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;
const prompt = require("readline-sync").question;

process.chdir(path.resolve(__dirname, ".."));

const exec = command => execSync(command, { stdio: "inherit" });

const getPackageVersion = () =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json")))
    .version;

const binaryPlatforms = [
  "win-x64",
  "win-x86",
  "linux-x64",
  "linux-x86",
  "macos"
];

// Get the next version, which may be specified as a semver
// version number or anything `npm version` recognizes. This
// is a "pre-release" if nextVersion is premajor, preminor,
// prepatch, or prerelease
const nextVersion = prompt(
  `Next version (current version is ${getPackageVersion()})? `
);
const isPrerelease =
  nextVersion.substr(0, 3) === "pre" || nextVersion.indexOf("-") !== -1;

// 1) Make sure the tests pass
exec("npm test");

// 2) Increment the package version in package.json
// 3) Create a new commit
// 4) Create a v* tag that points to that commit
exec(`npm version ${nextVersion} -m "Version %s"`);

// 5) Build a binary version for universal support
exec(`npm config set react-stdio:version ${nextVersion}`);

binaryPlatforms.forEach(platform => {
  exec(`npm config set react-stdio:platform ${platform}`);
  exec(`npm run dist:binary`);
});

// 6) Publish to npm. Use the "next" tag for pre-releases,
// "latest" for all others
exec(`npm publish --tag ${isPrerelease ? "next" : "latest"}`);

// 7) Push the v* tag to GitHub
exec(`git push -f origin v${getPackageVersion()}`);
