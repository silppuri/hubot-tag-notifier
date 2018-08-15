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

function runTagNagger(robot, notifier, response) {
  let decisions = notifier.robot.brain.data.decisions;
  let responseString = `Decisions made since ${FormatedDate.weekAgo()}:
${formatEntries(decisions)}`;
  if (response !== undefined) {
    response.reply(responseString);
  } else {
    robot.messageRoom("Shell", responseString);
  }
}

module.exports = robot => {
  const notifier = new Notifier(robot);
  const job = new CronJob({
    cronTime: "00 09 * * Mon",
    onTick: () => {
      runTagNagger(robot, notifier);
    },
    start: false,
    timeZone: "Europe/Helsinki"
  });
  job.start();

  // Listen to all messages containing "decision"
  robot.hear(/#decision/, decisionMessage => {
    notifier.add(decisionMessage);
  });

  robot.respond(/list decisions/i, response => {
    runTagNagger(robot, notifier, response);
  });

  // list decisions numbered list

  // remove decision by number

  // Cron job
};

// TODO: Per tag custom cron pattern (like in hubot-deploy-status)
