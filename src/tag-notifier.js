"use strict";

// Description
//   Timely notifier of tags gathered from flowdock
//
// Configuration:
//
// Commands:
//   list decisions
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Kaiku Health <dev@kaikuhealth.com>

const moment = require("moment");
const uuidv4 = require("uuid/v4");
const FormatedDate = require("./FormatedDate");
const CronJob = require("cron").CronJob;
const text = require("twitter-text");

class Notifier {
  constructor(robot) {
    this.robot = robot;
    if (this.robot.brain.data.decisions == null) {
      this.robot.brain.data.decisions = [];
    }
  }

  add(message) {
    let id = uuidv4();
    let text = message.text;
    let user = message.user;
    let room = message.room;
    let time = Date.now();
    this.robot.brain.data.decisions.push({ id, text, user, room, time });
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

function getNotificationsFromWeekAgo(notifications) {
  let dateWeekAgo = moment().subtract(7, "d");
  return notifications.filter(notification => {
    return moment(notification.time) > dateWeekAgo;
  });
}

function runTagNagger(robot, notifier, response) {
  let decisions = getNotificationsFromWeekAgo(
    notifier.robot.brain.data.decisions
  );
  let responseString = `Decisions made since ${FormatedDate.weekAgo()}:
${formatEntries(decisions)}`;
  if (response !== undefined) {
    response.reply(responseString);
  } else {
    robot.messageRoom("Shell", responseString);
  }
}

function containsNotifiableTag(message) {
  return text.extractHashtags(message).indexOf("decision") != -1;
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
    if (containsNotifiableTag(decisionMessage.message.text)) {
      notifier.add(decisionMessage.message);
    }
  });

  robot.respond(/list decisions/i, response => {
    runTagNagger(robot, notifier, response);
  });

  // remove decision by number

  // Cron job
};

// TODO: Per tag custom cron pattern (like in hubot-deploy-status)
