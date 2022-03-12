import React from 'react';

const Button = ({ status, onStart, onRestart }) => {
    return(
        <div className="button">
            {
                status === "gameover" ?
                <button onClick={onRestart}>gameover</button>
                :
                <button onClick={onStart}>start</button>
            } 
        </div>
    );
};
// 条件(三項)演算子　条件？真値：偽値(if分の代替)
// 状態がゲームオーバーになったら、onRestartして表示をgameoverに。そうでなければstartに。

export default Button;