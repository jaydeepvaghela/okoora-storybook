import { IGlobalData } from "../models";


export type LanguageType = IGlobalData['appLanguages'][any]

export type StepActionType = ['NEXT'|'PREV'][any];
