import assert from "node:assert/strict";
import { termsAccepted } from "./terms-gate.ts";

assert.equal(termsAccepted("on"), true);
assert.equal(termsAccepted(undefined), false);
assert.equal(termsAccepted(null), false);
assert.equal(termsAccepted(""), false);
assert.equal(termsAccepted("true"), false);
assert.equal(termsAccepted(true), false);
assert.equal(termsAccepted("on "), false);

console.log("terms-gate ok");
