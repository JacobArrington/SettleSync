import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalc, postCalc } from '../../store/caclulator'
import OpenModalButton from '../OpenModalButton';
import PostCalculatorModal from '../PostCalculatorModal';
import Calculator from '../Calculator';

const Dashboard = () => {
    const dispatch = useDispatch();
    const calculatorState = useSelector(state => state.calculator.calculatorData);
    const currentUser = useSelector(state => state.session.user);
    // Check if calculator data exists and has the required data
    const hasCalculator = Boolean(calculatorState && calculatorState.calcInput )

    useEffect(() => {
        if(!hasCalculator && currentUser)
            dispatch(fetchCalc());
        
    }, [dispatch, currentUser, hasCalculator]);

    const handleCreateCalculator = async () => {
        await dispatch(postCalc({ /* default calc data */ }));
    };

    return (
        <div className="dashboard-container">
            {!hasCalculator ? (
                <OpenModalButton
                    buttonText="Create Calculator"
                    modalComponent={<PostCalculatorModal />}
                />
            ) : (
                <Calculator 
                  calculatorInput={calculatorState.calcInput[0]} 
                  installments={calculatorState.calcInput[0].installments}
                  settlements={calculatorState.calcInput[0].settlement}
                  customInputs={calculatorState.calcInput[0].custom}
                  calcName={calculatorState.calcName}
                />
            )}
        </div>
    );
};

export default Dashboard;
