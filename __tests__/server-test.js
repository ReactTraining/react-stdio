const path = require("path");
const childProcess = require("child_process");

describe("server", () => {
  let proc;

  beforeEach(() => {
    proc = childProcess.spawn(
      path.join(__dirname, "..", "bin", "react-stdio"),
      {
        stdio: "pipe"
      }
    );
  });

  afterEach(() => {
    proc.kill();
  });

  it("throws an error when component is missing", done => {
    proc.stdin.write(JSON.stringify({}));

    proc.stdout.once("data", out => {
      expect(JSON.parse(out).error).toEqual("Missing { component } in request");
      done();
    });
  });

  it("throws an error when component cannot be found", done => {
    proc.stdin.write(JSON.stringify({ component: "component.js" }));

    proc.stdout.once("data", out => {
      expect(JSON.parse(out).error).toEqual(
        "Cannot load component: component.js"
      );
      done();
    });
  });

  it("renders the component", done => {
    proc.stdin.write(
      JSON.stringify({
        component: path.join(__dirname, "mocks", "testComponent.js")
      })
    );

    proc.stdout.once("data", out => {
      expect(JSON.parse(out).html).toMatch("I am a test component");
      done();
    });
  });

  it("renders a component and exposes additional context", done => {
    proc.stdin.write(
      JSON.stringify({
        component: path.join(__dirname, "mocks", "contextComponent.js")
      })
    );

    proc.stdout.once("data", out => {
      const result = JSON.parse(out);
      expect(result.html).toMatch("I am a context component");
      expect(result.context).toEqual({ test: true });
      done();
    });
  });
});
