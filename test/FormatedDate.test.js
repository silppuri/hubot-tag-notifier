"use strict";

/* global describe, beforeEach, afterEach, it */

const path = require("path");

const chai = require("chai");
const Hubot = require("hubot");

const expect = chai.expect;

chai.use(require("sinon-chai"));

describe('require("FormatedDate")', () => {
  it("exports a function", () => {
    expect(require("../src/FormatedDate")).to.be.a("Object");
  });
});

describe("NotificationDate#weekAgo", () => {
  let oldDateNow = null;
  beforeEach(() => {
    oldDateNow = Date.now;
    Date.now = () => 1534250076293;
  });
  afterEach(() => {
    Date.now = oldDateNow;
  });
  it("returns a DD.MM.YYYY formated date week ago", () => {
    let FormatedDate = require("../src/FormatedDate");
    expect(FormatedDate.weekAgo()).to.eql("07.08.2018");
  });
});
