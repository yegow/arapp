import React, { useState } from 'react';
import { IonContent, IonPage, IonList, useIonViewDidEnter, useIonViewWillLeave } from '@ionic/react';
import { useHistory } from 'react-router';

import './Listing.css';
import { getUsers } from "../http/users";
import useToastManager from '../lib/toast-manager';
import { useAppContext } from '../lib/context-lib';
import LoaderFallback from '../components/LoaderFallback';
import useMounted from '../lib/mount-lib';
import UserListingItem from '../components/UserListingItem';
import SearchBar from '../components/SearchBar';
import SearchHeader from '../components/SearchHeader';
import { USER } from '../http/constants';

const Listing: React.FC = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearching, setSearching] = useState(false);
  let [professionals, setProfessionals] = useState<any[] | null>(null);
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  const fetchProfessionals = async (opts?: any) => {
    try {
      const { data } = await getUsers(currentUser.token, opts);
      isMounted && setProfessionals(data);
    } catch (error) {
      onError(error.message);
    }
  };

  const onToggle = () => {
    if (showSearchBar) {
      setProfessionals(null);
      fetchProfessionals({});
    }
    setShowSearchBar(show => !show);
  }
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }

    setSearching(true);

    try {
      await fetchProfessionals({
        username: searchTerm,
      });
    } catch (error) {
      onError(error.message);
    } finally {
      setSearching(false);
    }
  };

  useIonViewDidEnter(() => {
    if (currentUser.accountType === USER.ACCOUNT_TYPES.LAW_ENFORCER) {
      return history.replace("/app");
    }

    fetchProfessionals({});
  });

  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <SearchHeader
        title="Counsellors/Facilities"
        {...{ showSearchBar, onToggle }}
      />
      <IonContent fullscreen>
        {showSearchBar && (
          <SearchBar isSearching={isSearching} onSearch={handleSearch} />
        )}
        {!professionals ? (
          <LoaderFallback />
        ) : (
            <IonList lines="full">
              {professionals.map((prof: any) => prof._id !== currentUser._id ? (
                <UserListingItem key={prof._id} user={prof} />
              ) : null)}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
};

export default Listing;