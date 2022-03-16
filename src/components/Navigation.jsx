import React from 'react';
import { defaultDifficulty, Difficulty } from '../constants';

const Navigation = ({ length, difficulty= defaultDifficulty, onChangeDifficulty }) => {
    const upVisibility = difficulty < Difficulty.length ? '' : 'is-hidden' //条件に一致すればhiddenというidを振る→難易度設定のための→を表示させる
    const downVisibility = difficulty > 1 ? '' : 'is-hidden'
    const onUpDifficulty = () => onChangeDifficulty(difficulty +1) //　難易度の表示を＋1
    const onDownDifficulty = () => onChangeDifficulty(difficulty -1) // 難易度の表示を-1
    return (
        <div className="navigation">
            <div className="navigation-item">
                <span className="navigation-label">Length:</span>
                <div className="navigation-item-number-container">
                    <div className="num-board">{length}</div>
                </div>
            </div>
            <div className="navigation-item">
                <span className="navigation-label">Difficulty: </span>
                <div className="navigation-item-number-container">
                    <span className="num-board">{difficulty}</span>
                    <div className="difficulty-button-container">
                        <div
                            className={`difficulty-button difficulty-up ${upVisibility}`}
                            onClick={onUpDifficulty}
                        ></div>
                        <div
                            className={`difficulty-button difficulty-down ${downVisibility}`}
                            onClick={onDownDifficulty}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Navigation;