import { startBot } from "../src";
import "dotenv/config";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (BOT_TOKEN) {
  startBot("styrofoam_pad", BOT_TOKEN, undefined, "styrofoam_pad", true);
} else {
  console.error("No Bot token");
}
