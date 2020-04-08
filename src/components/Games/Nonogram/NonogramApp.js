import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './NonogramApp.scss';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  //Para dropdown:
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import "./../../SharedButtons/IframeButtons.css";
import InstructionGames from '../../SharedButtons/InstructionGames/InstructionGames';
import CloseButton from '../../SharedButtons/CloseButton';


export default function NonogramApp() {
  // ---STATES---
  const [solutionGame, changeSolutionGame] = useState({
    // Here will be the solution (0 and 1) generate randomly
    grid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  });
  const [solutionUser, changeSolutionUser] = useState({
    // Here will be the solution (0 and 1) of the user. We compare it with the solutionGame to see if its ok or not
    grid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  });
  // ---END OF STATES---

  //--MODAL fin del juego
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  //--FIN MODAL
  // --DROPDOWN
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
  // --FIN DROPDOWN

  //Change level dropdown
  function changeLevel(item) {
    changeSolutionUser({ grid: Array(item).fill(0).map(x => Array(item).fill(0)) });
    changeSolutionGame({ grid: Array(item).fill(0).map(x => Array(item).fill(0).map(e => Math.round(Math.random()))) });
  }

  //We change the value of SolutionGame, making random values 0 / 1
  function randomValueSolution() {
    changeSolutionGame({ grid: solutionGame.grid.map(row => row.map(item => item = (Math.round(Math.random())))) });
  }
  useEffect(() => { randomValueSolution() }, []);
  console.log(solutionGame.grid)

  // Change the value of the cell 1/2/3 when click on it and change the state
  let changeCellValue = (x, y) => {
    let objeto = { ...solutionUser };
    objeto.grid[x][y] = objeto.grid[x][y] === 2 ?
      0 : objeto.grid[x][y] + 1;
    changeSolutionUser(objeto);
    compareSolution();
  }

  //To compare de right solution with de user solution. When it´s right, the game ends
  let compareSolution = () => {
    let solutionUserWithout2 = solutionUser.grid.map(row => row.map(item => item !== 1 ? 0 : 1))
    if (JSON.stringify(solutionGame.grid) === JSON.stringify(solutionUserWithout2)) {
      // changeWinGame(true);
      setModal(!modal)
    }
  }

  //CODE TO GENERATE THE CLUES
  let horizontalClues = [];
  let verticalClues = [];

  function horizontalCounter(grid) {
    let values = [];
    let times = [];
    let prev;
    let tempArrayValues = [];
    let tempArrayTimes = [];
    let tempClues = [];

    //We generate two arrays of values and times these values are repeated
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (grid[i][j] !== prev) {
          tempArrayValues.push(grid[i][j]);
          tempArrayTimes.push(1);
        } else {
          tempArrayTimes[tempArrayTimes.length - 1]++;
        }
        prev = grid[i][j];
      }
      values.push(tempArrayValues);
      times.push(tempArrayTimes);
      tempArrayValues = [];
      tempArrayTimes = [];
      prev = null;
    }

    //We select only the values of 1 (which are the clues to be displayed) and store them in horizontalClues
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (values[i][j] === 1) {
          tempClues.push(times[i][j]);
        }
      }
      if (tempClues.length !== 0) {
        horizontalClues.push(tempClues);
        tempClues = [];
      } else {
        horizontalClues.push([0]);
        tempClues = [];
      }
    }
    values = [];
    times = [];

    return horizontalClues;
  }

  //We call the function with the randomly generated array as argument to calculate the horizontal clues
  horizontalCounter(solutionGame.grid);

  function verticalCounter(grid) {
    let values = [];
    let times = [];
    let prev;
    let tempArrayValues = [];
    let tempArrayTimes = [];
    let tempClues = [];
    let tempVerticalGrid = [];
    let verticalGrid = [];

    //We transform the initial array into a vertical one to be able to read the vertical tracks
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        tempVerticalGrid.push(grid[j][i]);
      }
      verticalGrid.push(tempVerticalGrid);
      tempVerticalGrid = [];
    }

    //We divide the vertical array into two arrays of values and times that are repeated (same routine)
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (verticalGrid[i][j] !== prev) {
          tempArrayValues.push(verticalGrid[i][j]);
          tempArrayTimes.push(1);
        } else {
          tempArrayTimes[tempArrayTimes.length - 1]++;
        }
        prev = verticalGrid[i][j];
      }
      values.push(tempArrayValues);
      times.push(tempArrayTimes);
      tempArrayValues = [];
      tempArrayTimes = [];
      prev = null;
    }

    //We select only the values of 1 (which are the clues to be displayed) and store them in verticalClues
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (values[i][j] === 1) {
          tempClues.push(times[i][j]);
        }
      }
      if (tempClues.length !== 0) {
        verticalClues.push(tempClues);
        tempClues = [];
      } else {
        verticalClues.push([0]);
        tempClues = [];
      }
    }
    return verticalClues;
  }

  //We call the function with the randomly generated array as argument to calculate the vertical clues
  verticalCounter(solutionGame.grid);

  return (
    <div style={{ backgroundColor:"#0C1348"}}>
      <InstructionGames style={{ color: "white !important" }} instructionText="El nonograma es un juego de ingenio que consiste en rellenar determinadas casillas de un tablero en función de los números que contiene.
      Cada juego tiene una serie de casillas con números en su parte superior y en su parte izquierda. Estos números indican grupos de cuadrados consecutivos que aparecen en la respectiva fila/columna. Cada grupo debe ir separado por una o más casillas libres" />

       <CloseButton / >

      <div className="Nonogram container-fluid">
        {modal ?
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Enhorabuena!!</ModalHeader>
              <ModalBody>
                Has ganado el juego! ¿Quieres intentar otra partida?
        </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => window.location.reload()}>Vamos allá</Button>{' '}
              </ModalFooter>
            </Modal>

            <table className="center">
              <tbody>
                <tr>
                  {/*The first one goes empty*/}
                  <td></td>
                  {verticalClues.map((clue, clueIndex) => {
                    return <td key={clueIndex} className='clue v_clue' valign="bottom"><div><p className="v_clue_p v-text">{clue}</p></div></td>
                  })}
                </tr>
                {
                  solutionUser.grid.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td ><div className='clue h_clue'>{horizontalClues[rowIndex]}</div></td>
                      {row.map((cell, cellIndex) => <td key={cellIndex} onClick={() => changeCellValue(rowIndex, cellIndex)} ><div className={`cell_${cell} cell`}></div></td>)}
                    </tr>
                  ))
                }
              </tbody>
            </table>

            <div className="buttons">
              <Button className="restart_button" color="primary" onClick={() => window.location.reload()}>Restart!</Button>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret className="selector_button" >
                  Selecciona nivel
              </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => changeLevel(3)}>Aprende 3x3</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => changeLevel(5)}>Fácil 5x5</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="drop8" onClick={() => changeLevel(7)}>Medio 7x7</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="drop10" onClick={() => changeLevel(9)}>Difícil 9x9</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          :

          <div>

            {/* <div className='rocket_start'>
            <img src="./play_card_black.png"  className="img_rocket" alt='rocket'/>
          </div> */}
            <table className="center">
              <tbody>
                <tr>
                  {/*The first one goes empty*/}
                  <td></td>
                  {verticalClues.map((clue, clueIndex) => {
                    return <td key={clueIndex} className='clue v_clue' valign="bottom"><div><p className="v_clue_p v-text">{clue}</p></div></td>
                  })}
                </tr>
                {
                  solutionUser.grid.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td ><div className='clue h_clue'>{horizontalClues[rowIndex]}</div></td>
                      {row.map((cell, cellIndex) => <td key={cellIndex} onClick={() => changeCellValue(rowIndex, cellIndex)} ><div className={`cell_${cell} cell`}></div></td>)}
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className="buttons">
              <Button className="restart_button" color="primary" onClick={() => window.location.reload()}>Restart!</Button>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret className="selector_button" >
                  Selecciona nivel
              </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => changeLevel(3)}>Aprende 3x3</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => changeLevel(5)}>Fácil 5x5</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => changeLevel(7)}>Medio 7x7</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => changeLevel(9)}>Difícil 9x9</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="buttons">
              <Link to="/nonogram"> <Button className="iframe_button" color="primary" onClick={() => window.location.reload()}>+ Levels</Button></Link>

            </div>
          </div>
        }
      </div>
    </div>

  )
}
