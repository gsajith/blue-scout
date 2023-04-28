import { useRef, useState } from 'react';
import ActionBox from './ActionBox';
import PrimaryButton from './PrimaryButton';
import FollowerFollows from './actions/FollowerFollows';

const AppBox = () => {
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  let renderedAction = <></>;

  switch (selectedAction) {
    case 0:
      renderedAction = <FollowerFollows />;
      break;
    default:
      break;
  }
  return (
    <>
      {selectedAction === null && (
        <div
          className="flex flex-row flex-wrap bg-[#1D1E35] max-w-3xl drop-shadow-2xl rounded-3xl p-6 ml-4 sm:ml-0 xs:ml-0 2xs:ml-0 sm:mt-4 xs:mt-4 2xs:mt-4 justify-center"
          style={{ flex: '1 1 300px' }}
        >
          <ActionBox
            onClick={(e) => {
              setSelectedAction(0);
            }}
          >
            Who your followers follow the most
          </ActionBox>
          <ActionBox
            onClick={(e) => {
              setSelectedAction(1);
            }}
          >
            Who the people you're following the most
          </ActionBox>
          <ActionBox>Who also follows the people you're following</ActionBox>

          <a
            ref={linkRef}
            href="https://forms.gle/o3NPxsR2HN3stjXQ8"
            target="_blank"
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

export default AppBox;
