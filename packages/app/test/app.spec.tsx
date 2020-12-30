import { expect } from "chai";
import { renderToString } from "react-dom/server";
import { App } from "@bukabuka/app";

describe("<App />", () => {
  it("renders without throwing on the server", () => {
    expect(() => renderToString(<App />)).to.not.throw();
  });

  it("renders provided text", () => {
    expect(renderToString(<App />)).to.contain("Bukabuka");
  });
});
