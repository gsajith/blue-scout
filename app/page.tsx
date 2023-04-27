"use client"
import { LoginResponse } from "@/helpers/bsky";
import { useLocalStorageState } from "@/helpers/hooks";
import { BskyAgent } from "@atproto/api";
import { useEffect, useRef } from "react";
import * as jwt from "jsonwebtoken";
import LoginPage from "./login/page";
import Header from "./components/header";

export default function Home() {
  const agent = useRef < BskyAgent > (new BskyAgent({
    service: "https://bsky.social",
  })).current;

  // Auth stuff
  const [loginResponseData, setLoginResponseData] =
    useLocalStorageState < LoginResponse | null > (
      "@loginResponseData",
      null
    );
  const identifier = loginResponseData?.handle;
  const accessJwt = !!loginResponseData?.accessJwt
    ? (jwt.decode(loginResponseData.accessJwt) as {
      exp: number;
      iat: number;
      scope: string;
      sub: string;
    })
    : null;
  const loginExpiration = accessJwt?.exp;
  const timeUntilLoginExpire = loginExpiration
    ? loginExpiration * 1000 - Date.now()
    : null;

  useEffect(() => {
    if (timeUntilLoginExpire) {
      const timeout = setTimeout(() => {
        setLoginResponseData(null);
      }, Math.max(timeUntilLoginExpire, 0));

      return () => clearTimeout(timeout);
    }
  }, [timeUntilLoginExpire]);
  useEffect(() => {
    if (loginResponseData && !agent.session) {
      agent.resumeSession(loginResponseData);
    }
  }, [loginResponseData]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header logout={identifier ? () => setLoginResponseData(null) : undefined }/>
      {identifier ?
        <div>You're in</div> :
        <LoginPage
            setLoginResponseData={setLoginResponseData}
            agent={agent}/>}
    </main>
  )
}
