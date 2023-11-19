const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, RepaymentCalculator, CalculatorInput, Installment, Settlement, CustomInputs } = require('../../db/models');
const router = express.Router();

router.post('/calculator', requireAuth, async (req,res) =>{
    try{
       const userId = req.user.id
       const calcName = `${req.user.username}'s Calculator`
        const checkForCalc = await RepaymentCalculator.findOne({where: {userId}});

        if(checkForCalc){
            return res.status(400).json({message: "Only one calculator per user"})
        }
        const newCalc = await RepaymentCalculator.create({userId, calcName});

        const {balance, lumpSum, remainderAfterLump} = req.body
        const calcId = newCalc.id 


        const newCalcInput = await CalculatorInput.create({
            calcId,
            balance,
            lumpSum, 
            remainderAfterLump 
        })

        const { customInstallment } = req.body
        const predefinedInstallments = [2, 3, 6, 9, 12, 18, 24];
        const baseAmount = (remainderAfterLump && remainderAfterLump > 0) ? remainderAfterLump : balance




        let installments = [];
        for(let num of predefinedInstallments){
            const installmentTotal = baseAmount / num
            const newInstallment = await Installment.create({
                calcInputId: newCalcInput.id, 
                numberOfInstallment: num,
                installmentAmount: installmentTotal,
            
            })
            installments.push(newInstallment)
        }

        if(customInstallment && !predefinedInstallments.includes(customInstallment)){
            const customInstallmentTotal = newCalcInput.balance / customInstallment;
            const customInstallmentRecord = await Installment.create({
                calcInputId: newCalcInput.id, 
                numberOfInstallment: customInstallment,
                installmentAmount: customInstallmentTotal, 
            })
            installments.push(customInstallmentRecord)
        }
        const predefinedDiscounts = [5,10,15,20,25];
        const { customDiscountPercentage } = req.body; 

        let settlements = []
        for (let discount of predefinedDiscounts){
            const savings = newCalcInput.balance * (discount / 100);
            const settlementAmount = newCalcInput.balance - savings
            const newSettlement = await Settlement.create({
                inputId: newCalcInput.id,
                discountPercentage: discount, 
                isCustom: false, 
                settlementAmount, 
                savings 

            })
            settlements.push(newSettlement)
        }
        if (customDiscountPercentage && customDiscountPercentage > 0 && customDiscountPercentage <=100){
            const customSavings = newCalcInput.balance * (customDiscountPercentage / 100)
            const customSetllementAmount = newCalcInput.balance - customSavings
            const customSettlement = await Settlement.create({
                inputId: newCalcInput.id,
                discountPercentage: customDiscountPercentage,
                isCustom: true ,
                settlementAmount: customSetllementAmount,
                savings: customSavings,
            }) 
            settlements.push(customSettlement)
        }
        const {customMonthlyPayment , interestRate } = req.body
        let bal = newCalcInput.balance

        if(interestRate && interestRate > 0){
            bal += (bal *(interestRate / 100) / 12);
        }

        let customMonthsToPay = 0; 
        if(customMonthlyPayment && customMonthlyPayment > 0){
            customMonthsToPay = Math.ceil(balance / customMonthlyPayment)
        }

        const newCustomInputs = await CustomInputs.create({
            calcInputId: newCalcInput.id,
            customMonthlyPayment, 
            interestRate,
            customMonthsToPay
        })




        res.status(201).json({ 
            calculator: newCalc, 
            calculatorInput: newCalcInput,
            installments: installments,
            settlements: settlements,
            customInputs: newCustomInputs
        
        });
    }catch (error){
        res.status(400).json({error: error.message})
    }
})

module.exports = router;
