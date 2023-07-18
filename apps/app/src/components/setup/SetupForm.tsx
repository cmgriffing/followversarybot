import React, { useState, useEffect } from "react";

import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

import { CopyUrl } from "./CopyUrl";
import { FormInput, FormTextArea } from "./FormFields";

import { defaultMessageTemplate, CLIENT_ID } from "../../lib/core";

let BASE_URL = "http://localhost:3000/followversarybot";

if (window.location.host.indexOf("github.io") > -1) {
  BASE_URL = "https://cmgriffing.github.io/followversarybot";
}
const REDIRECT_URI = `${BASE_URL}/setup`;

const RESPONSE_TYPE = "token";
const SCOPE = "moderator:read:followers chat:read chat:edit";

export function SetupForm() {
  const rawFragment = window.location.hash;
  const [fragment, rawSearchParams] = rawFragment.split("&", 2);
  const accessToken = fragment.replace("#access_token=", "");

  const [channelName, setChannelName] = useState("");
  const [botName, setBotName] = useState("");
  const [messageTemplate, setMessageTemplate] = useState(
    defaultMessageTemplate
  );

  const queryParams = new URLSearchParams({
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    response_type: RESPONSE_TYPE,
    scope: SCOPE,
  });

  useEffect(() => {
    if (accessToken) {
      fetch(`https://api.twitch.tv/helix/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-ID": CLIENT_ID,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((userResponse: GetUserResponse) => {
          if (userResponse) {
            console.log({ userResponse });
            const userData = userResponse.data[0];
            setChannelName(userData.login);
            setBotName(userData.login);
          }
        });
    }
  }, [accessToken]);

  const browserSourceUrl = getBrowserSourceUrl(
    accessToken,
    botName,
    channelName,
    messageTemplate
  );

  return (
    <Card className="max-w-[600px] mx-auto my-8">
      <CardHeader>
        <CardTitle>Setup</CardTitle>
        <CardDescription>
          You need to login and configure your bot before you can paste the URL
          into OBS as a BrowserSource.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          {!accessToken && (
            <>
              <a
                href={`https://id.twitch.tv/oauth2/authorize?${queryParams}`}
                className={buttonVariants({ variant: "default" })}
              >
                Log In
              </a>
            </>
          )}
          {!!accessToken && (
            <div className="flex flex-row gap-4">
              <Button variant={"outline"} disabled>
                Logged In
              </Button>

              <a
                href={`https://id.twitch.tv/oauth2/authorize?${queryParams}`}
                className={buttonVariants({ variant: "outline" })}
              >
                Refresh Token
              </a>
            </div>
          )}
        </div>
        {!!accessToken && (
          <div className="flex flex-col gap-4 items-center mt-4">
            <FormInput
              label="Bot Name"
              value={botName}
              id="bot-name"
              setter={setBotName}
              tooltipText="Bot name is derived from the access token."
              disabled
            />

            <FormInput
              label="Channel Name"
              value={channelName}
              id="channel-name"
              setter={setChannelName}
              tooltipText="The channel you would like to listen to. The bot must have admin permissions for the channel."
            />

            <FormTextArea
              label="Message Template"
              value={messageTemplate}
              id="message-template"
              setter={setMessageTemplate}
              tooltipText="The format for the message you want the bot to say to viewers. You can use values from the legend to format the message properly."
            />

            <CopyUrl browserSourceUrl={browserSourceUrl} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getBrowserSourceUrl(
  accessToken: string,
  botName: string,
  channelName: string,
  messageTemplate: string
) {
  if (!accessToken || !botName || !channelName || !messageTemplate) {
    return "";
  }

  const searchParams = new URLSearchParams({
    access_token: accessToken,
    bot_name: botName,
    channel_name: channelName,
    message_template: messageTemplate,
  });

  return `${BASE_URL}/app?${searchParams}`;
}

export interface GetUserResponse {
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
    created_at: Date;
  }[];
}
