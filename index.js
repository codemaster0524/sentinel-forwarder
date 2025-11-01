import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const TOKEN = "⚠️여기에_디스코드_봇_토큰_입력";
const WORKER_URL = "https://sentinel-bot.YOURNAME.workers.dev"; // Cloudflare Worker 주소

const client = new Client({
  intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on("ready", () => {
  console.log(`✅ ${client.user.tag} 로그인 완료`);
});

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  try {
    await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        t: "MESSAGE_CREATE",
        d: {
          id: msg.id,
          guild_id: msg.guild.id,
          channel_id: msg.channel.id,
          user_id: msg.author.id,
          author: msg.author.username,
          content: msg.content
        }
      })
    });
    console.log(`[FORWARDED] ${msg.author.username}: ${msg.content}`);
  } catch (err) {
    console.error("포워딩 실패:", err.message);
  }
});

client.login(TOKEN);
