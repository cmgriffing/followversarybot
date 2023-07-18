import tmi from "tmi.js";
import Mustache from "mustache";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
dayjs.extend(dayOfYear);

export const CLIENT_ID = "bd18p9eycculb64acrdjjdp72bt4xr";

export const defaultMessageTemplate = `🎉 Hey @{{viewerName}}, it's your Followversary! You followed on this day {{yearCount}} {{yearLabel}} ago.`;

const cache: DataCache = {
  currentDayOfYear: -1,
  followers: {},
};

export function startBot(
  channel: string,
  token: string,
  messageTemplate = defaultMessageTemplate,
  botName?: string,
  forceDebug?: boolean
) {
  const client = new tmi.Client({
    // options: { debug: debug || false },
    identity: {
      username: botName || channel,
      password: token,
    },
    channels: [channel],
  });

  // IIFE
  (async function init() {
    await client.connect().catch(() => {
      console.error("Unable to connect to Twitch via tmi.js");
    });

    const broadcasterFetchResult = await fetch(
      `https://api.twitch.tv/helix/users/?login=${channel}`,
      {
        headers: {
          Authorization: `Bearer ${token.replace("oauth:", "")}`,
          "Client-ID": CLIENT_ID,
        },
      }
    );

    if (!broadcasterFetchResult.ok) {
      console.error("Broadcaster data could not be fetched");
      return;
    }

    const broadcasterData: BroadcasterData =
      await broadcasterFetchResult.json();

    const broadcaster_id = broadcasterData.data[0].id;

    client.on("message", async (channel, tags, message, self) => {
      if (self) {
        return;
      }

      const debug = forceDebug && message === "!debug";

      if (channel === tags.username && !debug) {
        return;
      }

      const currentDayOfYear = dayjs().dayOfYear();

      if (currentDayOfYear !== cache.currentDayOfYear) {
        cache.currentDayOfYear = currentDayOfYear;
        cache.followers = {};
      }

      if (cache.followers[tags.username || tags["user-id"] || ""] && !debug) {
        return;
      }

      const fetchUrl = `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcaster_id}&user_id=${tags["user-id"]}&scope=moderator:read:followers`;

      console.log({ fetchUrl });
      const followerFetchResult = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${token.replace("oauth:", "")}`,
          "Client-ID": CLIENT_ID,
        },
      });

      if (!followerFetchResult.ok) {
        console.error(
          "Fetch result failed. Possibly bad token",
          followerFetchResult.status,
          await followerFetchResult.json()
        );
        return;
      }

      const fetchedData: FollowerData = await followerFetchResult.json();

      cache.followers[tags.username || tags["user-id"] || ""] = true;

      const followedAt = fetchedData.data[0]?.followed_at;
      if (!followedAt && !debug) {
        console.log("User is not following");
        return;
      }

      const followedDate = dayjs(followedAt);
      if (currentDayOfYear !== followedDate.dayOfYear() && !debug) {
        return;
      }

      const yearCount = Math.abs(followedDate.diff(dayjs(), "year"));

      if (yearCount < 1 && !debug) {
        return;
      }

      const yearLabel = yearCount === 1 ? "year" : "years";

      const templateData = {
        viewerName: tags.username,
        yearCount,
        yearLabel,
      };

      const botMessage = Mustache.render(messageTemplate, templateData);

      client.say(channel, botMessage);
    });
  })();

  return function stopBot() {
    client.disconnect();
  };
}

interface FollowerData {
  total: number;
  data: {
    user_id: string;
    user_name: string;
    user_login: string;
    followed_at: string;
  }[];
  pagination: {
    cursor: string;
  };
}

interface DataCache {
  currentDayOfYear: number;
  followers: Record<string, boolean>;
}

interface BroadcasterData {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: string;
  }[];
}
