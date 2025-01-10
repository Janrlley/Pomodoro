import { zeroLeft } from "./zero-left";

export function secondsToMinutes(seconds: number): string {   //padStart coloca 0 a esquerda
    const min = zeroLeft((seconds / 60) % 60); //minutos
    const sec = zeroLeft((seconds % 60) % 60); //segundos
    return `${min}:${sec}`;
}