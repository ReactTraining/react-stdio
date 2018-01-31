const execSync = require("child_process").execSync;

const tag = process.env.TRAVIS_TAG || `v${process.env.npm_package_version}`;
const platforms = [
  "win-x64",
  // "win-x86", // pending https://github.com/zeit/pkg/issues/310
  "linux-x64",
  // "linux-x86", // pending https://github.com/zeit/pkg/issues/310
  "macos"
];

platforms.forEach(platform => {
  console.log(`\nBuilding binary for ${platform}...`);
  execSync(
    `pkg ./bin/react-stdio -t ${platform} -o ./build/${tag}/${platform}/react-stdio`,
    { stdio: "inherit" }
  );
});
