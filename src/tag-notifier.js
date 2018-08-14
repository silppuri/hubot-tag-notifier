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
const FormatedDate = require("./FormatedDate");

// class Cron {
//   constructor()
// }

class Notifier {
  constructor(robot) {
    this.robot = robot;
    if (this.robot.brain.data.decisions == null) {
      this.robot.brain.data.decisions = new Map();
    }
  }

  add(message) {
    let id = uuidv4();
    let text = message.message.text;
    let user = message.message.user;
    let room = message.message.room;
    let time = Date.now();
    this.robot.brain.data.decisions.set(id, { text, user, room, time });
  }
}

function* formatEntries(entryIterable) {
  let i = 1;
  for (let value of entryIterable) {
    yield `${i}) ${value.text}. By @${value.user.name} in ${value.room}\n`;
    i = i + 1;
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
    let formatedEntries = "";
    for (let entry of formatEntries(decisions.values())) {
      formatedEntries = formatedEntries + entry;
    }
    response.reply(`Decisions made since ${FormatedDate.weekAgo()}:
${formatedEntries}`);
  });

  // list decisions numbered list

  // remove decision by number

  // Cron job
};

// TODO: Per tag custom cron pattern (like in hubot-deploy-status)
