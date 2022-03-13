import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import { initGame } from '../../game/initGame'
export default function handler(req: Req , res: Res) {
  const game = initGame();
  res.send({ game });
}