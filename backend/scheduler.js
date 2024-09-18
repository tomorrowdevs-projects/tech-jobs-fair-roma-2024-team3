const schedule = require("node-schedule");
const { sendNotificationToUser } = require("./routes/subscribe");

function scheduleTask(date, repetition, taskName) {
    switch (repetition) {
        case "Daily":
            schedule.scheduleJob(date.getMinutes() + " " + date.getHours() + " " + "*/1 * *", function () {
                sendNotificationToUser(JSON.stringify({ title: taskName, body: taskName }));
            });
            break;
        case "Weekly":
            schedule.scheduleJob(date.getMinutes() + " " + date.getHours() + " " + "*/7 * *", function () {
                sendNotificationToUser(JSON.stringify({ title: taskName, body: taskName }));
            });
            break;
        case "Monthly":
            schedule.scheduleJob(date.getMinutes() + " " + date.getHours() + " " + "*/30 * *", function () {
                sendNotificationToUser(JSON.stringify({ title: taskName, body: taskName }));
            });
            break;
        case "None":
            schedule.scheduleJob(date, function () {
                sendNotificationToUser(JSON.stringify({ title: taskName, body: taskName }));
            });
            break;
        default:
            break;
    }
}

module.exports = scheduleTask;