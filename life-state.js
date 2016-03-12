/***** Game of Life *****/

/* require tools */

(function (udf){
  var itr = $.itr;
  
  var createfrom = S.createfrom;
  var filled = S.filled;
  var makeSimpleState = S.makeSimpleState;
  
  function next(state){
    //console.log("here");
    var newstate = createfrom(state, -1);
    for (var i = 0; i < state.length; i++){
      for (var j = 0; j < state[i].length; j++){
        if (state[i][j] === 1){
          fillNewstateCircle(newstate, state, i, j);
        }
      }
    }
    return newstate;
  }
  
  function fillNewstateCircle(newstate, state, i, j){
    for (var k = i-1; k <= i+1; k++){
      if (k < 0 || k >= state.length)continue;
      for (var l = j-1; l <= j+1; l++){
        if (l < 0 || l >= state[k].length)continue;
        if (newstate[k][l] === -1){
          newstate[k][l] = next1(state, k, l);
        }
      }
    }
  }
  
  function next1(state, i, j){
    var n = neighbors(state, i, j);
    if (filled(state, i, j)){
      return (n == 2 || n == 3)?1:0;
    } else {
      return (n == 3)?1:0;
    }
  }
  
  function neighbors(state, i, j){
    var n = 0;
    if (filled(state, i-1, j-1))n++;
    if (filled(state, i-1, j))n++;
    if (filled(state, i-1, j+1))n++;
    if (filled(state, i, j-1))n++;
    if (filled(state, i, j+1))n++;
    if (filled(state, i+1, j-1))n++;
    if (filled(state, i+1, j))n++;
    if (filled(state, i+1, j+1))n++;
    return n;
  }
  
  function makeLifeState(rows, cols){
    var state = makeSimpleState(rows, cols);
    
    var runner = itr(step);
    
    var onstart = function (){};
    var onstop = function (){};
    
    runner.onstart = function (){
      onstart();
    };
    
    runner.onstop = function (){
      n = 1;
      onstop();
    }
    
    var n = 1;
    var ref = 50;
    
    var onrefresh = function (state){};
    
    function step(){
      state.setState(next(state.getState()));
      if (n >= ref){
        refresh();
        n = 1;
      } else {
        n++;
      }
    }
    
    function refresh(){
       onrefresh(state.getState());
    }
    
    function refreshRate(r){
      ref = r;
    }
    
    function clear(){
      // order of these two calls is backwards
      // need to separate runner onstop callback from the actual stop
      state.clear();
      runner.stop();
    }
    
    return {
      fill: state.fill,
      filled: state.filled,
      empty: state.empty,
      set: state.set,
      getState: state.getState,
      setState: state.setState,
      step: step,
      set onstart(f){onstart = f;},
      set onstop(f){onstop = f;},
      set onrefresh(f){onrefresh = f;},
      start: runner.start,
      stop: runner.stop,
      startstop: runner.startstop,
      started: runner.started,
      speed: runner.speed,
      refresh: refresh,
      refreshRate: refreshRate,
      clear: clear,
      runner: runner
    };
  }
  
  window.LS = {
    next: next,
    makeLifeState: makeLifeState,
  };
  
})();