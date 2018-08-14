"use strict";

// Description
//   Timely notifier of tags gathered from flowdock
//
// Configuration:
//
// Commands:
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Kaiku Health <dev@kaikuhealth.com>

const uuidv4 = require("uuid/v4");

// class Cron {
//   constructor()
// }

class Notifier {
  constructor(robot) {
    this.robot = robot;
    if (this.robot.brain.data.decisions == null) {
      this.robot.brain.data.decisions = {};
    }
  }

  add(message) {
    console.log(message);
    let id = uuidv4();
    let text = message.message.text;
    let user = message.message.user;
    let room = message.message.room;
    let time = Date.now();
    this.robot.brain.data.decisions[id] = { text, user, room, time };
    console.log(this.robot.brain.data.decisions);
  }
}

module.exports = robot => {
  const notifier = new Notifier(robot);

  // Listen to all messages containing "decision"
  robot.hear(/#decision/, decisionMessage => {
    notifier.add(decisionMessage);
  });

  robot.respond(/list decisions/i, response => {
    let decisions = notifier.robot.brain.data.decisions;
    if (decisions.length < 1) {
      response.reply("No decisions made");
    }
    response.reply(`Number of decisions ${Object.keys(decisions).length}`);
  });

  // list decisions numbered list

  // remove decision by number

  // Cron job
};

// TODO: Per tag custom cron pattern (like in hubot-deploy-status)
