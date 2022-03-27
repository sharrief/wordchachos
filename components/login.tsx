import { Labels } from 'messages/labels';
import React, { useEffect, useState } from 'react';
import {
  Alert, Button, ButtonGroup, Container, Form, InputGroup, Row,
} from 'react-bootstrap';
import Cookies from 'js-cookie';
import { api } from 'api/_api';
import { saveManyGamesToCache } from 'localStorage/saveManyGamesToCache';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Game, GameState, GameType } from 'types';
import { getLocalGames } from 'localStorage/getLocalGames';
import { useUser } from './data/useUser';
import { useGames } from './data/useGames';

const gameIsWordle = (g: Game) => g.type === GameType.wordle;
const gameIsRandom = (g: Game) => g.type === GameType.random;
const gameNotInList = (games: Game[]) => (g: Game) => !games.map(({ _id }) => _id).includes(g._id);

export function Login() {
  const { data: user, mutate: refreshUser } = useUser();
  const { data: games } = useGames(user);
  const localPastGames = games?.filter((g) => g.state !== GameState.active) || [];
  const localActiveGames = games?.filter((g) => g.state === GameState.active) || [];
  const [localActiveWordle] = localActiveGames?.filter(gameIsWordle).sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)) || [];
  const [localActiveRandom] = localActiveGames?.filter(gameIsRandom).sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)) || [];
  const allLocalGames = [...localPastGames, localActiveWordle, localActiveRandom];
  const localOnlyGames = getLocalGames().filter(gameNotInList(games || []));
  const [hasAccount, setHasAccount] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [uploadWordleCount, setUploadWordleCount] = useState(0);
  const [uploadRandomCount, setUploadRandomCount] = useState(0);
  const [gamesUploaded, setGamesUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [alert, setAlert] = useState('');

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Cookies.set('name', name, { expires: 365 });
    Cookies.set('code', pass, { expires: 365 });
    const { data: u, error } = await api.fetchUser();
    if (error) setAlert(error);
    if (u) {
      Cookies.set('code', u.code, { expires: 365 });
      await refreshUser(u);
    }
  };
  useEffect(() => {
    if (user?.name && user?.code) {
      setName(user?.name);
      setPass(user?.code);
      setHasAccount(true);
      setUploadWordleCount((localOnlyGames.filter(gameIsWordle) || []).length);
      setUploadRandomCount((localOnlyGames.filter(gameIsRandom) || []).length);
    }
  }, [user, localOnlyGames]);
  const onSyncClick = async () => {
    if (!user) return;
    if (gamesUploaded) {
      return;
    }
    setUploading(true);
    if (localOnlyGames.length) {
      const { data, error } = await api.postUploadGames({ games: localOnlyGames });
      if (error) {
        setAlert(error);
      }
      if (data?.length) {
        saveManyGamesToCache(data);
        setGamesUploaded(true);
      }
    }
    setUploading(false);
  };
  const clearCookies = () => {
    Cookies.remove('name');
    Cookies.remove('code');
    refreshUser();
  };
  const uploadingLabel = (() => {
    if (uploadWordleCount > 0) {
      if (!gamesUploaded) {
        if (!uploading) return Labels.ToUploadGameCount(uploadWordleCount, uploadRandomCount, allLocalGames.length - uploadWordleCount);
        return Labels.UploadGameCount(uploadWordleCount);
      }
      return Labels.UploadedGameCount(uploadWordleCount);
    }
    return '';
  })();
  return (
    <Container>
      <Row>
        <em>{Labels.SignInFor}</em>
        <Form className='my-4' onSubmit={(e) => onSignIn(e)}>
          <Form.Switch
            id='have-account'
            label={Labels.IHaveAnAcconut}
            checked={hasAccount}
            disabled={!!user}
            onChange={(e) => setHasAccount(e.target.checked)}
          />
          <Form.Group className='mb-3'>
            <Form.Label>{Labels.Name}</Form.Label>
            <Form.Control type='text' placeholder={Labels.NamePlaceholder}
              value={name}
              readOnly={!!user}
              onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>{Labels.Passphrase}</Form.Label>
            <InputGroup><Form.Control type='text' placeholder={hasAccount ? Labels.PassphrasePlaceholder : Labels.NewPassphrasePlaceholder}
              value={pass}
              readOnly={!hasAccount || !!user}
              onChange={(e) => setPass(e.target.value)}
            />
              {pass && <CopyToClipboard
                onCopy={() => setCopiedPass(true)}
                text={pass}
              ><Button
                variant={copiedPass ? 'outline-success' : 'outline-secondary'}
              >{copiedPass ? Labels.Copied : Labels.Copy}</Button></CopyToClipboard>}
            </InputGroup>
          </Form.Group>
          <ButtonGroup>
            {!user && <Button
              variant={'info'}
              disabled={!(name)}
              type='submit'
            >
              {Labels.DoSignIn}
            </Button>}
            {(user && uploadWordleCount > 0) && <>
              <Button
                variant={gamesUploaded ? 'success' : 'warning'}
                disabled={!user || uploading}
                onClick={onSyncClick}
              >
                {gamesUploaded ? Labels.UploadDone : Labels.UploadYourGames}
              </Button>
            </>}
            {user && <Button variant='secondary' onClick={clearCookies}>{Labels.SignOut}</Button>}
          </ButtonGroup>
          <p className='m-0'>{uploadingLabel}</p>
        </Form>
        {alert && <Alert variant='danger' dismissible onClose={() => setAlert('')}>{alert}</Alert>}
      </Row>
    </Container>
  );
}
