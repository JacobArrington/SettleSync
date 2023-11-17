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
        res.status(201).json({ calculator: newCalc, calculatorInput: newCalcInput });
    }catch (error){
        res.status(400).json({error: error.message})
    }
})

module.exports = router;
