'use client';
import { LoginResponse } from '@/helpers/bsky';
import { useLocalStorageState } from '@/helpers/hooks';
import { BskyAgent } from '@atproto/api';
import { useEffect, useRef, useState } from 'react';
import * as jwt from 'jsonwebtoken';
import LoginPage from './login/page';
import Header from './components/Header';

export default function Home() {
  const agent = useRef<BskyAgent>(
    new BskyAgent({
      service: 'https://bsky.social'
    })
  ).current;

  // ****************************** AUTH ******************************
  const [authLoading, setAuthLoading] = useState(true);
  const [loginResponseData, setLoginResponseData] =
    useLocalStorageState<LoginResponse | null>('@loginResponseData', null);

  const identifier = loginResponseData?.handle;
  const accessJwt = !!loginResponseData?.accessJwt
    ? (jwt.decode(loginResponseData.accessJwt) as jwt.JwtPayload)
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
    setAuthLoading(false);
    if (loginResponseData && !agent.session) {
      agent.resumeSession(loginResponseData);
    }
  }, [loginResponseData]);
  // ****************************** END AUTH ******************************

  return (
    <main className="flex flex-col items-center h-screen">
      <Header
        logout={
          identifier
            ? () => {
                setLoginResponseData(null);
                console.log('click');
              }
            : undefined
        }
      />
      {authLoading ? (
        <div className="flex flex-row items-center justify-center">
          <div className="lds-dual-ring mr-2" />
          Loading...
        </div>
      ) : identifier ? (
        <div>You're in</div>
      ) : (
        <LoginPage setLoginResponseData={setLoginResponseData} agent={agent} />
      )}
    </main>
  );
}
