"use strict";

/* global describe, beforeEach, afterEach, it */

const path = require("path");

const chai = require("chai");
const Hubot = require("hubot");

const expect = chai.expect;
const Robot = Hubot.Robot;
const TextMessage = Hubot.TextMessage;

chai.use(require("sinon-chai"));

describe('require("tag-notifier")', () => {
  it("exports a function", () => {
    expect(require("../index")).to.be.a("Function");
  });
});

describe("tag-notifier", () => {
  let robot, user;

  beforeEach(() => {
    robot = new Robot(null, "mock-adapter-v3", false, "hubot");
    robot.loadFile(path.resolve("src/"), "tag-notifier.js");
    robot.adapter.on("connected", () => {
      robot.brain.userForId("1", {
        name: "john",
        real_name: "John Doe",
        room: "#test"
      });
    });
    robot.run();
    user = robot.brain.userForName("john");
  });

  afterEach(() => {
    robot.shutdown();
  });

  it("responds to hello", done => {
    robot.adapter.on("reply", function(envelope, strings) {
      const answer = strings[0];

      expect(answer).to.eql("hello!");

      done();
    });

    robot.adapter.receive(new TextMessage(user, "hubot hello"));
  });

  it("hears #decision", done => {
    robot.adapter.on("send", function(envelope, strings) {
      const answer = strings[0];

      expect(answer).not.to.eql("yarly");

      done();
    });

    robot.adapter.receive(new TextMessage(user, "#decision has been made"));
  });
});
