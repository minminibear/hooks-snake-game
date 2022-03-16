import React from 'react';
import { GameStatus } from '../constants';

const Button = ({ status, onStop, onStart, onRestart }) => {
    return(
        <div className="button">
            {status === GameStatus.gameover && <button className="btn btn-gameover" onClick={onRestart}>gameover</button> }
            {status === GameStatus.init && <button className="btn btn-init" onClick={onStart}>start</button> }
            {status === GameStatus.suspended && <button className="btn btn-suspended" onClick={onStart}>start</button> }
            {status === GameStatus.playing && <button className="btn btn-playing" onClick={onStop}>stop</button> }
            {/*  [条件式] && [任意の処理]　前の条件式がtrueにときだけ処理が行われる */}
            
        </div>
    );
};
// 条件(三項)演算子　条件？真値：偽値(if分の代替)
// 状態がゲームオーバーになったら、onRestartして表示をgameoverに。そうでなければstartに。

export default Button;