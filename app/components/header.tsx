import { FaPaperPlane } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
type HeaderProps = {
  logout?: () => void;
};

const Header = ({ logout }: HeaderProps) => {
  return (
    <div className="flex flex-row items-center container max-w-3xl justify-between p-4 lg:mb-24 mt-4">
      <div className="text-2xl font-bold flex flex-row">
        <FaPaperPlane className="mr-2" />
        Sky Scout
      </div>
      {logout && (
        <button
          className="text-base border py-2 px-4 rounded-lg flex flex-row items-center ml-4 mr-0 sm:mr-3 text-slate-800 bg-white border-gray-300 dark:text-slate-50 dark:bg-slate-800 dark:border-slate-700"
          onClick={() => logout()}
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
