import React from 'react';

const Button = ({ status, onStop, onStart, onRestart }) => {
    return(
        <div className="button">
            {/* {
                status === "gameover" ?
                <button onClick={onRestart}>gameover</button>
                :
                <button onClick={onStart}>start</button>
            }  */}
            { status === "gameover" && <button onClick={onRestart}>gameover</button> }
            { status === "init" && <button onClick={onStart}>start</button> }
            { status === "suspended" && <button onClick={onStart}>start</button> }
            { status === "playing" && <button onClick={onStop}>stop</button> }
            {/*  [条件式] && [任意の処理]　前の条件式がtrueにときだけ処理が行われる */}
            
        </div>
    );
};
// 条件(三項)演算子　条件？真値：偽値(if分の代替)
// 状態がゲームオーバーになったら、onRestartして表示をgameoverに。そうでなければstartに。

export default Button;