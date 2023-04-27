import { useRef } from 'react';
import ActionBox from './ActionBox';
import PrimaryButton from './PrimaryButton';

const AppBox = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <div
      className="flex flex-row flex-wrap bg-[#1D1E35] max-w-3xl drop-shadow-2xl rounded-3xl p-6 ml-6 md:ml-0 sm:ml-0 xs:ml-0 2xs:ml-0 md:mt-6 sm:mt-6 xs:mt-6 2xs:mt-6 justify-center"
      style={{ flex: '1 1 300px' }}
    >
      <ActionBox>Followers who follow you</ActionBox>
      <ActionBox />
      <ActionBox />

      <a
        ref={linkRef}
        href="https://forms.gle/o3NPxsR2HN3stjXQ8"
        target="_blank"
        className="unselectable"
        tabIndex={-1}
      >
        <ActionBox
          className="opacity-40 hover:bg-[#262941]"
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
  );
};

export default AppBox;
