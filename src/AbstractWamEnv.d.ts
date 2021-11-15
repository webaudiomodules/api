import { WamEnv } from './types';

declare const getWamEnv: (apiVersion: string) => typeof WamEnv;

export default getWamEnv;
