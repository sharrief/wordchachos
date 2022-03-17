import { Remove, Whatshot } from '@material-ui/icons';

export function GameStreak(props: {
  streak: number;
}) {
  const { streak } = props;
  return <div className='d-flex align-items-center'>{streak > 0
    ? <>{streak}<Whatshot /></>
    : <Remove />
  }</div>;
}
