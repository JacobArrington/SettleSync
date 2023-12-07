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
        balance: calculatorInput?.balance,
        lumpSum: calculatorInput?.lumpSum,
        remainderAfterLump: calculatorInput?.remainderAfterLump ,
        customInstallment: installments?.customInstallment ,
        customDiscountPercentage: customInputs?.customDiscountPercentage, 
        customMonthlyPayment: customInputs?.customMonthlyPayment ,
        interestRate: customInputs?.interestRate ,
    })

    useEffect(() => {
        if (calculatorInput) {
           
            
            setFormData({
                balance: calculatorInput.balance,
                lumpSum: calculatorInput.lumpSum,
                remainderAfterLump: calculatorInput.remainderAfterLump,
                customInstallment: installments.customInstallment ,
                customDiscountPercentage: settlements.customDiscountPercentage ,
                customMonthlyPayment: customInputs.customMonthlyPayment ,
                interestRate: customInputs.interestRate  
            });
        } 
    }, [dispatch, calculatorData]);

    const handleInputChange = (e) =>{
       const newFormData = {
            ...formData,
            [e.target.name]: parseFloat(e.target.value) 
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
    const [localInstallments, setLocalInstallments] = useState(installments);
    const [customNumberOfInstallments, setCustomNumberOfInstallments] = useState(0);
    const [customInstallmentAmount, setCustomInstallmentAmount] = useState(0);


    useEffect(() => {
        setLocalInstallments(installments);
    }, [installments]);



    useEffect(() => {
        // Recalculate installment amounts when the balance changes
        const amountToDivide = formData.remainderAfterLump > 0 ? formData.remainderAfterLump : formData.balance;
        const updatedInstallments = localInstallments.map(installment => ({
            ...installment,
            installmentAmount: amountToDivide / installment.numberOfInstallment
        }));
        setLocalInstallments(updatedInstallments);
    }, [formData.balance, formData.remainderAfterLump, localInstallments]);

    const handleInstallmentChange = (index, key, value) => {
        const updatedInstallments = localInstallments.map((inst, idx) => {
            if (idx === index) {
                return { ...inst, [key]: parseFloat(value) || 0 };
            }
            return inst;
        });
        setLocalInstallments(updatedInstallments);
    };

    useEffect(()=>{
        if(customNumberOfInstallments > 0){
            const amountToDivide = formData.remainderAfterLump > 0 ? formData.remainderAfterLump : formData.balance;
            setCustomInstallmentAmount(amountToDivide / customNumberOfInstallments)
        }
    },[formData.balance, customNumberOfInstallments])

    const handleCustomInstallmentChange = (e) => {
        setCustomNumberOfInstallments(parseFloat(e.target.value) );
    };

    const calculateSettlement = (discountPercentage) =>{
        const savings = formData.balance * (discountPercentage / 100)
        const settlementAmmount = formData.balance - savings; 
        return { settlementAmmount , savings }
    }

    return (
        <div className="calc-container">
            <div className="calc-form">
                <div className="calc-inputs">
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
                </div>


                <div className="installments-container">
                <h3>Installments</h3>
                {localInstallments && localInstallments.map((installment, index) => (
                    <div key={index} className="installment-item">
  <label htmlFor={`numberOfInstallment-${index}`}>Installment :</label>
                        <input 
                            id={`numberOfInstallment-${index}`}
                            type="number"
                            name="numberOfInstallment"
                            value={installment.numberOfInstallment}
                            onChange={(e) => handleInstallmentChange(index, 'numberOfInstallment', e.target.value)}
                            readOnly
                        />

                        <label htmlFor={`installmentAmount-${index}`}>Amount:</label>
                        <input 
                            id={`installmentAmount-${index}`}
                            type="number"
                            name="installmentAmount"
                            value={installment.installmentAmount.toFixed(2)}
                           readOnly
                        />

                        
                    </div>
                ))}
                    <div className="custom-installment-container">
                <label htmlFor="customNumberOfInstallments">Custom   :</label>
                <input 
                    id="customNumberOfInstallments"
                    type="number"
                    value={customNumberOfInstallments}
                    onChange={handleCustomInstallmentChange}
                />

                <label htmlFor="customInstallmentAmount">Amount:</label>
                <input 
                    id="customInstallmentAmount"
                    type="number"
                    readOnly 
                    value={customInstallmentAmount.toFixed(2)}
                />
                

                
            </div>


        
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

           </div>
           </div>
           
        
    );
};


export default Calculator
