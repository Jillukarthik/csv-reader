import React, { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [inputdata, setInputdata] = useState("");
  const [dialogueBox, setDialogueBox] = useState(false);
  const [LocA, setLocA] = useState("");
  const [LocB, setLocB] = useState("");
  const [index, setIndex] = useState();
  const fileReader = new FileReader();



  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
    setOriginalArray(array)
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  const HandleFilter = () => {
      let filteredData = array.filter((itm, idx) => {
        return (
          itm["Part #"]?.includes(inputdata.toUpperCase()) ||
          itm["Alt.Part#"]?.includes(inputdata.toUpperCase())
        );
      });
    setArray(filteredData); 
  };


  const handleDel = (i) => {
    let arr = [...array];
    arr.splice(i, 1);
    setArray(arr);
  };

  const handleEdit = (i) => {
    setDialogueBox(true);
    setIndex(i)
  };

  const handleUpdate = () => {
    let updatedArr = array.map((itm, idx) => {
      if (idx === index) {
        return {
          ...itm,
          "LOCATION A STOCK": LocA,
          "LOC B STOCK ": LocB,
        };
      }
      return itm;
    });
    setArray(updatedArr);
    setDialogueBox(false);
  };
  // console.log(LocA,"hey",LocB)
  return (
    <div className="app__table">
      <h1>CSV Table Data</h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
      <div className="input__fields">
        <label>User Input:</label>
        <input
          value={inputdata}
          onChange={(e) => { 
          if(!e.target.value) {
            setArray(originalArray)
          } 
          setInputdata(e.target.value)
          }}
        />
        <button onClick={HandleFilter}>Filter</button>
      </div>
      <br />

      <table className="table">
        <thead className="table__header">
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody className="table__body">
          {array.map((item, idx) => (
            <>
              <tr key={idx}>
                {Object.values(item).map((val) => (
                  <td className="table__data">{val}</td>
                ))}
                <button onClick={() => handleDel(idx)}>Del</button>
                <button onClick={() => handleEdit(idx)}>Edit</button>
              </tr>
              <div>
                {dialogueBox && (
                  <div className="open__state">
                    <p className="open__desc">LocA_Stock and LocB_Stock Can be Updated</p>
                    <div className="close__tab">
                      <span onClick={()=>setDialogueBox(!dialogueBox)}>X</span></div>
                    <div className="open__form">
                      <label>LocA_Stock</label>
                      <input className="open__input"
                        value={LocA} onChange={(e) => setLocA(e.target.value)} />
                      <label>LocB_Stock</label>
                      <input className="open__input"
                        value={LocB} onChange={(e) => setLocB(e.target.value)} />
                      <button className="open__update" onClick={() => handleUpdate()}>Update</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;
