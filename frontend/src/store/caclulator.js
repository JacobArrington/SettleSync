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
