import { secondsToMinutes } from "../utils/seconds-to-Minutes";

interface Props {
    mainTime: number;
}

export function Timer(props: Props): JSX.Element {
    return (
        <div className="timer">{secondsToMinutes(props.mainTime)}</div>
    )
}