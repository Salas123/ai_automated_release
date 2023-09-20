import './App.css';
import {Grid} from "@mui/material";
import TopLayer from "./Components/TopLayer";
import MiddleLayer from "./Components/MiddleLayer";
import BottomLayer from "./Components/BottomLayer";

function App() {
  return (
    <div className="App">

      <Grid
          container
          direction="column"
          justifyContent="space-around"
          alignItems="stretch"
      >
          <TopLayer/>
          <MiddleLayer/>
          <BottomLayer/>
      </Grid>

    </div>
  );
}

export default App;
