import { Labels } from 'messages/labels';
import React, { useState } from 'react';
import {
  Accordion, Button, Card, useAccordionButton,
} from 'react-bootstrap';
import { useUser } from './data/useUser';
import { GameHistory } from './GameHistory';
import { GameStats } from './GameStats';
import { GuessChart } from './GuessChart';
import { Login } from './login';

const ContextAwareToggle: React.FunctionComponent<{ eventKey: string; callback?: (eventKey: string) => void }> = ({ children, eventKey, callback }) => {
  // const { activeEventKey } = useContext(AccordionContext);
  // const isCurrentEventKey = activeEventKey?.includes(eventKey);
  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  return (<div className='d-flex align-items-center'>
    <Button
      className='w-100 p-0 border-0'
      variant={'outline-primary'}
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  </div>);
};

const Item: React.FunctionComponent<{ name: string; title: string; onClick: (name: string) => void }> = (props) => <Card className='border-0'>
  <Card.Header className='bg-primary' style={{ borderTop: '1px solid rgba(255, 255, 255, .2)', borderBottom: '0px' }}>
    <ContextAwareToggle eventKey={props.name} callback={props.onClick}>
      <h5 className='m-0'>{props.title}</h5>
    </ContextAwareToggle>
  </Card.Header>
  <Accordion.Collapse eventKey={props.name}>
    <Card.Body className='border-0 p-0 pb-3'>
      {props.children}
    </Card.Body>
  </Accordion.Collapse>
</Card>;

export function Stats() {
  const { data: user } = useUser();
  const [activeKeys, setActiveKeys] = useState(user ? ['stats', 'chart', 'history'] : ['login', 'stats', 'chart', 'history']);
  const toggleExpansion = (name: string) => {
    if (activeKeys.includes(name)) {
      setActiveKeys(activeKeys.filter((k) => k !== name));
    } else {
      setActiveKeys([...activeKeys, name]);
    }
  };
  return <Accordion activeKey={activeKeys} alwaysOpen flush>
    <Item name='login' title={user ? Labels.SignedInAs(user.name) : Labels.SignInTitle} onClick={toggleExpansion}>
      <Login />
    </Item>
    <Item name='stats' title={Labels.StatisticsSubtitle} onClick={toggleExpansion}>
      <GameStats />
    </Item>
    <Item name='chart' title={Labels.GuessDistribution} onClick={toggleExpansion}>
      <GuessChart />
    </Item>
    <Item name='history' title={Labels.GameHistory} onClick={toggleExpansion}>
      <GameHistory />
    </Item>
  </Accordion>;
}
