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
    expect(require("..")).to.be.a("Function");
  });
});

describe("tag-notifier", () => {
  let robot, user;
  let oldDateNow = null;
  beforeEach(() => {
    oldDateNow = Date.now;
    Date.now = () => 1534250076293;
    robot = new Robot(null, "mock-adapter-v3", false, "hubot");
    robot.loadFile(path.resolve("src/"), "tag-notifier.js");
    robot.adapter.on("connected", () => {
      robot.brain.userForId("1", {
        name: "john",
        real_name: "John Doe",
        room: "test"
      });
    });
    robot.run();
    user = robot.brain.userForName("john");
  });

  afterEach(() => {
    Date.now = oldDateNow;
    robot.shutdown();
  });

  it("responds to list decisions", done => {
    robot.adapter.on("reply", function(envelope, strings) {
      const answer = strings[0];

      expect(Object.keys(robot.brain.data.decisions).length).to.eql(1);
      expect(answer).to.contain("Decisions made");

      done();
    });

    robot.adapter.receive(new TextMessage(user, "#decision has been made"));
    robot.adapter.receive(new TextMessage(user, "hubot list decisions"));
  });

  it("saves complex messages", done => {
    robot.adapter.on("reply", function(envelope, strings) {
      const answer = strings[0];

      expect(Object.keys(robot.brain.data.decisions).length).to.eql(2);
      expect(answer).to.equal(`Decisions made since 07.08.2018:
1) By @john in test
Status meeting 15.8.2018
Present: @Sam, @Pete, @Bonnie, @Clyde
Launch plan for Munchies & Banjos:
  - At the end of August (whenever we are ready) launch the rocket to the orbit.
  - 17th of September, prepare some ragu.
  - Everything else follows behind
#decision
2) By @john in test
We are going to buy a pool table #decision
`);
      done();
    });

    robot.adapter.receive(
      new TextMessage(
        user,
        `Status meeting 15.8.2018
Present: @Sam, @Pete, @Bonnie, @Clyde
Launch plan for Munchies & Banjos:
  - At the end of August (whenever we are ready) launch the rocket to the orbit.
  - 17th of September, prepare some ragu.
  - Everything else follows behind
#decision`
      )
    );
    robot.adapter.receive(
      new TextMessage(user, "We are going to buy a pool table #decision")
    );
    robot.adapter.receive(new TextMessage(user, "hubot list decisions"));
  });
});
