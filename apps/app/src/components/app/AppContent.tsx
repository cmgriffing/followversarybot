import React, { useEffect } from "react";
import { startBot } from "../../lib/core";

const DEBUG = true;

export function AppContent() {
  const searchParams = new URLSearchParams(window.location.search);
  const accessToken = searchParams.get("access_token") || "";
  const channelName = searchParams.get("channel_name") || "";
  const botName = searchParams.get("bot_name") || "";
  const messageTemplate = decodeURIComponent(
    searchParams.get("message_template") || ""
  );

  useEffect(() => {
    if (channelName && accessToken && messageTemplate) {
      const stopBot = startBot(
        channelName,
        accessToken,
        messageTemplate,
        botName || channelName,
        DEBUG
      );

      return function () {
        stopBot();
      };
    }
  }, [channelName, accessToken, messageTemplate, botName]);

  return <div className="bg-transparent h-screen w-screen"></div>;
}
