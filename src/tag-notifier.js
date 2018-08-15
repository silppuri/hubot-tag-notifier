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
const CronJob = require("cron").CronJob;
const twitter = require("twitter-text");

class Notifier {
  constructor(robot) {
    this.robot = robot;
    if (this.robot.brain.data.decisions == null) {
      this.robot.brain.data.decisions = {};
    }
  }

  add(message) {
    let id = uuidv4();
    let text = message.message.text;
    let user = message.message.user;
    let room = message.message.room;
    let time = Date.now();
    this.robot.brain.data.decisions[id] = { text, user, room, time };
  }
}

function formatEntries(entries) {
  let result = "";
  let i = 1;
  if (Object.keys(entries).length < 1) {
    result = "No decisions made";
  } else {
    for (let key in entries) {
      let value = entries[key];
      let entryString = `${i}) By @${value.user.name} in ${value.room}\n`;
      entryString = entryString + value.text;
      result = result + entryString + "\n";
      i = i + 1;
    }
  }
  return result;
}

module.exports = robot => {
  const notifier = new Notifier(robot);

  // Listen to all messages containing "decision"
  robot.hear(/#decision/, decisionMessage => {
    notifier.add(decisionMessage);
  });

  robot.respond(/list decisions/i, response => {
    let decisions = notifier.robot.brain.data.decisions;
    response.reply(`Decisions made since ${FormatedDate.weekAgo()}:
${formatEntries(decisions)}`);
  });

  // list decisions numbered list

  // remove decision by number

  // Cron job
};

// TODO: Per tag custom cron pattern (like in hubot-deploy-status)
