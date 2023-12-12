const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, RepaymentCalculator, CalculatorInput, Installment, Settlement, CustomInputs } = require('../../db/models');

const router = express.Router();

router.post('/', requireAuth, async (req,res) =>{
    try{
       const userId = req.user.id
       const calcName = `${req.user.username}'s Calculator`
        const checkForCalc = await RepaymentCalculator.findOne({where: {userId}});

        if(checkForCalc){
            return res.status(400).json({message: "Only one calculator per user"})
        }
        const newCalc = await RepaymentCalculator.create({userId, calcName});

        const {balance, lumpSum} = req.body
        const remainderAfterLump = balance - lumpSum;
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
                isCustom: false, 
                installmentAmount: installmentTotal,
            
            })
            installments.push(newInstallment)
        }

        if(customInstallment && !predefinedInstallments.includes(customInstallment)){
            const customInstallmentTotal = newCalcInput.balance / customInstallment;
            const customInstallmentRecord = await Installment.create({
                calcInputId: newCalcInput.id, 
                numberOfInstallment: customInstallment,
                isCustom: true, 
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

router.get('/',requireAuth, async (req,res) =>{
    try{
        const userId = req.user.id;

        const calculator = await RepaymentCalculator.findOne({
            where: {userId},
            include:[
                {
                    model: CalculatorInput,
                    as: 'calcInput',
                    include:[
                       {
                        model: Installment,
                        as: 'installments'
                       },
                       {
                        model: Settlement,
                        as: 'settlement'
                       },
                       {
                        model: CustomInputs,
                        as: 'custom'
                       }
                    ]
                }
            ]
        });
        // if(!calculator){
        //     return res.status(404).json({message: "Calculator not found have you created one?"})
        // }
        res.json(calculator);
    }catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.put('/', requireAuth, async(req,res)=>{
    try{
        const userId = req.user.id 
        const {balance, lumpSum, customInstallment, customSettlement, customMonthlyPayment, intrestRate } = req.body

        //calcInput Update
        const calculator = await RepaymentCalculator.findOne({where: {userId}})

        if(!calculator){
            return res.status(404).json({message: "Calculator not found"}); 
        }
        const calcInput = await CalculatorInput.findOne({where: {calcId: calculator.id} })
        if(calcInput){
            await calcInput.update({balance, lumpSum})
        }

        //Installment Update and Recalculation 
        if(customInstallment){
            const installmentTotal = balance / customInstallment

            const [customInstallmentRecord, created] = await Installment.findOrCreate({
                where: {
                    calcInputId: calcInput.id,
                    isCustom: true
                },
                defaults:{
                    calcInputId: calcInput.id,
                    numberOfInstallment: customInstallment,
                    installmentAmount: installmentTotal,
                    isCustom: true
                }
            })
            if(!created){
                await customInstallmentRecord.update({
                    numberOfInstallment: customInstallment,
                    installmentAmount: installmentTotal,
                    isCustom: true
                })
            }
        }
        // Settlement Update and Recalculation 
        if (customSettlement) {
            const savings = balance * (customSettlement / 100);
            const settlementAmount = balance - savings;
        
            const [customSettlementRecord, created] = await Settlement.findOrCreate({
                where: {
                    inputId: calcInput.id,
                    isCustom: true
                },
                defaults: {
                    inputId: calcInput.id,
                    discountPercentage: customSettlement,
                    isCustom: true,
                    settlementAmount,
                    savings
                }
            });
        
            if (!created) {
               
                await customSettlementRecord.update({
                    discountPercentage: customSettlement,
                    settlementAmount,
                    savings
                });
            }
        }

        // Update CustomInputs
        const customInputs = await CustomInputs.findOne({ where: { calcInputId: calcInput.id } });
        if (customInputs) {
            await customInputs.update({ customMonthlyPayment,  intrestRate });
        }
        res.status(200).json({message: "Calculator updated successfully"})
    }catch (error){
        res.status(500).json({error: error.message})
    }
   
})


router.delete('/', requireAuth, async (req, res) =>{
    try{
        const userId = req.user.id; 
        const calculator = await RepaymentCalculator.findOne({where: {userId}})

        if(!calculator){
            return res.status(404).json({message: "Calculator not found"}); 
        }

        await calculator.destroy();

        res.status(200).json({message: "Calculator deleted successfully"})
    } catch(error){
        res.status(500).json({error: error.message})
    }
})


module.exports = router;
