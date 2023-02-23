//
//select html element
const addMatch = document.querySelector(".lws-addMatch");
const allMatches = document.querySelector(".all-matches");
const match = document.querySelector(".match");
const result = document.querySelector(".lws-singleResult");
const incrementForm = document.querySelector(".incrementForm");
const decrementForm = document.querySelector(".decrementForm");
const empty = document.querySelector(".lws-reset");
const clone = match.cloneNode(true);

// Numbering all match
function numberingMatch() {
  const allMatchNum = [...allMatches.querySelectorAll(".lws-matchName")];
  allMatchNum.map((numMatch, index) => {
    numMatch.innerHTML = `MATCH ${index + 1}`;
  });
}

//create action type
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const ADDCOUTNER = "score/counter";
const DELETE = "score/delete";
const RESET = "score/reset";
// initialsta create
const initialStates = [
  {
    id: 0,
    value: 0,
  },
];

//create reducer
const scoreReducer = (states = initialStates, action) => {
  switch (action.type) {
    case ADDCOUTNER:
      const match = clone.cloneNode(true);
      allMatches.appendChild(match);
      numberingMatch();
      return [...states, action.payload];

    case INCREMENT:
      return states.map((state) => {
        if (state.id === action.payload.id) {
          return { ...state, value: state.value + action.payload.value };
        } else {
          return state;
        }
      });

    case DECREMENT:
      return states.map((state) => {
        if (state.id === action.payload.id) {
          let decre = state.value - action.payload.value;
          return decre > 0
            ? { ...state, value: decre }
            : { ...state, value: 0 };
        } else {
          return state;
        }
      });

    case DELETE:
      if (allMatches.contains(action.payload.match)) {
        allMatches.removeChild(action.payload.match);
        numberingMatch();
      }
      return states.filter((state) => state.id !== action.payload.id);

    case RESET:
      return states.map((state) => {
        return { ...state, value: 0 };
      });
    default:
      return states;
  }
};

//create action
const increment = (id, value) => {
  return {
    type: INCREMENT,
    payload: {
      id,
      value,
    },
  };
};
const decrement = (id, value) => {
  return {
    type: DECREMENT,
    payload: {
      id,
      value,
    },
  };
};
const addCounter = (id) => {
  return {
    type: ADDCOUTNER,
    payload: {
      id,
      value: 0,
    },
  };
};
const remove = (id, match) => {
  return {
    type: DELETE,
    payload: {
      id,
      match,
    },
  };
};
const reset = () => {
  return {
    type: RESET,
  };
};

// Increment
function selectIncreInputs(matchID = 0) {
  const incrementForm = [...document.querySelectorAll(".incrementForm")];
  incrementForm.map((form) => {
    form.addEventListener("submit", function () {
      const increInput = this.querySelector(".lws-increment");
      const incrementValue = Number(increInput.value);
      store.dispatch(increment(matchID, incrementValue));
      increInput.value = "";
    });
  });
}
// Decrement
function selectDecreInputs(matchID = 0) {
  const decrementForm = [...document.querySelectorAll(".decrementForm")];
  decrementForm.map((form) => {
    form.addEventListener("submit", function () {
      const decreInput = this.querySelector(".lws-decrement");
      const decrementValue = Number(decreInput.value);
      store.dispatch(decrement(matchID, decrementValue));
      decreInput.value = "";
    });
  });
}
// Select all Delete buttons
function selectDelete() {
  const matches = [...allMatches.querySelectorAll(".match")];
  const dltBtns = [...allMatches.querySelectorAll(".lws-delete")];
  dltBtns.map((btn, index) => {
    btn.addEventListener("click", () => {
      store.dispatch(remove(index, matches[index]));
    });
  });
}

// create store
const store = Redux.createStore(scoreReducer);
const render = () => {
  const states = store.getState();
  const results = [...document.querySelectorAll(".lws-singleResult")];
  results.map((result, index) => {
    if (states[index].value !== undefined)
      result.innerHTML = `${states[index].value}`;
  });
};

render();
store.subscribe(render);

// Add New Match
addMatch.addEventListener("click", () => {
  const matchID = allMatches.children.length;
  store.dispatch(addCounter(matchID));
  selectIncreInputs(matchID);
  selectDecreInputs(matchID);
  selectDelete();
});

selectIncreInputs();
selectDecreInputs();
selectDelete();

// Reset Button
empty.addEventListener("click", () => {
  store.dispatch(reset());
});
