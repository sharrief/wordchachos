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
  WotD, Random, Wordle,
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
}
export type SimpleDate = {
  year: number;
  month: number;
  day: number;
}
export type Version = {
  version: string;
}
export interface Req<B> extends NextApiRequest {
  body: Parameters<B>[0]
}

export interface Res<D> extends NextApiResponse {
  error: string
  data: ReturnType<D>
}

export type User = {
  name: string;
  code: string;
  fancy?: string;
}
