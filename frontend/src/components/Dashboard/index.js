import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalc, postCalc } from '../../store/caclulator'
import OpenModalButton from '../OpenModalButton';
import PostCalculatorModal from '../PostCalculatorModal';
import Calculator from '../Calculator';

const Dashboard = () => {
    const dispatch = useDispatch();
    const calculatorState = useSelector(state => state.calculator.calculatorData);

    // Check if calculator data exists and has the required data
    const hasCalculator = Boolean(calculatorState && calculatorState.calcInput && calculatorState.calcInput.length > 0);

    useEffect(() => {
        if (!hasCalculator) {
            dispatch(fetchCalc());
        }
    }, [dispatch, hasCalculator]);

    const handleCreateCalculator = async () => {
        await dispatch(postCalc({ /* default calc data */ }));
    };

    return (
        <div className="dashboard-container">
            {!hasCalculator ? (
                <OpenModalButton
                    buttonText="Create Calculator"
                    modalComponent={<PostCalculatorModal onCreate={handleCreateCalculator} />}
                />
            ) : (
                <Calculator 
                  calculatorInput={calculatorState.calcInput[0]} 
                  installments={calculatorState.calcInput[0].installments}
                  settlements={calculatorState.calcInput[0].settlement}
                  customInputs={calculatorState.calcInput[0].custom}
                />
            )}
        </div>
    );
};

export default Dashboard;
