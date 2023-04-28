import { useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';

type ProfileListItemProps = {
  did: string;
  count: number;
};
const ProfileListItem = ({ did, count }: ProfileListItemProps) => {
  const { agent } = useAuth();

  useEffect(() => {
    console.log('loaded in', did);

    return () => {
      console.log('unloaded', did);
    };
  }, []);

  return (
    <div className="bg-[#262941] p-4 my-4 mr-6 h-24 rounded-lg hover:bg-[#333654] focus:border-2 cursor-pointer border-slate-600 border">
      {did}
    </div>
  );
};

export default ProfileListItem;
