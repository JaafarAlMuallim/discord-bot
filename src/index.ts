import { Course, Data } from "./dataModel";
import getData from "./getExams";
import { Client, Colors, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import {
  convertTimeTo24HourFormat,
  formatString,
  sortByDateAndTime,
} from "./utils";
import getCourses from "./getCourses";
dotenv.config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.on("ready", (client: Client) => {});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content === "!help") {
    message.reply(
      "To use this bot, type !exam followed by the course name.\nFor example, !exam MATH101 IAS101... and list all the courses you want to check.\nmake sure they are separated by spaces only\nUse !courses followed by the department code and course code. For example, !courses ICS ICS202 to get all section informations and status\n"
    );
    return;
  }
  if (message.content.startsWith("!courses")) {
    const args = message.content.split(" ");
    args.shift();
    if (args.length !== 2) {
      message.reply(
        "Please provide a valid department code and valid course code"
      );
      return;
    }
    await message.channel.sendTyping();
    const courses = await getCourses(args[0] === "SWE" ? "ICS" : args[0]);
    const filteredCourses: Course[] | undefined = courses.courses.filter(
      (course) => course.courseSec.includes(formatString(args[1]))
    );
    if (filteredCourses) {
      const toSendMessage: string[] = [];
      for (const course of filteredCourses) {
        toSendMessage.push(
          `${course.instructor} ${course.location} ${course.day} ${course.time}\n${course.status} ${course.crn}`
        );
      }
      message.reply(toSendMessage.join("\n\n"));
      return;
    } else {
      message.reply("Course not found");
      return;
    }
  }
  if (message.content === "!clear") {
    const channelMessages = await message.channel.messages.fetch();
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
    } else {
      await message.channel.sendTyping();
      const toSendMessage: string[] = [];
      const courseInfo: Data[] = [];
      try {
        const courses = await getData();
        for (const arg of args) {
          const course = formatString(arg);
          const exam = courses.exams.find(
            (exam) => formatString(exam.courseId) === course
          );
          if (exam) {
            courseInfo.push(exam);
          }
        }
        const sortedCoures = sortByDateAndTime(courseInfo);
        let text = "";
        for (const course of sortedCoures) {
          const { courseId, date, day, location, time } = course;
          toSendMessage.push(
            `- Course ID: ${formatString(
              courseId
            )}\nDate: ${date}\nDay: ${day}\n Time: ${convertTimeTo24HourFormat(
              time
            )}\nLocation: ${location}`
          );
          text += `${formatString(courseId)} ${convertTimeTo24HourFormat(
            time
          )} ${date} ${day} ${location}\n`;
        }
        message.reply({
          content: `${toSendMessage.join(
            "\n----------------------------------\n"
          )}`,
          files: [
            {
              attachment: Buffer.from(text),
              name: "exams.txt",
            },
          ],
        });
      } catch (error) {
        console.log(error);
        message.reply("Something went wrong");
        return;
      }
    }
  }
});

client.login(`${process.env.DISCORD_TOKEN}`);
