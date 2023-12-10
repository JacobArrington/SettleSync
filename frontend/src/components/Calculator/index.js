import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCalc, editCalc } from "../../store/caclulator";
import { useModal } from "../../context/modal"
import PostCalculatorModal from "../PostCalculatorModal";

const Calculator = ({calculatorInput, installments, settlements, customInputs, calcName}) =>{
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
                interestRate: customInputs.interestRate  || 0
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

    const [monthsToPay, setMonthsToPay] = useState(0);

    useEffect(() => {
        const calculateMonthsToPay = () => {
            const amount = formData.remainderAfterLump > 0 ? formData.remainderAfterLump : formData.balance;
            const interestPerMonth = formData.interestRate / 100 / 12;
            const balanceWithInterest = amount * (1 + interestPerMonth);

            console.log("Calculating months to pay:", { amount, interestPerMonth, balanceWithInterest, customMonthlyPayment: formData.customMonthlyPayment });

            return formData.customMonthlyPayment > 0 ? Math.ceil(balanceWithInterest / formData.customMonthlyPayment) : 0;
        };

        setMonthsToPay(calculateMonthsToPay());
    }, [formData.balance, formData.lumpSum, formData.customMonthlyPayment, formData.interestRate, formData.remainderAfterLump]);

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
        const amount = formData.remainderAfterLump > 0 ? formData.remainderAfterLump : formData.balance;
        const savings = amount * (discountPercentage / 100) ?? 0
        const settlementAmount = amount - savings ?? 0; 
        return { settlementAmount , savings }
    }

    return (
        <div className="calc-container">
            <div className="calc-name">
                <h3>{calcName}</h3>
            </div>
            <div className="calc-form">
                <div className="calc-inputs">
                <label htmlFor="balance">Balance:</label>
                <input 
                    type="number"
                    name="balance"
                    placeholder="0"
                    value={formData.balance}
                    onChange={handleInputChange}
                />

                <label htmlFor="lumpSum">Lump Sum:</label>
                <input 
                    type="number"
                    name="lumpSum"
                    placeholder="0"
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
                <h4>Installments</h4>
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
                <div className="settlement-container">
                    <h4>Settlements</h4>
                    {predefinedDiscounts.map((discount, index) =>{
                    const { settlementAmount, savings } = calculateSettlement(discount, formData.remainderAfterLump)
                    return (
                        <div key={index} className="settlement-item"> 
                        <label>Discount %:</label>
                        <input 
                                
                                type="number"
                                readOnly
                                value={discount}
                            />
                            <label>Savings:</label>
                            <input 
                                id="Savings"
                                type="number"
                                readOnly
                                value={savings.toFixed(2)}
                            />
                            <label>Settlement Offer:</label>
                            <input
                                id="Toal Settlement" 
                                type="number"
                                readOnly
                                value={settlementAmount.toFixed(2)}
                            />
                        </div>
                    )
                    })}
       <div className="custom-settlement">                 
         <label htmlFor="customDiscountPercentage">Custom  %:  </label>
    <input 
        type="number"
        name="customDiscountPercentage"
        placeholder="0"
        value={formData.customDiscountPercentage}
        onChange={handleInputChange}
    />
    
       
            <label>Savings:</label>
            <input 
                type="number"
                readOnly
                placeholder="0.00"
                value={calculateSettlement(formData.customDiscountPercentage).savings.toFixed(2)}
            />
            <label>Settlement Offer:</label>
            <input
                type="number"
                readOnly
                placeholder="0.00"
                value={calculateSettlement(formData.customDiscountPercentage).settlementAmount.toFixed(2)}
            />
        </div>
    

                
                
                </div>

        
              <div className="Other">
                    <h4>Other</h4>
                <label htmlFor="customMonthlyPayment">Custom Monthly Payment:</label>
                <input 
                    type="number"
                    name="customMonthlyPayment"
                    value={formData.customMonthlyPayment}
                    onChange={handleInputChange}
                />

                <label htmlFor="monthsToPay">Months to Pay Off:</label>
                <input 
        type="number"
        id="monthsToPay"
        readOnly
        value={monthsToPay}
    />

                <label htmlFor="interestRate">Interest Rate:</label>
                <input 
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                />

</div>       
            </div>

           </div>
           </div>
           
        
    );
};


export default Calculator
