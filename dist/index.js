"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getExams_1 = __importDefault(require("./getExams"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
const getCourses_1 = __importDefault(require("./getCourses"));
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
    ],
});
client.on("ready", (client) => { });
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if (message.content === "!help") {
        message.reply("To use this bot, type !exam followed by the course name.\nFor example, !exam MATH101 IAS101... and list all the courses you want to check.\nmake sure they are separated by spaces only\nUse !courses followed by the department code and course code. For example, !courses ICS ICS202 to get all section informations and status\n");
        return;
    }
    if (message.content.startsWith("!courses")) {
        const args = message.content.split(" ");
        args.shift();
        if (args.length !== 2) {
            message.reply("Please provide a valid department code and valid course code");
            return;
        }
        yield message.channel.sendTyping();
        const courses = yield (0, getCourses_1.default)(args[0] === "SWE" ? "ICS" : args[0]);
        const filteredCourses = courses.courses.filter((course) => course.courseSec.includes((0, utils_1.formatString)(args[1])));
        if (filteredCourses) {
            const toSendMessage = [];
            for (const course of filteredCourses) {
                toSendMessage.push(`${course.instructor} ${course.location} ${course.day} ${course.time}\n${course.status} ${course.crn}`);
            }
            message.reply(toSendMessage.join("\n\n"));
            return;
        }
        else {
            message.reply("Course not found");
            return;
        }
    }
    if (message.content === "!clear") {
        const channelMessages = yield message.channel.messages.fetch();
        for (const message of channelMessages.values()) {
            message.delete();
        }
        return;
    }
    if (message.content.startsWith("!exam")) {
        const args = message.content.split(" ");
        args.shift();
        if (args.length === 0) {
            message.reply("Please provide a valid course name");
            return;
        }
        else {
            yield message.channel.sendTyping();
            const toSendMessage = [];
            const courseInfo = [];
            try {
                const courses = yield (0, getExams_1.default)();
                for (const arg of args) {
                    const course = (0, utils_1.formatString)(arg);
                    const exam = courses.exams.find((exam) => (0, utils_1.formatString)(exam.courseId) === course);
                    if (exam) {
                        courseInfo.push(exam);
                    }
                }
                const sortedCoures = (0, utils_1.sortByDateAndTime)(courseInfo);
                let text = "";
                for (const course of sortedCoures) {
                    const { courseId, date, day, location, time } = course;
                    toSendMessage.push(`- Course ID: ${(0, utils_1.formatString)(courseId)}\nDate: ${date}\nDay: ${day}\n Time: ${(0, utils_1.convertTimeTo24HourFormat)(time)}\nLocation: ${location}`);
                    text += `${(0, utils_1.formatString)(courseId)} ${(0, utils_1.convertTimeTo24HourFormat)(time)} ${date} ${day} ${location}\n`;
                }
                message.reply({
                    content: `${toSendMessage.join("\n----------------------------------\n")}`,
                    files: [
                        {
                            attachment: Buffer.from(text),
                            name: "exams.txt",
                        },
                    ],
                });
            }
            catch (error) {
                console.log(error);
                message.reply("Something went wrong");
                return;
            }
        }
    }
}));
client.login(`${process.env.DISCORD_TOKEN}`);
