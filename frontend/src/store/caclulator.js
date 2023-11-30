

const GET_CALC = "calculator/GET_CALC"
const ADD_CALC = "calculator/ADD_CALC"
const UPDATE_CALC = "calculator/UPDATE_CALC"
const DELETE_CALC = "calculator/DELETE_CALC"


const getCalculator = (calculator) =>({
    type: GET_CALC,
    calculator
})

const addCalculator = (calculator) =>({
    type: ADD_CALC,
    calculator
})

const updateCalculator = (calculator) =>({
    type: UPDATE_CALC,
    calculator
})

const deleteCalculator = (calculatorId) =>({
    type: DELETE_CALC,
    calculatorId
})

export const fetchCalc = () => async (dispatch) =>{
    const response = await fetch('/api/calculator')
    if(response.ok){
        const calculator = await response.json()
        dispatch(getCalculator(calculator))
    }
}

export const postCalc = (calcData) => async (dispatch) =>{
    const response = await fetch('/api/calculator',{
        method: "POST", 
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(calcData)
         
    })
    if(response.ok){
        const calculator = await response.json()
        dispatch(addCalculator(calculator))
        return calculator  
    }
    
}








const initState = {}

export default function calculatorReducer(state = initState, action){
    let newState = {}
    switch(action.type){
        case GET_CALC:{
       action.calculator.foreach(calc => {
        newState[calc.id] = calc 
       })
        
    }
    case ADD_CALC:{
        const { calculator } = action;
        newState = {...state, [calculator.id]: calculator};
        return newState
    }
    // case UPDATE_CALC: {
    //     const { calculator } = action;
    //     newState = { ...state, [calculator.id]: calculator };
    //     return newState;
    // }
    // case DELETE_CALC: {
    //     newState = { ...state };
    //     delete newState[action.calculatorId];
    //     return newState;
    // }
}
}
