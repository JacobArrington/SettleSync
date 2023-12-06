import { csrfFetch } from "./csrf"


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
    const response = await csrfFetch('/api/calculator')
    if(response.ok){
        const calculator = await response.json()
        dispatch(getCalculator(calculator))
        return calculator
    }
}

export const postCalc = (calcData) => async (dispatch) =>{
    const response = await csrfFetch('/api/calculator',{
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

export const editCalc = (calcData) => async(dispatch) =>{
    const response = await csrfFetch('/api/calculator', {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(calcData)
    })

    if(response.ok){
        const updatedCalc =  await response.json()
        dispatch(updateCalculator)
        return updatedCalc
    }
}




const initState = {};

export default function calculatorReducer(state = initState, action) {
    // Create a copy of the current state
    let newState = { ...state };

    switch (action.type) {
        case GET_CALC:
            // Update the newState with the calculator data
            newState.calculatorData = action.calculator;
            break;

        case ADD_CALC:
            // Update newState with the newly added calculator data
            newState.calculatorData = action.calculator;
            break;

        case UPDATE_CALC:
            // Update the calculator data in newState
            newState.calculatorData = action.calculator;
            break;

        // Uncomment and update if DELETE_CALC functionality is needed
        // case DELETE_CALC:
        //     newState.calculatorData = null;
        //     break;

        default:
            // If none of the above actions, return the current state
            return state;
    }

    // Return the updated newState
    return newState;
}
