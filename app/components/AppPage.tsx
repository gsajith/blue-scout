import { useEffect, useRef, useState } from 'react';
import ActionBox from './ActionBox';
import PrimaryButton from './PrimaryButton';
import FollowerFollows from './actions/FollowerFollows';
import DIDLookup from './actions/DIDLookup';
import { useAuth } from '../auth/AuthProvider';
import Image from 'next/image';

const NEEDS_AUTH = [
  true, // Handle lookup
  true, // Followers followed
  true, // Followed's followers
  true // Followed's followed
];

const AppPage = () => {
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const { loginResponseData } = useAuth();
  const linkRef = useRef<HTMLAnchorElement>(null);

  let renderedAction = <></>;

  switch (selectedAction) {
    case 0:
      renderedAction = <FollowerFollows />;
      break;
    case 1:
      renderedAction = <DIDLookup />;
    default:
      break;
  }

  useEffect(() => {
    if (!loginResponseData) {
      setSelectedAction(null);
    }
  }, [loginResponseData]);
  return (
    <>
      {selectedAction === null && (
        <div
          className="flex flex-row flex-wrap bg-[#1D1E35] max-w-3xl drop-shadow-2xl rounded-3xl p-6 ml-4 sm:ml-0 xs:ml-0 2xs:ml-0 sm:mt-4 xs:mt-4 2xs:mt-4 justify-center"
          style={{ flex: '1 1 300px' }}
        >
          <ActionBox
            authRequired={NEEDS_AUTH[0]}
            onClick={(e) => {
              setSelectedAction(0);
            }}
          >
            <Image
              src="/most_like_you.svg"
              width={200}
              height={200}
              alt="DID lookup"
              className="w-6/12 mb-4 sm:w-36 xs:w-36 2xs:w-36"
            />
            <span className="font-black mb-1">Most like you</span>
            <span className="font-light">
              List of people that are most followed by your audience.
            </span>
          </ActionBox>
          <ActionBox
            authRequired={NEEDS_AUTH[1]}
            onClick={(e) => {
              setSelectedAction(1);
            }}
          >
            <Image
              src="/id_lookup.svg"
              width={200}
              height={200}
              alt="DID lookup"
              className="w-6/12 mb-4 sm:w-36 xs:w-36 2xs:w-36"
            />
            <span className="font-black mb-1">Look up profile</span>
            <span className="font-light">
              Look up a profile by handle or identifier.
            </span>
          </ActionBox>
          <ActionBox
            authRequired={NEEDS_AUTH[2]}
            onClick={(e) => {
              setSelectedAction(2);
            }}
          >
            <Image
              src="/your_influencers.svg"
              width={200}
              height={200}
              alt="DID lookup"
              className="w-9/12 mb-4 sm:w-36 xs:w-48 2xs:w-48"
            />
            <span className="font-black mb-1">Your influences</span>
            <span className="font-light">
              People that are most followed by the people you're following.
            </span>
          </ActionBox>
          <ActionBox
            authRequired={NEEDS_AUTH[3]}
            onClick={(e) => {
              setSelectedAction(3);
            }}
          >
            <Image
              src="/taste_buds.svg"
              width={200}
              height={200}
              alt="DID lookup"
              className="w-9/12 mb-4 sm:w-36 xs:w-48 2xs:w-48"
            />
            <span className="font-black mb-1">Taste buds</span>
            <span className="font-light">
              List of people who follow the same people that you follow.
            </span>
          </ActionBox>

          <a
            ref={linkRef}
            href="https://forms.gle/o3NPxsR2HN3stjXQ8"
            target="_blank"
            tabIndex={-1}
          >
            <ActionBox
              authRequired={false}
              className="hover:bg-[#262941]"
              onClick={(e) => {
                e.preventDefault();
                linkRef.current!.click();
              }}
            >
              Have something else you want to see?
              <PrimaryButton
                type="button"
                className="mt-4"
                onClick={(e) => {
                  e.preventDefault();
                  linkRef.current!.click();
                }}
              >
                Make a suggestion
              </PrimaryButton>
            </ActionBox>
          </a>
        </div>
      )}
      {selectedAction !== null && (
        <div
          className="flex flex-col bg-[#1D1E35] max-w-3xl drop-shadow-2xl rounded-3xl p-6 ml-4"
          style={{ flex: '1 1 300px' }}
        >
          <div>
            <PrimaryButton
              type="button"
              onClick={() => setSelectedAction(null)}
            >
              Back
            </PrimaryButton>
            {renderedAction}
          </div>
        </div>
      )}
    </>
  );
};

export default AppPage;
