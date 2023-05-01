import { useAuth } from '@/app/auth/AuthProvider';
import { getProfile } from '@/helpers/bsky';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import TextInput from '../TextInput';
import UserDetails from '../UserDetails';

const DIDLookup = () => {
  const [handle, setHandle] = useState<string>('');
  const [did, setDID] = useState<string>('');
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null);

  const { agent } = useAuth();

  const fetchAndUpdateHandle = useMemo(
    () =>
      debounce(async () => {
        if (agent && handle.length > 0 && handle !== 'not found') {
          try {
            const profile = await getProfile(agent, handle);
            setDID(profile!.did);
            setProfile(profile);
            console.log(profile);
          } catch (e) {
            setDID('not found');
            setProfile(null);
          }
        } else if (handle.length === 0) {
          setDID('');
          setProfile(null);
        }
      }, 250),
    [handle]
  );

  const fetchAndUpdateDID = useMemo(
    () =>
      debounce(async () => {
        if (agent && did.length > 0 && did !== 'not found') {
          try {
            const profile = await getProfile(agent, did);
            setHandle(profile!.handle);
            setProfile(profile);
          } catch (e) {
            setHandle('not found');
            setProfile(null);
          }
        } else if (did.length === 0) {
          setHandle('');
          setProfile(null);
        }
      }, 250),
    [did]
  );

  useEffect(() => {
    fetchAndUpdateHandle();

    return () => fetchAndUpdateHandle.cancel();
  }, [handle]);

  useEffect(() => {
    fetchAndUpdateDID();

    return () => fetchAndUpdateDID.cancel();
  }, [did]);

  return (
    <div className="pt-4 w-full flex flex-col items-center">
      <div className="flex flex-col items-start w-full max-w-sm">
        <label htmlFor="handle" className="text-slate-400 mb-1">
          Handle
        </label>
        <TextInput
          id="handle"
          className="w-full"
          type="text"
          placeholder="Type a Bluesky handle here"
          value={handle}
          onChange={(event) => {
            setHandle(event.target.value);
          }}
        />
      </div>

      <div className="flex flex-col items-start w-full max-w-sm">
        <label htmlFor="did" className="text-slate-400 mb-1">
          DID
        </label>
        <TextInput
          id="did"
          className="w-full"
          maxLength={32}
          type="text"
          placeholder="Or type a DID here"
          value={did}
          onChange={(event) => {
            setDID(event.target.value);
          }}
        />
      </div>

      {profile && (
        <div className="mt-6 bg-[#141428] rounded-xl p-6 w-full max-w-xl">
          <UserDetails profile={profile} showLogin={false} fullWidth={true} />
        </div>
      )}
    </div>
  );
};

export default DIDLookup;
