import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCalc, editCalc } from "../../store/caclulator";
import { useModal } from "../../context/modal"
import PostCalculatorModal from "../PostCalculatorModal";

const Calculator = ({calculatorInput, installments, settlements, customInputs}) =>{
    const dispatch = useDispatch();
    const calculatorData = useSelector(state => state.calculator?.calcInput);

    const predefinedInstallments = [2, 3, 6, 9, 12, 18, 24];
    const predefinedDiscounts = [5, 10, 15, 20, 25];

    const [formData, setFormData] = useState({
        balance: calculatorInput?.balance || 0,
        lumpSum: calculatorInput?.lumpSum || 0,
        remainderAfterLump: calculatorInput?.remainderAfterLump || 0,
        customInstallment: installments?.customInstallment || 0, 
        customDiscountPercentage: customInputs?.customDiscountPercentage || 0,
        customMonthlyPayment: customInputs?.customMonthlyPayment || 0,
        interestRate: customInputs?.interestRate || 0
    })

    useEffect(() => {
        if (calculatorInput) {
           
            
            setFormData({
                balance: calculatorInput.balance,
                lumpSum: calculatorInput.lumpSum,
                remainderAfterLump: calculatorInput.remainderAfterLump,
                customInstallment: installments.customInstallment || 0,
                customDiscountPercentage: settlements.customDiscountPercentage || 0,
                customMonthlyPayment: customInputs.customMonthlyPayment || 0,
                interestRate: customInputs.interestRate || 0
            });
        } 
    }, [dispatch, calculatorData]);

    const handleInputChange = (e) =>{
       const newFormData = {
            ...formData,
            [e.target.name]: parseFloat(e.target.value) || 0
        }
        newFormData.remainderAfterLump = newFormData.balance - newFormData.lumpSum;
        setFormData(newFormData);
    }
    const handleRecalculate = async () => {
        await dispatch(editCalc(formData))
    }

    const calculateMonthsToPay = () => {
        let balanceWithInterest = formData.balance + (formData.balance *(formData.interestRate / 100) / 12)
        return formData.customMonthlyPayment > 0 ? Math.ceil(balanceWithInterest / formData.customMonthlyPayment) : 0
    }
    
    const calculateInstallmentAmount = (numberOfInstallments) => {
        return formData.balance / numberOfInstallments;
    };

    const calculateSettlement = (discountPercentage) =>{
        const savings = formData.balance * (discountPercentage / 100)
        const settlementAmmount = formData.balance - savings; 
        return { settlementAmmount , savings }
    }

    return (
        <div className="calc-container">
            <div className="calc-form">
                <label htmlFor="balance">Balance:</label>
                <input 
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                />

                <label htmlFor="lumpSum">Lump Sum:</label>
                <input 
                    type="number"
                    name="lumpSum"
                    value={formData.lumpSum}
                    onChange={handleInputChange}
                />

                <label htmlFor="remainderAfterLump">Remainder After Lump:</label>
                <input
                    type="number"
                    name="remainderAfterLump"
                    value={formData.remainderAfterLump}
                    readOnly
                />

                <label htmlFor="customInstallment">Custom Installment:</label>
                <input 
                    type="number"
                    name="customInstallment"
                    value={formData.customInstallment}
                    onChange={handleInputChange}
                />

                <label htmlFor="customDiscountPercentage">Custom Discount Percentage:</label>
                <input 
                    type="number"
                    name="customDiscountPercentage"
                    value={formData.customDiscountPercentage}
                    onChange={handleInputChange}
                />

                <label htmlFor="customMonthlyPayment">Custom Monthly Payment:</label>
                <input 
                    type="number"
                    name="customMonthlyPayment"
                    value={formData.customMonthlyPayment}
                    onChange={handleInputChange}
                />

                <label htmlFor="interestRate">Interest Rate:</label>
                <input 
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                />

                {/* Add more inputs as needed based on your application requirements */}
            </div>

            {/* Display logic for installments, settlements, etc. */}
        </div>
    );
};


export default Calculator
