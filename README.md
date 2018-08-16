# hubot-tag-notifier

Timely notifier of tags gathered from flowdock

See [`src/tag-notifier.js`](src/tag-notifier.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-tag-notifier --save`

Then add **hubot-tag-notifier** to your `external-scripts.json`:

```json
["hubot-tag-notifier"]
```

## Sample Interaction

```
John> I claim this microservice for me #decision
John> Hubot list decisions
Hubot> Decisions made since 09.08.2018:
1) By @Shell in Shell
I claim this microservice for me #decision
```

## NPM Module

https://www.npmjs.com/package/hubot-tag-notifier
