/* eslint-disable no-shadow */
import { NextApiRequest, NextApiResponse } from 'next';

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
export enum GameType {
  wordle, random
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
  type: GameType;
  seed: number;
  timestamp: number;
  id: string;
  version: number;
  _id?: string;
}
export type CloudGame = Game & { user_id: string; };
export type NoID<T> = Omit<T, 'id'|'user_id'>;
export type ProjectedGame = NoID<Game>;
export type SimpleDate = {
  year: number;
  month: number;
  day: number;
}
export type Version = {
  version: string;
}
export interface Req<B = Record<string, string|number>> extends NextApiRequest {
  body: Parameters<B>[0]
}

export interface Res<D> extends NextApiResponse {
  error: string
  message?: string;
  data: ReturnType<D>
}

export type User = {
  id: string;
  name: string;
  code: string;
}

export type Cookie = {
  name: string;
  code: string;
}
