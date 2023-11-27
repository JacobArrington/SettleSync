

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
    
    switch(action.type){
        case GET_CALC:
            return {
                ...state ,
                calculators: action.calculator,
                currCalc: action.calculator[0]
            }
        case ADD_CALC:
            return{
                ...state, 
                calculators: state.calculators ? [...state.calculators, action.calculator] : [action.calculator],
                currCalc : action.calculator
            }

        
    }
}
