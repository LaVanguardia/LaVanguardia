import React, { useState, useEffect } from 'react';
import './OneToFifty.scss';
import InstructionGames from '../../SharedButtons/InstructionGames/InstructionGames';
import CloseButton from '../../SharedButtons/CloseButton';
import Chrono from './Chrono';

export default function OneToFifty() {

    // ---STATES---
    let [allNumbers, setallNumbers] = useState([]);
    let [firstHalf, setFirstHalf] = useState([]);
    let [secondHalf, setSecondHalf] = useState([]);
    let [currentNumber, setCurrentNumber] = useState(1);
    let [timeStart, setTimeStart] = useState(false);
    // ---END OF STATES---

    //Made an state with an array with all the numbers
    let numbers = [];
    for (let i = 1; i <= 50; i++) {
        numbers.push(i);
    }
    //Fill all numbers
    useEffect(() => {
        setallNumbers(numbers);
    }, [])

    //Fill the first half array and the second half array
    useEffect(() => {
        setFirstHalf(allNumbers.filter(numero => numero <= 25).sort(() => Math.random() - 0.5))
        setSecondHalf(allNumbers.slice(25, 51).sort(() => Math.random() - 0.5))
    }, [allNumbers])

    //Start the counter when you click on "1". And remove and replaced the clicked number
    function checkNumber(number, i) {
        if (number === 1) {
            setTimeStart(true);
        }
        if (number === currentNumber) {
            firstHalf[i] = secondHalf[0];
            secondHalf.splice(0, 1);
            setCurrentNumber(currentNumber + 1);
            if (number === 50) {
                setCurrentNumber('DONE!')
            }
        }
    }

    return (
        <div className="OneToFifty container-fluid">
            <div style={{ height: "100%" }}>
                <InstructionGames instructionText="Aqui van las instrucciones del juego" />
                <CloseButton />
            </div>
            {/* MENU */}
            <div className="row timeAndActualNumber alignCenter">
                <div className="col-12 col-md-6 justifyCenter">
                    <p className="chronoText">{timeStart === false ? '00:00:00' : <Chrono currentNumber={currentNumber}/>}</p>
                </div>
                <div className="col-12 col-md-6 justifyCenter">
                    <p>Siguiente numero: &nbsp;&nbsp;&nbsp; <span style={{ fontWeight: "bold", fontSize: "x-large" }}>{currentNumber}</span></p>
                </div>
            </div>
            {/* GAME */}
            <div className="row numbersGrid">
                {
                    firstHalf.map((number, i) =>
                        <div className="cellNumber alignCenter justifyCenter" key={i} onClick={() => checkNumber(number, i)}>
                            {number}
                        </div>)
                }
            </div>
            <button className="restartButton" onClick={() => window.location.reload()}>Restart</button>
        </div >
    )
}