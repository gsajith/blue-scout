import { MdPrivacyTip } from 'react-icons/md';

const SecurityInfo = () => {
  return (
    <div className="container max-w-xl mt-12 justify-center p-10 items-center rounded-3xl bg-[#5D5F81] border border-slate-700 text-slate-300">
      <div className="flex flex-row pb-2 border-b border-slate-300 dark:border-slate-600 mb-2">
        <span className="material-icons mr-1 text-fuchsia-300 text-xl">
          <MdPrivacyTip />
        </span>
        <b className="text-fuchsia-300">Is this secure?</b>
      </div>
      <b>Yes!</b> Your password is sent directly to Bluesky and never to our
      servers. However, you can now{' '}
      <a
        href="https://staging.bsky.app/settings/app-passwords"
        className="text-fuchsia-300"
        target="_blank"
      >
        generate App Passwords on the website
      </a>{' '}
      to use instead of your main password. <br />
      <br />
      This can also be done by going to <b>Settings {'->'} App Passwords</b>.
    </div>
  );
};

export default SecurityInfo;
