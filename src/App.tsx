import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { TableData } from './components';
import './App.css'
import { alphabetMatrixRows, wordlist } from './data/index'
import { Indicestype } from "./types"


const alphabetMatrix = alphabetMatrixRows.map(row => row.split(''));

export let highlighIndexs: number[][] = [];
const foundWordslist: string[] = [];


let rows = alphabetMatrix.length;
let columns = alphabetMatrix[0].length;

/* the word can be matche at any 8 direction at point so 
The 8 directions are, Horizontally Left, Horizontally Right, Vertically Up, Vertically Down and 4 Diagonal directions.*/

let direction_x = [-1, -1, -1, 0, 0, 1, 1, 1];
let direction_y = [-1, 0, 1, -1, 1, -1, 0, 1];

function App() {

  const [userSearchquery, setUserSearchquery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>("none");

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("none");
    }, 3000);
  }, [errorMessage])
  const searchDirection = (matrix: string[][], row: number, col: number, word: string) => {

    if (matrix[row][col] !== word[0]) return [];

    let len = word.length;
    let res = [];

    for (let direction = 0; direction < 8; direction++) {
      let k,
        rd = row + direction_x[direction],
        cd = col + direction_y[direction];

      for (k = 1; k < len; k++) {
        if (rd >= rows || rd < 0 || cd >= columns || cd < 0) break;

        if (matrix[rd][cd] !== word[k]) break;

        rd += direction_x[direction];
        cd += direction_y[direction];
      }
      if (k === len) res.push(direction);
    }
    return res;
  }


  const directionTraversal = (row: number, col: number, word: string, directions: number[]) => {
    if (directions.length === 0) return [];
    let indices = [[row, col]];
    for (let dir of directions) {
      for (let i = 1; i < word.length; i++) {
        indices.push([row + i * direction_x[dir], col + i * direction_y[dir]]);
      }
    }
    return indices;
  }

  const findIndices = (matrix: string[][], word: string) => {
    let indices: number[][] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        let directions: number[] = searchDirection(matrix, row, col, word);
        indices = [
          ...indices,
          ...directionTraversal(row, col, word, directions),
        ];
      }
    }
    return indices;
  }

  const isFound = (array1: string[], array2: string[], str: string) => {
    let filteredArray = array1.filter((value) => array2.includes(value));
    if (!filteredArray.includes(str)) return false;
    return true;
  }

  const getResult = () => {
    let userquery = userSearchquery.toUpperCase();
    if (userquery === "") {
      alert("Enter something to find words");
      return;
    }

    if (findIndices(alphabetMatrix, userquery) && wordlist.includes(userquery)) {
      highlighIndexs = [
        ...highlighIndexs,
        ...findIndices(alphabetMatrix, userquery),
      ];
      foundWordslist.push(userquery);
    } else {
      setErrorMessage("");
    }
    setUserSearchquery("");

    let sortedWordslist = wordlist.slice();
    // now check if the wordlist has all answerd or not;
    if (foundWordslist.sort().join(",") === sortedWordslist.sort().join(",")) {
      alert("Hurray!! Well played !!");
    }
  }

  return (
    <main>
      <section className='container'>
        <section className='sidebar'>
          <h1 className='title'>Find The Words</h1>
          <div className='words-searchlist'>
            <ul className='wordslist'>
              {
                wordlist.map((words, index) => <li className='listname' key={uuidv4()}
                  style={{
                    textDecoration: isFound(foundWordslist, wordlist, words) ?
                      "line-through" : "none", color: isFound(foundWordslist, wordlist, words) ?
                        "grey" : "black"
                  }}
                >{words}</li>)
              }
            </ul>
          </div>
        </section>

        <section className='main-content'>
          <div className="userinputs">
            <input type="text" className='input' placeholder='Search Word In Grid' value={userSearchquery} onChange={(e) => setUserSearchquery(e.target.value)} />
            <button className='submit-btn' type='submit' onClick={getResult}>Submit</button>
          </div>
          <div className="grid-container">
            <table>
              <tbody>
                {
                  alphabetMatrix.map((rowsarr, index) =>
                    <tr key={uuidv4()} id={index.toString()}>
                      {
                        rowsarr.map((rowdata, rowindex) =>
                          <TableData column={rowindex} data={rowdata} row={index} key={uuidv4()} />)
                      }
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          <h4
            className="error-message "
            style={{ display: errorMessage, color: "red" }}
          >
            Word doesn't exist
          </h4>
        </section>
      </section>
    </main>
  )
}

export default App
