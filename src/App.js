import React, { useMemo, useState } from "react";
import "./App.css";
import {
  Button,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Box,
  Input,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import GetAppIcon from "@mui/icons-material/GetApp";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

function App() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [inputdata, setInputdata] = useState("");
  const [dialogueBox, setDialogueBox] = useState(false);
  const [LocA, setLocA] = useState("");
  const [LocB, setLocB] = useState("");
  const [index, setIndex] = useState();

  const fileReader = useMemo(() => new FileReader(), []);

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = useMemo(() => (string) => {
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
    setOriginalArray(array);
  }, []);

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

  const headerKeys = useMemo(() => Object.keys(Object.assign({}, ...array)), [
    array,
  ]);

  const HandleFilter = () => {
    let filteredData = array.filter((itm) => {
      return (
        itm["Part #"]?.includes(inputdata.toUpperCase()) ||
        itm["Alt.Part#"]?.includes(inputdata.toUpperCase())
      );
    });
    setArray(filteredData);
  };

  const handleDel = useMemo(() => (i) => {
    let arr = [...array];
    arr.splice(i, 1);
    setArray(arr);
  }, [array]);

  const handleEdit = useMemo(() => (i,itm) => {
    setDialogueBox(true);
    setIndex(i);
    setLocA(itm["LOCATION A STOCK"])
    setLocB(itm["LOC B STOCK "])
  }, []);

  const handleUpdate = useMemo(() => () => {
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
  }, [array, index, LocA, LocB]);

   const handleRender = useMemo(() => (e) => {
    if (!e.target.value) {
      setArray(originalArray);
      console.log("data,", e.target.value);
    }
    console.log("data,", e.target.value);
  }, [originalArray]);

  const handleInputChange = useMemo(() => (e) => {
    setInputdata(e.target.value);
    handleRender(e);
  }, [handleRender]);

 

  return (
    <Box className="app__table">
      <Typography component="h1">CSV Table Data</Typography>
      <Box>
        <Input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />
        <Button
          variant="outlined"
          className="btn--import__csv"
          startIcon={<GetAppIcon />}
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </Button>
      </Box>
      <Box className="input__fields">
        <FormLabel>User Input:</FormLabel>
        <Input
          value={inputdata}
          onChange={(e) => handleInputChange(e)}
        />
        <Button
          variant="outlined"
          className="btn--filter__csv"
          startIcon={<FilterAltIcon />}
          onClick={() => HandleFilter()}
        >
          Filter
        </Button>
      </Box>

      <TableContainer className="table__csv" component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow key={"header"}>
              {headerKeys.map((key) => (
                <TableCell className="table__header" key={key}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {array.map((item, idx) => (
              <>
                <TableRow key={item}>
                  {Object.values(item).map((val) => (
                    <TableCell align="left">{val}</TableCell>
                  ))}
                  <Box>
                    <Stack
                      direction="column"
                      justifyContent="space-between"
                      alignItems="center"
                      height="inherit"
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDel(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(idx,item)}
                      >
                        <BorderColorIcon fontSize="small" />
                      </Button>
                    </Stack>
                  </Box>
                </TableRow>
                <Box>
                  {dialogueBox && (
                    <Box className="open__state">
                      <Typography component="p" className="open__desc">
                        LocA_Stock and LocB_Stock Can be Updated
                      </Typography>
                      <Box className="close__tab">
                        <Typography component="span"
                          onClick={() => setDialogueBox(!dialogueBox)}
                          className="close__opendialogue"
                          color="red"
                        >
                          X
                        </Typography>
                      </Box>
                      <Box className="open__form">
                        <Input
                          className="open__input"
                          placeholder="Loc A"
                          value={LocA}
                          onChange={(e) => setLocA(e.target.value)}
                        />

                        <Input
                          className="open__input"
                          placeholder="Loc B"
                          value={LocB}
                          onChange={(e) => setLocB(e.target.value)}
                        />
                        <Button
                          color="primary"
                          variant="outlined"
                          className="btn--open__update"
                          onClick={() => handleUpdate()}
                        >
                          Update
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default App;
