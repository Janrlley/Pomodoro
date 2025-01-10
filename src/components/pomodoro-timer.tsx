import { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';

import bellStart from '../sounds/bell-172780.mp3';
import bellFinish from '../sounds/servant-bell-ring-2-211683.mp3';
import { secondsToTime } from '../utils/seconds-to-time';


const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
    pomodoroTime: number;
    shortRestTime: number;
    LongRestTime: number;
    cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
    const [mainTime, setMainTime] = useState(props.pomodoroTime);
    const [timeCounting, setTimeCounting] = useState(false);
    const [working, setWorking] = useState(false);
    const [resting, setResting] = useState(false);
    const [cyclesQtdManager, setCyclesQtdManager] = useState( // armazenando qtd de ciclos do pomodoro em um array
        new Array(props.cycles - 1).fill(true) // fill da os valores do array como true
    );

    const [completedCycles, setCompletedCycles] = useState(0);
    const [fullWorkingTime, setFullWorkingTime] = useState(0);
    const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);
    
    useInterval(
        () => {
            setMainTime(mainTime - 1)
            if(working) setFullWorkingTime(fullWorkingTime + 1);
        }, 
        timeCounting ? 1000 : null
    );

    const configureWork = useCallback(() => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTime(props.pomodoroTime);
        audioStartWorking.play()
    }, [
        setTimeCounting, 
        setWorking, 
        setResting, 
        setMainTime, 
        props.pomodoroTime
    ]);

    const configureRest = useCallback((long: boolean) => {
        setTimeCounting(true);
        setWorking(false);
        setResting(true);

        if(long) {
            setMainTime(props.LongRestTime);
        } else {
            setMainTime(props.shortRestTime);
        }

        audioStopWorking.play();
    }, [
        setTimeCounting, 
        setWorking, 
        setResting, 
        setMainTime, 
        props.LongRestTime, 
        props.shortRestTime
    ]);

    useEffect(() => {
        if(working) document.body.classList.add('working');
        if(resting) document.body.classList.remove('working');

        if(mainTime > 0) return; // se o contador nao tiver terminado 

        if(working && cyclesQtdManager.length > 0) { // se ainda estiver trabalhando e o array ainda for maior que 0
            configureRest(false); // descanço curto
            cyclesQtdManager.pop(); // remove um item do array
        } else if (working && cyclesQtdManager.length <= 0) { // se estiver trabalhando e o ciclo acabou
            configureRest(true); // descanso longo
            setCyclesQtdManager(new Array(props.cycles - 1).fill(true)); // renicia o array para o tamanho inicial
            setCompletedCycles(completedCycles + 1); // adiciona 1 ciclo completado
        }

        if(working) setNumberOfPomodoros(numberOfPomodoros + 1)
        if(resting) configureWork();
    }, [
        working,
        resting, 
        mainTime, 
        cyclesQtdManager,
        numberOfPomodoros,
        completedCycles,
        configureRest, 
        setCyclesQtdManager, 
        configureWork,
        props.cycles
    ]);
    
    return (
        <div className="pomodoro">
            <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
            <Timer mainTime={mainTime} />
            <div className="controls">
                <Button text="Work" onClick={() => configureWork()}></Button>
                <Button text="Rest" onClick={() => configureRest(false)}></Button>
                <Button 
                    className={!working && !resting ? 'hidden' : ''}
                    text={timeCounting ? 'Pause' : 'Play'}
                    onClick={() => setTimeCounting(!timeCounting)}
                ></Button>
            </div>
            <div className="details"> 
                <p>Ciclos concluídos: {completedCycles}</p>
                <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
                <p>Pomodoros concluídos: {numberOfPomodoros}</p>
            </div>
            
        </div>
    )
}