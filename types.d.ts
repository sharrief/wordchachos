import { NextApiRequest, NextApiResponse } from "next";

export enum KeyState {
  Unused, Match, Position, Wrong
}
export type Letter = {
  letter: string;
}
export type Square = Letter & {
  state: KeyState;
}
export type Guess = {
  squares: Square[];
  checked: boolean;
};
export type Board = Guess[];
export enum GameState {
  active, loss, win,
}
export type Game = {
  board: Board;
  guessIndex: number;
  squareIndex: number;
  guessesAllowed: number;
  guessLength: number;
  answer: string;
  guessesChecked: boolean;
  state: GameState;
}

export interface Req<B> extends NextApiRequest {
  body: Parameters<B>[0]
}

export interface Res<D> extends NextApiResponse {
  error: string
  data: ReturnType<D>
}